/*********************************************************************************************************************
 *  Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.                                           *
 *                                                                                                                    *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance    *
 *  with the License. A copy of the License is located at                                                             *
 *                                                                                                                    *
 *      http://www.apache.org/licenses/LICENSE-2.0                                                                    *
 *                                                                                                                    *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES *
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions    *
 *  and limitations under the License.                                                                                *
 *********************************************************************************************************************/
import { API } from "aws-amplify";
import { CDF_AUTO } from "apis/_NAMES";
import { VEHICLE_TRIPS_DATA } from "data/testData";


export const getVehicleTrips = (vehicleName) => {
  return API.get(CDF_AUTO, `/vehicle/trips`, {
    queryStringParameters: {
      "vehicle-name": vehicleName
    },
  });
  return VEHICLE_TRIPS_DATA
  // return API.get(CDF_AUTO, `/vehicles/${vin}/trips`, {
  //   queryStringParameters: {
  //     filters: JSON.stringify({
  //       filters: {
  //         dates: { start: "", end: "" },
  //       },
  //       pagination: { offset, maxResults: 40 },
  //     }),
  //   },
  // });
};


//Add new vehicle
export const addNewVehicle = async (data) => {
  return API.post(CDF_AUTO, `/vehicle`, {
    body: data,
  });
};


export const getVehiclesByFleetName = (fleet) =>
  API.get(CDF_AUTO, `/fleet/list-vehicles`, {
    queryStringParameters: {
      "fleet-name": fleet
    },
  });

export const getTelemetryDetailsByFleetName = (fleet) =>
  API.get(CDF_AUTO, `/telemetry`, {
    queryStringParameters: {
      "fleet-name": fleet
    },
  });

export const getVehiclesByCampaign = (campaignName) =>
  API.get(CDF_AUTO, `/fleet/campaign`, {
    queryStringParameters: {
      "name": campaignName
    },
  });

export const getTelemetryDetails = (vehicleName) =>
  API.get(CDF_AUTO, `/telemetry`, {
    queryStringParameters: {
      "vehicle-name": vehicleName
    },
  });

export const downloadVehicleCert = (vehicleName) =>
  API.get(CDF_AUTO, `/vehicle/download-cert`, {
    queryStringParameters: {
      "vehicle-name": vehicleName
    },
  });
