import os
import json
import boto3
import logging
import datetime
import time
import helpers

logging.getLogger().setLevel(logging.INFO)

def lambda_handler(event, context):
    print ("EVENT-->", event)
    if event['body'] != None:
        data = json.loads(event['body'])
        print ("DATA-->", data)

    try:
        ################## VEHICLE APIS ##################

        if event['resource'] == '/telemetry':
            try:
                if ('vehicle-name') in event['queryStringParameters']:
                    if event['httpMethod'] == 'GET' and event['queryStringParameters']['vehicle-name'] != "":
                        statuses = helpers.get_vehicles_simulation_status()
                        response = helpers.get_vehicle_data(vehicle_name=event['queryStringParameters']['vehicle-name'],statuses=statuses )
                    else:
                        return helpers.return_op(404, "vehicle-name not found")
                elif ('fleet-name') in event['queryStringParameters']:
                    if event['httpMethod'] == 'GET':
                        response = helpers.get_fleet_vehicle_data(event['queryStringParameters']['fleet-name'] )
            except Exception as e:
                print ("EXCEPTION---->" , e)
                if "ResourceNotFoundException" in str(e):
                    return helpers.return_op(404, "vehicle-name not found")
                else:
                    response = helpers.get_all_vehicles_data()                    
                
    except Exception as e:
        return helpers.return_op(500, str(e))
    try:
        del response['ResponseMetadata']
    except:
        pass    
        
    return helpers.return_op(200, response)