import os
import json
import boto3
import logging
import helpers
from boto3.dynamodb.conditions import Key
from aws_lambda_powertools.utilities.data_classes import APIGatewayProxyEvent

logging.getLogger().setLevel(logging.INFO)

def lambda_handler(event: APIGatewayProxyEvent, context):
    logging.info("EVENT-->", event)
    if event['body'] != None:
        data = json.loads(event['body'])
        logging.info("DATA-->", data)    
    logging.info(f"Resource invoked: {event["resource"]}")

    try:
        ##################### VEHICLE APIS #####################

        if event['resource'] == '/vehicle':
            if event['queryStringParameters'] == None:
                if event['httpMethod'] == 'POST':
                    response = helpers.create_vehicle(data)
                if event['httpMethod'] == 'GET':
                    response = helpers.list_vehicles()
                if event['httpMethod'] == 'UPDATE':
                    response = helpers.update_vehicle(data)

            elif ('vehicle-name') in event['queryStringParameters']:
                if event['httpMethod'] == 'GET':
                    response = helpers.get_vehicle(event['queryStringParameters']['vehicle-name'] )
                if event['httpMethod'] == 'DELETE':
                    response = helpers.delete_vehicle(event['queryStringParameters']['vehicle-name']) 
                    
        ##################### FLEET APIS #####################
                    
        elif event['resource'] == '/fleet':
            if event['queryStringParameters'] == None:
                if event['httpMethod'] == 'POST':
                    response = helpers.create_fleet(data)
                if event['httpMethod'] == 'GET':
                    response = helpers.list_fleets()
                if event['httpMethod'] == 'PUT':
                    response = helpers.update_fleet(data)

            elif ('fleet-name') in event['queryStringParameters']:
                if event['httpMethod'] == 'GET':
                    response = helpers.get_fleet(event['queryStringParameters']['fleet-name'] )
                if event['httpMethod'] == 'DELETE':
                    response = helpers.delete_fleet(event['queryStringParameters']['fleet-name'])

        ##################### ASSOCIATE/DISASSOCIATE APIS #####################
                    
        elif event['resource'] == '/fleet/associate-vehicle' and event['httpMethod'] == 'POST':
                response = helpers.associate_vehicle( event['queryStringParameters']['fleet-name'], event['queryStringParameters']['vehicle-name'] )          
        elif event['resource'] == '/fleet/disassociate-vehicle' and event['httpMethod'] == 'DELETE':
                response = helpers.disassociate_vehicle( event['queryStringParameters']['fleet-name'], event['queryStringParameters']['vehicle-name'] )            

        ##################### LIST VEHICLES/FLEETS APIS #####################
                    
        elif event['resource'] == '/fleet/list-vehicles' and event['httpMethod'] == 'GET':
            response = helpers.list_vehicles_in_fleet(event['queryStringParameters']['fleet-name'])
        elif event['resource'] == '/vehicle/list-fleets' and event['httpMethod'] == 'GET':
            response = helpers.list_fleets_for_vehicle( event['queryStringParameters']['vehicle-name'])
            
        
        ##################### VEHICLE TRIPS APIS #####################        
        elif event['resource'] == '/vehicle/trips' and event['httpMethod'] == 'GET':
            response = helpers.get_trips( event['queryStringParameters']['vehicle-name'])
        
        ##################### CAMPAIGN APIS #####################
        
        elif event['resource'] == '/fleet/campaign' and event['httpMethod'] == 'GET':
            if event['queryStringParameters'] == None:
                response = helpers.list_campaigns()
            elif ('name') in event['queryStringParameters']:
                response = helpers.list_vehicles_for_campaign(event['queryStringParameters']['name'])
            else:
                logging.info("ERROR --> Unsupported endpoint")
                return helpers.return_op(400, {"error": "Unsupported endpoint"})
                
        ##################### DOWNLOAD APIS #####################
        
        elif event['resource'] == '/vehicle/download-cert' and event['httpMethod'] == 'GET':
            vehicle_name = event['queryStringParameters']['vehicle-name']
            response = helpers.download_vehicle_cert(vehicle_name)
        else:
            print ("ERROR --> Unsupported endpoint")
            return helpers.return_op(400, {"error": "Unsupported endpoint"})
        
        return helpers.return_op(200, response)
    
    except Exception as e:
        return helpers.return_op(500, str(e))
        