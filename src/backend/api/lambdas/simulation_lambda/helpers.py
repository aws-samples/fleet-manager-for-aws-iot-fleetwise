import os
import json
import boto3
import uuid
import logging
import datetime
import time
from decimal import Decimal, getcontext, ROUND_HALF_UP
from typing import Callable, Dict, Any
from boto3.dynamodb.conditions import Key
from io import BytesIO
from botocore.exceptions import NoCredentialsError

logging.getLogger().setLevel(logging.INFO)

# define boto3 clients
ts_client = boto3.client('timestream-query')
iot_client = boto3.client('iot')
fleetwise_client = boto3.client('iotfleetwise')
lambda_client = boto3.client("lambda")
s3_client = boto3.client("s3")
dynamodb_client = boto3.resource('dynamodb')

ecs_invoke_lambda_arn = os.environ["ECS_INVOKE_LAMBDA_ARN"]


def datetime_handler(x):
    if isinstance(x, datetime.datetime):
        return x.isoformat()
    raise TypeError("Unknown type")

def return_op(status, output) -> Dict[str, int | str]:
    logging.info(output)
    return {
        'statusCode': status,
        'headers': {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
            },
        'body': json.dumps(output, default=datetime_handler)
    }

def get_vcan_port(vehicle_name):
    try:
        llm_table = dynamodb_client.Table(os.getenv("DDB_TABLE"))

        response = llm_table.query(
            KeyConditionExpression=boto3.dynamodb.conditions.Key('pk').eq("SIMULATIONS"))

        print("simulators data -> ", response)

        simulation_count = len(response["Items"])
        ports = {}
        for item in response["Items"]:
            ports[item["vcan"]] = item["sk"]
            
        port = "vcan" + str(simulation_count)
        
        if ports.get(port) is None:
            return port
        else:
            return  "vcan" + str(simulation_count+5)
        
    except Exception as e:
        logging.error(e)
        return "error"

    
def add_trip(trip_payload):
    print("Adding Trip to dynamo ")
    try:
        llm_table = dynamodb_client.Table(os.getenv("DDB_TABLE"))
        
        trip_payload["pk"] = "TRIP:"+trip_payload["vehicle_name"]
        trip_payload["sk"] = str(uuid.uuid4())     
        
        
        print("DynamoDb payload - >",trip_payload )

        llm_table.put_item(Item=trip_payload)
    except Exception as e:
        logging.error(e)
        return "error"

def add_location_to_s3(vehicle_name,location_data):
    # Serialize dict to JSON formatted string
    json_string = json.dumps(location_data)

    # Convert string to bytes
    json_bytes = json_string.encode('utf-8')

    # Use BytesIO to create a file-like object from bytes
    json_buffer = BytesIO(json_bytes)

    try:
        # Upload the file-like object to S3
        s3_client.upload_fileobj(json_buffer, os.environ["LOCATIONS_BUCKET"], vehicle_name)
    except NoCredentialsError:
        logging.error("Credentials not available")
        return False
    except Exception as e:
        logging.error(f"Failed to upload file: {str(e)}")
        return False
    return True

def invoke_ecs_simulation(vehicle_name, vcan_port):
    try:
        # invoke ecs simulation lambda 
        logging.info(f"invoke ecs simulation lambda for {vehicle_name}")
        simulation_input_params = {
            "vehicle_id": vehicle_name,
            "status": "start-simulation",
            "vcan_port":vcan_port
        }
        simulation_lambda_response = lambda_client.invoke(
                                        FunctionName = ecs_invoke_lambda_arn,
                                        InvocationType = "Event",
                                        Payload = json.dumps(simulation_input_params)
                                    )
        logging.info(f"simulation_lambda_response: {simulation_lambda_response}")
        return simulation_lambda_response
    except Exception as e:
        logging.error(e)
        return "error"
        
        
def add_simulation_task_to_db(vehicle_id, vcan):
    try:
        llm_table = dynamodb_client.Table(os.getenv("DDB_TABLE"))

        payload = {"pk": "SIMULATIONS",
                   "sk": vehicle_id,
                   "vcan":vcan,
                   "status":"STARTING"
                   }

        llm_table.put_item(Item=payload)
    except Exception as e:
        logging.error(e)
        return "error"


def start_simulator(data):
    vehicle_name = data["vehicle-name"]

    # set trip simulation status
    # trip simulation status is false by default
    SIMULATE_TRIP = False    
    location_data = data.get("locationData")
    if location_data:
        print("Simulating trip")
        
        print("Location Data - >", location_data)
        
        
        SIMULATE_TRIP = True        
        trip_payload = {
            "date":datetime.datetime.now().strftime("%Y-%m-%d"),
            "vehicle_name": vehicle_name,
            "start": data.get("startAddress"),
            "stop":data.get("endAddress"),
            "duration": Decimal(location_data.get("Summary").get("DurationSeconds")).quantize(Decimal('1.000')),
            "distance": Decimal(location_data.get("Summary").get("Distance")).quantize(Decimal('1.000'))
        }
        
        print("Trip Payload - > ",trip_payload)
        
        #Add Trip to dynamodb  
        trip_response = add_trip(trip_payload)
        print("trip added to dynamodb")
        if trip_response == "error":
            return_op(400, "Error adding trip data to Database")
        
        print("adding location data to s3")
        #save location data to s3
        add_location_to_s3(vehicle_name,location_data)

    # generate unique vcan port  
    vcan_port = get_vcan_port(vehicle_name)    
    
    
    try:
        # invoke ecs simulation lambda
        logging.info(f"invoke ecs simulation lambda for {vehicle_name}")
        simulation_input_params = {
            "vehicle_id": vehicle_name,
            "status": "start-simulation",
            "vcan_port":vcan_port
        }
        
        #add location key if we are simulating a route. 
        if SIMULATE_TRIP==True:
            simulation_input_params["s3_key"] = vehicle_name
        
        simulation_lambda_response = lambda_client.invoke(
                                        # change to environment variable
                                        FunctionName = ecs_invoke_lambda_arn,
                                        InvocationType = "Event",
                                        Payload = json.dumps(simulation_input_params)
                                    )
                                    
        add_simulation_task_to_db(vehicle_id=vehicle_name,vcan=vcan_port)
        
        #update dynamo vehicle status
        print(f"simulation_lambda_response: {simulation_lambda_response}")
        
        return {
             data["vehicle-name"]:{
                 "vehicle_name":vehicle_name,
                 "vehicle_simulator_status":"STARTING"
             }
        }
        
    except Exception as e:
        print(f"error: {e}")
        return {"error": "error while starting simulation using multifleet lambda"}
    
def stop_simulator(vehicle_name):
    try:
        llm_table = dynamodb_client.Table(os.getenv("DDB_TABLE"))

        # Use get_item to retrieve the item with the specified partition and sort keys
        response = llm_table.get_item(
            Key={
                'pk': "SIMULATIONS",
                'sk': vehicle_name
            }
        )

        # Check if the item exists and return it
        if 'Item' in response:
            ecs_client = boto3.client('ecs')
            simulation_details = response['Item']
            ecs_client.stop_task(
            cluster=os.environ["ECS_CLUSTER_NAME"],
            task=simulation_details["task_arn"],
            reason='Stopping simulator for '+vehicle_name
        )
        
            llm_table.delete_item(
            Key={
                'pk': "SIMULATIONS",
                'sk': vehicle_name
            }
            )
            
            return {"message": "simulation has stopped"}
        else:
            return_op(400, "Simulation not active")
        
    except Exception as e:
        logging.error(e)
        return "error"