import os
import json
import boto3
import logging
import datetime
import time
from inspect import signature
from typing import Callable, Dict, Any
from boto3.dynamodb.conditions import Key
from collections import defaultdict

logging.getLogger().setLevel(logging.INFO)

# define boto3 credentials
ts_client = boto3.client('timestream-query')
iot_client = boto3.client('iot')
fleetwise_client = boto3.client('iotfleetwise')

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
    
def get_vehicles_simulation_status():
    print("load vehicle simulation status from dynamodb")
    try:
        dynamodb_client = boto3.resource('dynamodb')
        llm_table = dynamodb_client.Table(os.getenv("DDB_TABLE"))
        
        response = llm_table.query(
            KeyConditionExpression=Key('pk').eq("SIMULATIONS"))
            
            
        print("simulation status response - >", response)
        
        status_dict = {}
        if response["Count"]> 0:
            status_dict = {item['sk']: item['status'] for item in response["Items"]}

        return status_dict
    except Exception as e:
        logging.error(e)
        return "error"
            
            
# get telemetry data for all vehicles
def get_all_vehicles_data():
    try:
        response = fleetwise_client.list_vehicles()
        results = []
        
        statuses = get_vehicles_simulation_status()
        for item in response['vehicleSummaries']:
            results.append(get_vehicle_data(vehicle_name=item['vehicleName'],statuses=statuses))
        return 
    except Exception as e:
        logging.error(e)
        return return_op(500, "Error while fetching data for all vehicles")

def get_vehicle_data( vehicle_name : str,statuses):
    query_string =  """
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
        results['vehicle_name'] = vehicle_name
        results['telemetry'] = {}
        results['device'] = {}
        
        
        results['telemetry'] = {}
        results['geoLocation'] ={}
            
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
                            if ('Longitude' in measure_name) or ('Latitude' in measure_name):
                                results['geoLocation'][measure_name.split('.')[-1]] = item['Data'][2]['ScalarValue']
                            else:
                                results['telemetry'][measure_name.split('.')[-1]] = item['Data'][2]['ScalarValue']
                        except:
                            results['telemetry'][measure_name.split('.')[-1]] = item['Data'][2]['NullValue']
                            
        # Get IoT Data
        iot_response = iot_client.describe_thing(thingName=vehicle_name)
        results["device"] = iot_response["attributes"]
        results["vehicle_simulator_status"] = statuses.get(vehicle_name,"STOPPED")
        return results
    except Exception as err:
        logging.error(f"Exception while running query: {err}")
        return return_op(404, str(err))
    
def get_fleet_vehicle_data(fleet_name : str):        
    logging.info ("list vehicles in fleet")
    try:
        response = fleetwise_client.list_vehicles_in_fleet(
            fleetId=fleet_name
        )
    except Exception as e:
        return return_op(404,str(e))
        
    results = []
    statuses = get_vehicles_simulation_status()
    for item in response['vehicles']:
        results.append(get_vehicle_data(vehicle_name=item,statuses=statuses))
    return results