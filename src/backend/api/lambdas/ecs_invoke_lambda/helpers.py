import json
import boto3
import logging
import os
import time

logging.getLogger().setLevel(logging.INFO)

s3_client = boto3.client('s3')
fleetwise_client = boto3.client('iotfleetwise')
ecs_client = boto3.client('ecs')
ec2_client = boto3.client("ec2")
dynamodb_client = boto3.resource('dynamodb')

# env variables
s3_cert_bucket = os.environ["CERTS_BUCKET"]
ecs_cluster_name = os.environ["ECS_CLUSTER_NAME"]


def get_vehicle_metadata(vehicle_id):
    try:
        exec_path = "/var/task"
        storage_file_path = "/tmp"

        logging.info(f"Bucket name: {s3_cert_bucket}")
        response = s3_client.download_file(
            s3_cert_bucket, f"{vehicle_id}/{vehicle_id}.json", f"/tmp/{vehicle_id}.json")
        # logging.info(response)

        logging.info(f"CWD: {os.getcwd()}")
        logging.info(f"cwd files: {os.listdir()}")
        os.chdir(storage_file_path)
        logging.info(f"{os.getcwd()}")
        logging.info(f"cwd files in /tmp: {os.listdir()}")

        # extract data from config file
        config_file_path = f"{storage_file_path}/{vehicle_id}.json"
        config_content = open(config_file_path).read()
        vehicle_config_content = json.loads(config_content)
        logging.info(f"vehicle_config_content: {vehicle_config_content}")

        vehicle_certificate = vehicle_config_content["certificatePem"]
        vehicle_private_key = vehicle_config_content["privateKey"]

        # delete config file
        os.remove(config_file_path)
        logging.info(f"cwd files in /tmp after deletion: {os.listdir()}")
        os.chdir(exec_path)
        logging.info(f"{os.getcwd()}")

        return vehicle_certificate, vehicle_private_key

    except Exception as e:
        logging.error(e)
        return "error"


def run_ecs_task(fleetwise_edge_environment_args, simulator_environment_args):
    try:
        # Run ECS task on existing instance
        response = ecs_client.run_task(
            cluster=os.environ["ECS_CLUSTER_NAME"],
            taskDefinition=os.environ["TASK_DEFINITION_ARN"],
            overrides={
                'containerOverrides': [
                    {
                        'name': os.environ["FLEETWISE_EDGE_CONTAINER_NAME"],
                        'environment': fleetwise_edge_environment_args
                    },
                    {
                        'name': os.environ["SIMULATOR_CONTAINER_NAME"],
                        'environment': simulator_environment_args
                    }
                ]
            },
            count=1,
            launchType="EC2"
        )
        return response

    except Exception as e:
        logging.error(e)
        return "error"


def update_simulation_task(vehicle_id, task_arn, status):
    try:
        llm_table = dynamodb_client.Table(os.getenv("DDB_TABLE"))

        # Define the key and the updated attributes
        key = {
            "pk": "SIMULATIONS",
            "sk": vehicle_id
        }

        # Define the update expression and attribute values
        update_expression = "SET task_arn = :task_arn, #s = :status"
        expression_attribute_values = {
            ":task_arn": task_arn,
            ":status": status
        }

        # Define attribute name substitution to avoid conflicts with reserved words
        expression_attribute_names = {
            "#s": "status"
        }

        # Update the item in the table
        llm_table.update_item(
            Key=key,
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values,
            ExpressionAttributeNames=expression_attribute_names
        )

    except Exception as e:
        logging.error(e)
        return "error"