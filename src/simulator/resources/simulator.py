import os
import cantools
import can
import json
import random
import boto3
import time
import subprocess

print("file loaded")
unique_id = os.environ.get('VCAN_ADDRESS', 'vcan0')

def handle_named_signal_value(value):
    if isinstance(value, cantools.database.can.signal.NamedSignalValue):
        try:
            numeric_value = float(value.value)
            return numeric_value
        except ValueError:
            return str(value.value)
    return value

# Function to generate random coordinates based on California state center
def generate_random_coordinates_for_california():
    # California state coordinates with a small random offset
    lat_center = 37.3380979  # Latitude for San Jose city hall
    lng_center = -121.8879641  # Longitude for San Jose city hall
    offset_lat = random.uniform(-0.05, 0.05)
    offset_lng = random.uniform(-0.05, 0.05)
    return lat_center + offset_lat, lng_center + offset_lng

def setup_can_interface():
    try:
        print(f"Creating VCAN network with ID {unique_id}")
        can_sys_cmd = f"sudo ip link add dev {unique_id} type vcan"
        print(f"{unique_id} created")
        stdout = subprocess.run(can_sys_cmd, shell=True, text=True).stdout
        print(stdout)
        can_sys_cmd2 = f"sudo ip link set up {unique_id}"
        stdout2 = subprocess.run(can_sys_cmd2, shell=True, text=True).stdout
        print(stdout2)
        print(f"{unique_id} brought up")
    except Exception as e:
        print(f"Error: {e}")
        #print(f"Error while creating can interface {unique_id}")
    
def load_coordinates_from_file():
    print("loading coordinates file")
    # Create an S3 client
    s3_client = boto3.client('s3')
    
    response = s3_client.get_object(Bucket=os.environ["CONFIG_BUCKET_NAME"],
                                    Key=os.environ["COORDINATES_S3_KEY"])

    content = response['Body'].read().decode('utf-8')
    
    # Parse the JSON content
    json_data = json.loads(content)
    
    all_coordinates = []
    for leg in json_data['Legs']:
        # Append coordinates from each LineString
        all_coordinates.extend(leg['Geometry']['LineString'])
        
    print("coordinates loaded",all_coordinates )
    return all_coordinates
    
# Flags
PROCESS_ONLY_DESIRED_IDS = False
WRITE_TO_FILE = True

# Get the directory where the script is located
#script_dir = os.path.dirname(os.path.abspath(__file__))
#script_dir = "/home/ubuntu/environment/iot-fleetwise-vehicle-simulator/src/main/resources"
script_dir = "/app/resources"

# Change the current working directory to script_dir
os.chdir(script_dir)

# Construct the file paths for CAN database and log files
dbc_file_name = os.path.join(script_dir, "broadcast-can.dbc")
asc_file_name = os.path.join(script_dir, "databin.asc")
new_asc_file_name = os.path.join(script_dir, "databin_NEW.asc")

# Load dbc file to database
db = cantools.database.load_file(dbc_file_name)

# Define the list of arbitration IDs specific to your use case
desired_ids = [3, 257, 768] if PROCESS_ONLY_DESIRED_IDS else None
    
if os.environ.get('COORDINATES_TYPE') == 'LOCATION_SERVICES':
    coordinates_list = load_coordinates_from_file()
    coordinate_count = len(coordinates_list)
    print("Coordinates count -> ",coordinate_count)
    coordinates_used = 0
else:
    # Generate static coordinates for each vehicle
    static_lat, static_lng = generate_random_coordinates_for_california()
    print(f"Generated static coordinates: Latitude: {static_lat}, Longitude: {static_lng}")

# Flag to track if message ID 005 has been received
received_005 = False

def create_bms_firmware_version_message(db, timestamp):
    message_id = 772  # ID for BatteryBroadcast_BMSFirmware
    firmware_version = 1.7  # Hardcoded value for BMSFirmwareVersion

    # Prepare the data dictionary for encoding
    data = {'BMSFirmwareVersion': firmware_version}
    print(f"Data to be encoded: {data}")  # Debug print

    # Encode the message using the dbc file
    encoded_data = db.encode_message(message_id, data)
    print(f"Encoded data for BMSFirmwareVersion: {encoded_data.hex()}")
    print(f"INJECTED ID {message_id}: {data}")
    print(f"INJECTED ID ENCODED {message_id}: {encoded_data}")


    return can.Message(arbitration_id=message_id, data=encoded_data, timestamp=timestamp)


# Process and write messages
with can.ASCWriter(new_asc_file_name, mode='w') as writer:
    with can.ASCReader(asc_file_name) as asclog:
        for mesg in asclog:
            if PROCESS_ONLY_DESIRED_IDS and desired_ids is not None and mesg.arbitration_id not in desired_ids:
                continue

            try:
                original_msg_data = db.decode_message(mesg.arbitration_id, mesg.data)
                original_msg_data = {k: handle_named_signal_value(v) for k, v in original_msg_data.items()}
                #print(f"Original ID {mesg.arbitration_id}: {original_msg_data}")
                #print(f"Original Message Binary: {mesg.data.hex()}")

                # Create a copy of the original message data
                modified_msg_data = original_msg_data.copy()

                # Override Latitude and Longitude for specific message ID
                if mesg.arbitration_id == 3:  # Assuming ID 3 is for lat/lng
                    
                    if os.environ.get('COORDINATES_TYPE') == 'STATIC':
                        modified_msg_data['Latitude'] = static_lat
                        modified_msg_data['Longitude'] = static_lng
                        print(f"Static Latitude: {static_lat}, Static Longitude: {static_lng}")
                    elif os.environ.get('COORDINATES_TYPE') == 'LOCATION_SERVICES':
                        if coordinates_used < coordinate_count:
                            print("Update coordinates")
                            modified_msg_data['Latitude'] = coordinates_list[coordinates_used][1]
                            modified_msg_data['Longitude'] = coordinates_list[coordinates_used][0]
                            coordinates_used += 1
                        else:
                            print("Use final coordinate")
                            modified_msg_data['Latitude'] = coordinates_list[coordinate_count-1][1]
                            modified_msg_data['Longitude'] = coordinates_list[coordinate_count-1][0]

                # Modify other message data if necessary (use modified_msg_data)
                if mesg.arbitration_id == 768:
                    modified_msg_data['hasActiveDTC'] = 0
                    print(f"Overriding hasActiveDTC = 0")

                #print(f"Modified ID {mesg.arbitration_id}: {modified_msg_data}")
                encoded_msg = db.encode_message(mesg.arbitration_id, modified_msg_data, scaling=True, padding=False, strict=False)\
                
                new_message = can.Message(
                    arbitration_id=mesg.arbitration_id,
                    data=encoded_msg,
                    timestamp=mesg.timestamp,
                    is_extended_id=mesg.is_extended_id
                )

                #Useful Debugs
                #if mesg.arbitration_id == 768:
                #    print(f"Original Encoded Data: {mesg}")
                #    print(f"Modified Encoded Data: {new_message}")
                #    print(f"Original Encoded MESSAGE Data: {mesg.data}")
                #    print(f"Original Encoded MESSAGE Data: {new_message.data}")
                         
                if WRITE_TO_FILE:
                    writer.on_message_received(new_message)

                # Check if the current message is ID 005
                if mesg.arbitration_id == 5:
                    #Use the timestamp from the message that triggered this
                    if WRITE_TO_FILE:
                       # Create and write the new BMSFirmwareVersion message
                       writer.on_message_received(create_bms_firmware_version_message(db,mesg.timestamp))

            except KeyError:
                #print(f"KeyError: Message with arbitration ID {mesg.arbitration_id} not found in DBC.")
                pass
            except Exception as e:
                print(f"Exception: {e}")


#CAN replay
print("Starting CAN replay loop...")

# Define file paths for CAN replay
binfilepath = "./databin_NEW"
log_file_path = binfilepath + ".log"
asc_file_path = binfilepath + ".asc"


# Setup VCAN interface
setup_can_interface()

try:
    time.sleep(1)
    # Construct and run the asc2log command
    asc2log_command = f"asc2log -I {asc_file_path} -O {log_file_path}"
    print("Executing command:", asc2log_command)
    os.system(asc2log_command)
    
    while True:  # Infinite loop for replaying the signals
        # Construct and run the canplayer command
        canplayer_command = f"canplayer -I {log_file_path} {unique_id}=can0"
        print("Executing command:", canplayer_command)
        os.system(canplayer_command)
        time.sleep(20)
except KeyboardInterrupt:
    print("CAN replay loop stopped by user.")

print("CAN replay completed.")