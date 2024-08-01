import os
import json
import boto3
import logging
import datetime
import time
import segno
from inspect import signature
from typing import Callable, Dict, Any
from random import choices, randint

logging.getLogger().setLevel(logging.INFO)

# define boto3 clients
fleetwise_client = boto3.client("iotfleetwise")
iot_client = boto3.client("iot")
ts_client = boto3.client('timestream-query')
ts_write_client = boto3.client('timestream-write')
dynamodb_client = boto3.resource('dynamodb')
s3_client = boto3.client('s3', region_name='us-east-1')
endpointUrl = s3_client.meta.endpoint_url
s3_client = boto3.client('s3', endpoint_url=endpointUrl, region_name=os.getenv("REGION"))
s3r = boto3.resource('s3')

# return datetime


def datetime_handler(x):
    if isinstance(x, datetime.datetime):
        return x.isoformat()
    raise TypeError("Unknown type")

# return output status code and message


def return_op(status, output) -> Dict[str, int | str]:
    logging.info(output)
    return {
        'statusCode': status,
        'headers': {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        },
        'body': json.dumps(output, default=datetime_handler)
    }


def create_campaign(name, arn):
    campaign_name = f'{os.getenv("PREFIX")}_{name}_campaign_{os.getenv("ENVIRONMENT")}'
    logging.info("Creating Campaign")
    try:
        campaign = fleetwise_client.create_campaign(
            name=campaign_name,
            description=campaign_name,
            signalCatalogArn=os.getenv("SIGNAL_CATALOG_ARN"),
            targetArn=arn,
            diagnosticsMode='SEND_ACTIVE_DTCS',
            spoolingMode='TO_DISK',
            compression='SNAPPY',
            signalsToCollect=[
                {
                    'name': 'Vehicle.Chassis.Axle.LeftFrontTirePressure'
                },
                {
                    'name': 'Vehicle.Chassis.Axle.LeftFrontTireTemperature'
                },
                {
                    'name': 'Vehicle.Chassis.Axle.LeftRearTirePressure'
                },
                {
                    'name': 'Vehicle.Chassis.Axle.LeftRearTireTemperature'
                },
                {
                    'name': 'Vehicle.Chassis.Axle.RightFrontTirePressure'
                },
                {
                    'name': 'Vehicle.Chassis.Axle.RightFrontTireTemperature'
                },
                {
                    'name': 'Vehicle.Chassis.Axle.RightRearTirePressure'
                },
                {
                    'name': 'Vehicle.Chassis.Axle.RightRearTireTemperature'
                },
                {
                    'name': 'Vehicle.CurrentLocation.Latitude'
                },
                {
                    'name': 'Vehicle.CurrentLocation.Longitude'
                },
                {
                    'name': 'Vehicle.InCabinTemperature'
                },
                {
                    'name': 'Vehicle.OutsideAirTemperature'
                },
                {
                    'name': 'Vehicle.Speed'
                },
                {
                    'name': 'Vehicle.TotalOperatingTime'
                },
                {
                    'name': 'Vehicle.Powertrain.Battery.hasActiveDTC'
                },
                {
                    'name': 'Vehicle.Powertrain.Battery.FanRunning'
                },
                {
                    'name': 'Vehicle.Powertrain.Battery.BatteryAvailableChargePower'
                },
                {
                    'name': 'Vehicle.Powertrain.Battery.BatteryAvailableDischargePower'
                },
                {
                    'name': 'Vehicle.Powertrain.Battery.BatteryCurrent'
                },
                {
                    'name': 'Vehicle.Powertrain.Battery.BatteryDCVoltage'
                },
                {
                    'name': 'Vehicle.Powertrain.Battery.Charging.IsCharging'
                },
                {
                    'name': 'Vehicle.Powertrain.Battery.StateOfCharge.Current'
                },
                {
                    'name': 'Vehicle.Powertrain.Battery.StateOfHealth'
                },
                {
                    'name': 'Vehicle.Powertrain.Battery.Module.MaxTemperature'
                },
                {
                    'name': 'Vehicle.Powertrain.Battery.Module.MinTemperature'
                },
                {
                    'name': 'Vehicle.Powertrain.Battery.Module.MaxCellVoltage'
                },
                {
                    'name': 'Vehicle.Powertrain.Battery.Module.MinCellVoltage'
                }
            ],
            collectionScheme={
                'conditionBasedCollectionScheme': {
                    'expression': '$variable.`Vehicle.Powertrain.Battery.hasActiveDTC` == true || $variable.`Vehicle.Powertrain.Battery.StateOfHealth` >= 0',
                    'minimumTriggerIntervalMs': 10000,
                    'triggerMode': 'ALWAYS',
                    'conditionLanguageVersion': 1
                }
            },
            dataDestinationConfigs=[
                {
                    'timestreamConfig': {
                        'timestreamTableArn': os.environ["TS_TABLE_ARN"],
                        'executionRoleArn':  os.environ['TS_EXEC_ROLE']
                    }
                },
            ]
        )

        # logging.info(f'arn:aws:timestream:{os.getenv("REGION")}:{os.getenv("ACCOUNT")}:database/{name_helper("telemetry_database")}/table/{name_helper("telemetry_table")}')
        retry_count = 10
        delay = 2
        while retry_count > 1:
            logging.info(f"waiting for campaign {campaign_name} to be created")
            time.sleep(5)      # wait to get campaign data
            response = fleetwise_client.get_campaign(name=campaign_name)
            logging.info(f"get_campaign response {response}")
            if response['status'] == "WAITING_FOR_APPROVAL":
                break
            # time.sleep(delay)
            retry_count -= 1
        logging.info(f"approving the campaign {campaign_name}")
        response = fleetwise_client.update_campaign(
            name=campaign_name,
            action='APPROVE'
        )
        logging.info(f"update_campaign response {response}")
        return True
    except Exception as e:
        logging.info(f"Logging campaign create exception")
        logging.error(str(e))
        if "LimitExceededException" in e:
            logging.error("Limit for maximum number of campaigns exceeded")
            return "LimitExceededException"
        return False


def associate_vehicle(fleet_name, vehicle_name):
    try:
        logging.info("Adding Vehicle to fleet")
        response = fleetwise_client.associate_vehicle_fleet(
            vehicleName=vehicle_name,
            fleetId=fleet_name
        )
        response["vehicle-name"] = vehicle_name
        response["fleet-name"] = fleet_name
        response["state"] = "associated"
        response["status"] = 200
        return response
    except Exception as e:
        logging.error(e)
        return return_op(409, f"Error while adding vehicle {vehicle_name} to fleet {fleet_name}")


def disassociate_vehicle(fleet_name, vehicle_name):
    try:
        logging.info("disassociate Vehicle from fleet")
        response = fleetwise_client.disassociate_vehicle_fleet(
            vehicleName=vehicle_name,
            fleetId=fleet_name
        )
        response["vehicle-name"] = vehicle_name
        response["fleet-name"] = fleet_name
        response["state"] = "disassociated"
        response["status"] = 200
        return response
    except Exception as e:
        logging.error(e)
        return return_op(409, f"Error while disassociating {vehicle_name} from fleet {fleet_name}")

# create a new vehicle


def create_vehicle(data):
    try:
        logging.info("Creating new vehicle...")
        # set VIN as vehicle name and the alphabets are all caps
        data["vehicle-name"] = data['vin'].upper()

        # ensure VIN is of 17 digits and is alphanumeric
        if not len(data["vehicle-name"]) == 17 or not data["vehicle-name"].isalnum():
            return return_op(400, "The VIN should be of 17 digits and of type alphanumeric only, with capital alphabets")

        vehicle_data_list = list_vehicles()
        # logging.info(f"vehicle_list: {vehicle_data_list}")
        for vehicle in vehicle_data_list["vehicleSummaries"]:
            # logging.info(f"VEHICLE DATA: {vehicle}")
            # ensure that VIN i.e. vehicle name is unique
            if vehicle["vehicleName"] == data["vehicle-name"]:
                return return_op(403, "{} already exists. Please choose a unique VIN".format(data["vehicle-name"]))
            """
            elif vehicle["attributes"]:
                # ensure license number is unique
                logging.info("Attributes: {}".format(vehicle["attributes"]))
                if vehicle["attributes"]["license"] == data["license"]:
                    return return_op(403, "{} license plate already exists".format(data["license"]))
            """

        vehicle_response = fleetwise_client.create_vehicle(
            vehicleName=data['vehicle-name'],
            modelManifestArn=os.getenv("VEHICLE_MODEL_ARN"),
            decoderManifestArn=os.getenv("DECODER_MANIFEST_ARN"),
            attributes={
                "vin": data['vin'],
                "make": data['make'],
                "model": data['model'],
                "year": data['year'],
                "license": data['license'].upper()
            },
            associationBehavior='CreateIotThing'
        )
        # Add Attributes:
        response = iot_client.update_thing(
            thingName=data['vehicle-name'],
            thingTypeName=os.environ["THING_TYPE_NAME"],
            attributePayload={
                'attributes': {
                    'model': data['model'],
                    'make': data['make'],
                    'vin': data['vin'],
                    'year': data['year'],
                    'license': data['license']
                }
            }
        )
        # Create Certificate
        logging.info("Creating certificate for iot thing")
        ret = {"PhysicalResourceId": data["vehicle-name"]}
        response = iot_client.create_keys_and_certificate(setAsActive=True)
        # logging.info(f"Create_keys_and_certificate response {response}")
        ret["Data"] = {
            "certificateId": response["certificateId"],
            "certificateArn": response["certificateArn"],
            "certificatePem": response["certificatePem"],
            "privateKey": response["keyPair"]["PrivateKey"],
        }

        response = iot_client.describe_endpoint(endpointType="iot:Data-ATS")
        logging.info(f"describe_endpoint response {response}")
        ret["Data"]["endpointAddress"] = response["endpointAddress"]

        certs_file_name = '/tmp/' + ret['PhysicalResourceId'] + '.json'
        with open(certs_file_name, 'w+', encoding='utf-8') as f:
            json.dump(ret['Data'], f, ensure_ascii=False, indent=4)

        logging.info("Write to S3")

        bucket_name = os.getenv("CERTS_BUCKET")
        s3_client.upload_file(certs_file_name, bucket_name,
                              f"{ret['PhysicalResourceId']}/{ret['PhysicalResourceId']}.json")

        logging.info("Cert Writen to S3")

        iot_policy = f'{os.getenv("PREFIX")}_iot_policy_{os.getenv("ENVIRONMENT")}'

        logging.info("attach policy")
        iot_client.attach_policy(
            policyName=iot_policy, target=ret["Data"]["certificateArn"])
        iot_client.attach_thing_principal(
            thingName=data["vehicle-name"], principal=ret["Data"]["certificateArn"])

        # Add vehicle to fleet
        logging.info("associate vehicle")
        associate_vehicle(data['fleet-name'], data['vehicle-name'])
        
        # Add initial record to Timestream:
        insert_vehicle_data(data)
        
        return vehicle_response
    except Exception as e:
        logging.error(e)
        return return_op(500, "Error while creating a new vehicle")

# list all vehicles in the account


def list_vehicles():
    try:
        logging.info("listing all vehicles in the account")
        response = fleetwise_client.list_vehicles()
        logging.info(response)
        for item in response['vehicleSummaries']:
            try:
                iot_response = iot_client.describe_thing(
                    thingName=item['vehicleName'])
                if iot_response['attributes']:
                    item['attributes'] = iot_response["attributes"]
                else:
                    item['attributes'] = {}
            except:
                pass
        return response
    except Exception as e:
        logging.error(e)
        return return_op(500, "Error while listing all fleets")

# fetch vehicle_simulator_status within each campaign


def get_vehicle_simulator_status(vehicle_name):

    llm_table = dynamodb_client.Table(os.getenv("DDB_TABLE"))

    try:
        response = llm_table.get_item(
            Key={
                'pk': "SIMULATIONS",
                'sk': vehicle_name
            }
        )

        if 'Item' in response:
            print("dynamodb simulation response - >", response)
            vehicle_simulator_status = response['Item']['status']
        else:
            vehicle_simulator_status = "STOPPED"

        return vehicle_simulator_status
    except Exception as e:
        logging.error(e)
        return return_op(400, f"Error while fetching {vehicle_name} sumulator status")

# get vehicle data


def get_vehicle(vehicle_name):
    try:
        logging.info(f"Get vehicle data for {vehicle_name}")
        try:
            ifw_response = fleetwise_client.get_vehicle(
                vehicleName=vehicle_name)
            logging.info(f"ifw_response for {vehicle_name} is {ifw_response}")
        except Exception as e:
            logging.error(e)
            return return_op(404, str(e))

        iot_response = iot_client.describe_thing(thingName=vehicle_name)
        logging.info(f"iot_response for {vehicle_name} is {iot_response}")
        ifw_response["attributes"] = iot_response["attributes"]

        # Get vehicle Simulator status

        print("Get simulation status")

        vehicle_simulator_status = get_vehicle_simulator_status(vehicle_name)
        if vehicle_simulator_status == "error":
            return return_op(404, "Error while fetching vehicle simulation status")

        ifw_response['vehicle_simulator_status'] = vehicle_simulator_status

        logging.info(
            f"ifw_response for vehicle {vehicle_name} is: {ifw_response}")
        return ifw_response
    except Exception as e:
        logging.error(e)
        return return_op(409, f"Error while fetching vehicle data for {vehicle_name}")

# delete a vehicle


def delete_vehicle(vehicle_name):
    try:
        logging.info(f"Delete vehicle {vehicle_name}")
        fleetwise_client.delete_vehicle(vehicleName=vehicle_name)

        # Delete IoT Thing
        logging.info("DELETING {} from IoT Core".format(vehicle_name))

        try:
            r_principals = iot_client.list_thing_principals(
                thingName=vehicle_name)
        except Exception as e:
            logging.info("ERROR listing thing principals: {}".format(e))
            r_principals = {'principals': []}

        for arn in r_principals['principals']:
            cert_id = arn.split('/')[1]
            logging.info("arn: {} cert_id: {}".format(arn, cert_id))

            r_detach_thing = iot_client.detach_thing_principal(
                thingName=vehicle_name, principal=arn)
            logging.info("DETACH THING: {}".format(r_detach_thing))

            r_upd_cert = iot_client.update_certificate(
                certificateId=cert_id, newStatus='INACTIVE')
            logging.info("INACTIVE: {}".format(r_upd_cert))

            r_policies = iot_client.list_principal_policies(principal=arn)

            for policy in r_policies['policies']:
                policy_name = policy['policyName']
                logging.info("policy_name: {}".format(policy_name))
                r_detach_policy = iot_client.detach_policy(
                    policyName=policy_name, target=arn)
                logging.info("DETACH POLICY: {}".format(r_detach_policy))

            r_delete_cert = iot_client.delete_certificate(
                certificateId=cert_id, forceDelete=True)
            logging.info("DELETE CERT: {}".format(r_delete_cert))

            r_delete_thing = iot_client.delete_thing(thingName=vehicle_name)
            logging.info("DELETE THING: {}\n".format(r_delete_thing))
            return return_op(200, f"vehicle {vehicle_name} deleted successfully")
    except Exception as e:
        logging.error(e)
        return return_op(500, f"Error while deleting vehicle {vehicle_name}")

# update vehicle data


def update_vehicle(data):
    try:
        logging.info("Update a vehicle")
        return fleetwise_client.update_vehicle(data)
    except Exception as e:
        logging.error(e)
        return return_op(409, "Error while updating vehicle.")

# creating a new fleet


def create_fleet(data):
    logging.info("Creating new fleet")
    logging.info(data)
    try:
        response = fleetwise_client.create_fleet(
            fleetId=data['fleet-name'],
            description='CMS Fleet',
            signalCatalogArn=os.getenv("SIGNAL_CATALOG_ARN")
        )

        create_campaign(response["id"], response["arn"])

        return response
    except Exception as e:
        if "ConflictException" in str(e):
            logging.error(e)
            return return_op(409, str(e))
        else:
            logging.error(e)
            return return_op(409, str(e))

# list all existing fleets


def list_fleets():
    try:
        logging.info("listing all fleets")
        return fleetwise_client.list_fleets()
    except Exception as e:
        logging.error(e)
        return return_op(409, "Error while fetching fleet list")

# fetch fleet details


def get_fleet(fleet_name):
    logging.info(f"Get fleet {fleet_name} details")
    try:
        return fleetwise_client.get_fleet(fleetId=fleet_name)
    except Exception as e:
        logging.error(e)
        return return_op(404, str(e))

# delete a fleet


def delete_fleet(fleet_name):
    logging.info("Delete a fleet")
    try:
        response = fleetwise_client.delete_fleet(fleetId=fleet_name)
        response["status"] = "deleted"
        return response
    except Exception as e:
        logging.error(e)
        if "ValidationException" in e:
            return return_op(400, "Ensure the fleet is empty by diassociating all the vehicles in it")
        return return_op(500, str(e))

# update fleet details


def update_fleet(data):
    try:
        logging.info(f"Update fleet {data["fleet-name"]}")
        response = fleetwise_client.update_fleet(
            fleetId=data["fleet-name"],
            description=data["description"]
        )
        response["status"] = 200
        return response
    except Exception as e:
        logging.error(e)
        return_op(409, "Error while updating fleet {}".format(
            data["fleet-name"]))


"""
def add_vehicle_to_fleet(fleet_name, vehicle_name):
    try:
        logging.info("Adding Vechile to fleet")
        return fleetwise_client.associate_vehicle_fleet(
                        vehicleName=vehicle_name,
                        fleetId=fleet_name
                    )
    except Exception as e:
        logging.error(e)
        return return_op(409, f"Error while add vehicle {vehicle_name} to fleet {fleet_name}")
"""

# list all the vehicles in the fleet


def list_vehicles_in_fleet(fleet_name):
    try:
        logging.info("list vehicles in fleet")
        try:
            response = fleetwise_client.list_vehicles_in_fleet(
                fleetId=fleet_name)
        except Exception as e:
            if "ResourceNotFoundException" in str(e):
                return return_op(409, f"Fleet {fleet_name} not found")
            return return_op(404, str(e))

        logging.info(f"List of vehicles in the fleet: {response}")
        vehicles_list = []
        for item in response["vehicles"]:
            vehicles_list.append(get_vehicle(item))

        logging.info(f"Vehicle_list data: {vehicles_list}")

        total_vehicle_count = len(vehicles_list)
        fleet_vehicle_data = {
            "totalCount": total_vehicle_count,
            "vehicles": vehicles_list
        }

        logging.info(f"List of vehicles for fleet {fleet_name}")
        logging.info(fleet_vehicle_data)
        return fleet_vehicle_data
    except Exception as e:
        logging.error(e)
        return return_op(500, "Error while listing fleets")

# list the fleets the vehicle belongs to


def list_fleets_for_vehicle(vehicle_name):
    try:
        logging.info("list fleets for vehicle")
        return fleetwise_client.list_fleets_for_vehicle(
            vehicleName=vehicle_name
        )
    except Exception as e:
        logging.error(e)
        return return_op(500, f"Error while listing fleets the vehicle{vehicle_name} belongs to")

# list all campaigns (set campaign status=RUNNING to get running campaigns)


def list_campaigns(campaign_status=False):
    try:
        if campaign_status == "RUNNING":
            campaign_list = fleetwise_client.list_campaigns(status='RUNNING')

        campaign_list = fleetwise_client.list_campaigns()
        logging.info(f"campaign_list: {campaign_list}")
        active_campaigns = []
        for item in campaign_list["campaignSummaries"]:
            logging.info(item)
            active_campaigns.append(item["name"])

        logging.info(f"Active campaigns: {active_campaigns}")
        return active_campaigns
    except Exception as e:
        logging.error(e)
        return return_op(500, "Error while listing all campaigns")

# list vehicles in a campaign


def list_vehicles_for_campaign(campaign_name):
    try:
        logging.info(f"Fetching campaign details for {campaign_name}:")
        vehicle_response = {}
        # get campaign details
        try:
            response = fleetwise_client.get_campaign(name=campaign_name)
            logging.info(response)
        except Exception as e:
            return return_op(404, str(e))

        # get campaign simulator status
        campaign_simulator_status = response['status']
        logging.info(f"Campaign simulator status: {campaign_simulator_status}")
        if not campaign_simulator_status == "RUNNING":
            logging.info("Campaign is not active.")
        vehicle_response["campaign_simulator_status"] = campaign_simulator_status

        # for single vehicle in campaign, new fleet is not created
        # so we can fetch data by vehicle
        # campaign has vehicle
        if 'vehicle' in response['targetArn'].split('/')[0]:
            results = []
            vehicle_name = response['targetArn'].split('/')[-1]
            logging.info(f"vehiclename: {vehicle_name}")
            response = get_vehicle_data(vehicle_name)
            metadata, vehicle_simulator_status = get_vehicle_metadata(
                vehicle_name)
            results.append({
                "vehicle_name": vehicle_name,
                "telemetry": response,
                "metadata": metadata,
                "vehicle_simulator_status": vehicle_simulator_status
            })
            vehicle_response["totalCount"] = 1
            vehicle_response["vehicles"] = results
        else:
            # if more than 1 vehicle is added to campaign, a new fleet is created
            # fetch data for vehicles in fleet
            fleet_name = response['targetArn'].split('/')[-1]
            response = list_vehicles_in_fleet(fleet_name)
            logging.info(f"list_vehicles_in_fleet {fleet_name}: {response}")

            vehicles = []
            vehicle_response['totalCount'] = response['totalCount']
            for item in response['vehicles']:
                vehicle_dict = {}
                # vehicles.append(get_vehicle_data(item['vehicleName']))
                # vehicles.append(get_vehicle_metadata(item['vehicleName']))
                vehicle_data = get_vehicle_data(item['vehicleName'])
                vehicle_dict["vehicle_name"] = vehicle_data["vehicleName"]
                vehicle_dict["telemetry"] = vehicle_data
                vehicle_dict["metadata"], vehicle_dict["vehicle_simulator_status"] = get_vehicle_metadata(
                    item['vehicleName'])
                vehicles.append(vehicle_dict)
            vehicle_response['vehicles'] = vehicles
        return vehicle_response
    except Exception as e:
        logging.error(e)
        return return_op(500, f"Error while listing vehicles in campaign {campaign_name}")

# fetch vehicle metadata


def get_vehicle_metadata(vehicle_name):
    try:
        logging.info(f"Getting vehicle metadata for {vehicle_name}")
        response = get_vehicle(vehicle_name)
        logging.info(f"Vehicle metadata: {response}")
        vehicle_metadata = response["attributes"]
        vehicle_simulator_status = response["vehicle_simulator_status"]
        return vehicle_metadata, vehicle_simulator_status
    except Exception as e:
        logging.error(e)
        return return_op(500, f"Error while fetching vehicle {vehicle_name} metadata")

# get vehicle data from timestream DB

def _current_milli_time():
    return str(int(round(time.time() * 1000)))
    
def insert_vehicle_data(data: dict):
    current_time = _current_milli_time()

    dimensions = [
      {'Name': 'vehicleName', 'Value': data['vehicle-name']},
      {'Name': 'model', 'Value': data['model']},
      {'Name': 'make', 'Value': data['make']},
      {'Name': 'vin', 'Value': data['vin']}
    ]
    
    telemetry_latitude_record = {
      'Dimensions': dimensions,
      'MeasureName': 'Vehicle.CurrentLocation.Latitude',
      'MeasureValue': '33.7488',
      'MeasureValueType': 'DOUBLE',
      'Time': current_time
    }
    
    telemetry_longitude_record = {
      'Dimensions': dimensions,
      'MeasureName': 'Vehicle.CurrentLocation.Longitude',
      'MeasureValue': '84.3877',
      'MeasureValueType': 'DOUBLE',
      'Time': current_time
    }

    records = [telemetry_latitude_record, telemetry_longitude_record]

    try:
        result = ts_write_client.write_records(DatabaseName=os.getenv("TS_DATABASE"), TableName=os.getenv("TS_TABLE"),
                     Records=records, CommonAttributes={})
        print("WriteRecords Status: [%s]" % result['ResponseMetadata']['HTTPStatusCode'])
    except Exception as err:
     print("Error:", err)

def get_vehicle_data(vehicle_name: str):
    query_string = """
                    SELECT vehicleName, 
                    measure_name,
                    max_by(measure_value::double, time) as latest_value,
                    max_by(time, time) as latest_timestamp
                    FROM "{}"."{}" WHERE vehicleName = '{}'
                    GROUP By vehicleName, measure_name
                    """.format(os.getenv("TS_DATABASE"), os.getenv("TS_TABLE"), vehicle_name)
    try:
        paginator = ts_client.get_paginator('query')
        pageIterator = paginator.paginate(
            QueryString=query_string,
        )

        results = {}
        results['vehicleName'] = vehicle_name
        count = 0

        for page in pageIterator:
            count += 1
            if 'Rows' not in page or len(page['Rows']) == 0:
                continue
            else:
                for item in page['Rows']:
                    logging.info("Item -->", item)
                    if item['Data'][0]['ScalarValue'] == vehicle_name:
                        measure_name = item['Data'][1]['ScalarValue']
                        try:
                            results[measure_name.split(
                                '.')[-1]] = item['Data'][2]['ScalarValue']
                        except:
                            results[measure_name.split(
                                '.')[-1]] = item['Data'][2]['NullValue']
                        # finally:
                        #    logging.info("Adding Timestamp in UTC...")
                        #    results['timestamp_latest']['timestamp'] = item['Data'][-1]['ScalarValue']
        return results
    except Exception as err:
        logging.info("Exception while running query:", err)
        return return_op(409, f"Error in fetching {vehicle_name} vehicle details from Timestream")

# download file from S3 Bucket


def download_from_s3(bucket, key):
    try:
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket, 'Key': key},
            ExpiresIn=300)
        return url
    except Exception as e:
        logging.error(e)
        return return_op(500, str(e))


def download_vehicle_cert(vehicle_name):
    try:
        vehicle_cert_link = download_from_s3(
            os.environ["CERTS_BUCKET"],
            f'{vehicle_name}/{vehicle_name}.json'
        )
        logging.info(vehicle_cert_link)
        logging.info(f"{vehicle_name} certificate downloaded successfully")
        return vehicle_cert_link
    except Exception as e:
        logging.error(e)
        return return_op(404, f"Couldn't download vehicle {vehicle_name} certificates")


def get_trips(vehicle_name):
    print("get trips api")
    try:
        llm_table = dynamodb_client.Table(os.getenv("DDB_TABLE"))

        response = llm_table.query(
            KeyConditionExpression=boto3.dynamodb.conditions.Key('pk').eq("TRIP:"+vehicle_name))

        print("trips data -> ", response)

        trips = []
        for item in response["Items"]:
            trips.append(
                {
                    "date": item["date"],
                    "vehicle_name": item["vehicle_name"],
                    "start": item["start"],
                    "stop": item["stop"],
                    "duration": float(item["duration"]),
                    "distance": float(item["distance"])
                }

            )

        return trips
    except Exception as e:
        logging.error(e)
        return "error"


def linkvehicle(vehicle_name):
    VEHICLE_NAME = vehicle_name
    BUCKET_KEY = VEHICLE_NAME + '/' + VEHICLE_NAME + '.json'
    #raise Exception('Something went wrong')
    TOPIC_PREFIX = '$aws/iotfleetwise/'
    BUCKET_NAME = os.environ["CERTS_BUCKET"]
    PREFIX = VEHICLE_NAME + '/'
    content_object = s3_client.get_object(Bucket=BUCKET_NAME,Key=BUCKET_KEY)

    file_content = content_object["Body"].read().decode('utf-8')
    json_content = json.loads(file_content)
    CERTIFICATEPEM = json_content["certificatePem"]
    PRIVATE_KEY = json_content["privateKey"]
    return createQRCode(BUCKET_KEY, VEHICLE_NAME, CERTIFICATEPEM, PRIVATE_KEY, BUCKET_NAME)
    
def createQRCode(BUCKET_KEY, VEHICLE_NAME, CERTIFICATE_PEM, PRIVATE_KEY, BUCKET_NAME):

	url = s3_client.generate_presigned_url(
	    ClientMethod='get_object',
	    Params={
	        'Bucket': BUCKET_NAME,
	        'Key': BUCKET_KEY 
	    },
	    ExpiresIn=3600 # one hour in seconds, increase if needed
	)
	
	QR_CODE_FILENAME= VEHICLE_NAME + '.png'
	QR_CODE_FILENAME_LOCAL='/tmp/' + QR_CODE_FILENAME
	QR_CODE_FILENAME_CLOUD = VEHICLE_NAME + "/" + QR_CODE_FILENAME
	
	#out = io.BytesIO()
	qr = segno.make(url)
	qr.save(QR_CODE_FILENAME_LOCAL, kind='png', scale=5)

	s3r.Bucket(BUCKET_NAME).upload_file(QR_CODE_FILENAME_LOCAL, QR_CODE_FILENAME_CLOUD)

	qrUrl = s3_client.generate_presigned_url(
	    ClientMethod='get_object',
	    Params={
	        'Bucket': BUCKET_NAME,
	        'Key': QR_CODE_FILENAME_CLOUD
	    },
	    ExpiresIn=3600 # one hour in seconds, increase if needed
	)
	
	return {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        },
        'body': json.dumps(qrUrl)
    }
    