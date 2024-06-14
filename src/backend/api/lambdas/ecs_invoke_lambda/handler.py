"""lambda to start simulation for a vehicle created"""

import json
import boto3
import logging
import os
import helpers

logging.getLogger().setLevel(logging.INFO)
fleetwise_client = boto3.client('iotfleetwise')
ecs_client = boto3.client('ecs')
iot_client = boto3.client("iot")


# env variables
location_files_bucket = os.environ["LOCATIONS_BUCKET"]


def lambda_handler(event, context):
    try:
        logging.info(event)
        vehicle_id = event["vehicle_id"]
        location_s3_key = event.get("s3_key")
        if location_s3_key:
            location_type = "LOCATION_SERVICES"
        else:
            location_type = "STATIC"
        vcan_port = event["vcan_port"]
        
        response = iot_client.describe_endpoint(endpointType="iot:Data-ATS")
        vehicle_endpoint_url = response["endpointAddress"]
    

        #get vehicle certificate data
        vehicle_certificate, vehicle_private_key = helpers.get_vehicle_metadata(vehicle_id)
        
        # ecs task definition arguments
        fleetwise_edge_environment_args = [
                {"name": "CERTIFICATE", "value": vehicle_certificate},
                {"name": "PRIVATE_KEY", "value": vehicle_private_key},
                {"name": "VEHICLE_NAME", "value": vehicle_id},
                {"name": "ENDPOINT_URL", "value": vehicle_endpoint_url},
                {"name": "CAN_BUS0", "value": vcan_port}
            ]
        
        simulator_environment_args = [
                {"name": "CONFIG_BUCKET_NAME", "value": location_files_bucket},
                {"name": "COORDINATES_TYPE", "value": location_type},
                {"name": "VCAN_ADDRESS", "value": vcan_port}
            ]
        
        if location_s3_key:
            simulator_environment_args.append({"name": "COORDINATES_S3_KEY", "value": location_s3_key})
        
        run_task_response = helpers.run_ecs_task(fleetwise_edge_environment_args,simulator_environment_args)
        
        if run_task_response == "error":
            error_message = "Error while executing task. check logs"
            return {
                "statusCode": 500,
                "body": f"error: {error_message}"
            }
        
        logging.info(f"run_ecs_task executed. Printing response: {run_task_response}")
        
        task_arn = run_task_response["tasks"][0]["taskArn"]
        helpers.update_simulation_task(vehicle_id=vehicle_id,task_arn=task_arn,status="RUNNING")
        
        return {
                'statusCode': 200,
                'body': json.dumps(f"Vehicle ECS Simulation for {vehicle_id} started")
                }
    
    except Exception as e:
        logging.error(e)
        return {
                "statusCode": 500,
                "body": f"error: {e}"
                }
