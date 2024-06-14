import os
import json
import boto3
import logging
import datetime
import time
import helpers

logging.getLogger().setLevel(logging.INFO)

def lambda_handler(event, context):
    print("EVENT-->", event)
    if event['body'] != None:
        data = json.loads(event['body'])
        print("DATA--> ", data)
    try:
        ############################### SIMULATOR APIS ###############################

        if event['resource'] == '/simulation':
            if event['httpMethod'] == 'POST' and data['command'] == "start":
                logging.info(f"Start simulation for {data['vehicle-name']}")
                response = helpers.start_simulator(data)
                logging.info(f"Start simulation response: {response}")
                if response == "error":
                    helpers.return_op(500, "Error while starting simulation")
            else:
                logging.info(f"Stop simulation for {data['vehicle-name']}")
                response = helpers.stop_simulator(data['vehicle-name'])
                logging.info(f"Stop simulation response: {response}")
                if response == "error":
                    helpers.return_op(500, "Error while stopping simulation")
                
    except Exception as e:
        return helpers.return_op(500, str(e))
    
    return helpers.return_op(200, response)