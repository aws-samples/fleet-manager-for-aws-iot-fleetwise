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
import { ApiError, get, post } from "aws-amplify/api";
import { CDF_AUTO } from "apis/_NAMES";
import { CDF_AUTO_ENDPOINT } from "assets/appConfig";

export const getVehicleTrips = (vehicleName) => {
  return get({
    apiName: CDF_AUTO, 
    endpoint: CDF_AUTO_ENDPOINT, 
    path: `/vehicle/trips`,
    options: {
      queryParams: {
      "vehicle-name": vehicleName
    }}
  });
};

//Add new vehicle
export const addNewVehicle = async (data) => {
  return post({
    apiName: CDF_AUTO, 
    endpoint: CDF_AUTO_ENDPOINT, 
    path: `/vehicle`,
    options: {
      body: data
    }
  });
};

export async function getVehiclesByFleetName(fleet) {
  try {
    const restOperation = get(
      {
          apiName: CDF_AUTO, 
          endpoint: CDF_AUTO_ENDPOINT, 
      path: `/fleet/list-vehicles`,
      options: {
        queryParams: {
        "fleet-name": fleet
        }}
  });
  return (await restOperation.response).body.json();
} catch (error) {
    if (error instanceof ApiError) {
      if (error.response) {
        const { 
          statusCode, 
          headers, 
          body 
        } = error.response;
        console.error(`Received ${statusCode} error response with payload: ${body}`);
      }
  }
}
}

export async function getTelemetryDetailsByFleetName (fleet) {
  const restOperation = get({
    apiName: CDF_AUTO, 
    endpoint: CDF_AUTO_ENDPOINT, 
    path: `/telemetry`, 
    options: {
        queryParams: {
        "fleet-name": fleet
    }}
  })
  return (await restOperation.response).body.json();
};

export async function getVehiclesByCampaign (campaignName) {
  const restOperation = get({
    apiName: CDF_AUTO, 
    endpoint: CDF_AUTO_ENDPOINT, 
    path: `/fleet/campaign`, 
    options: {
      queryParams: {
      "name": campaignName
      }
    },
  })
  return (await restOperation.response).body.json();
};

export async function getTelemetryDetails (vehicleName) {
  const restOperation = get({
    apiName: CDF_AUTO, 
    endpoint: CDF_AUTO_ENDPOINT, 
    path:`/telemetry`, 
    options: {
      queryParams: {
      "vehicle-name": vehicleName
    }}
  })
  return (await restOperation.response).body.json();
};

  export async function  downloadVehicleCert (vehicleName) {
    const restOperation = get({
      apiName: CDF_AUTO, 
      endpoint: CDF_AUTO_ENDPOINT, 
      path: `/vehicle/download-cert`, 
      options: {
        queryParams: {
        "vehicle-name": vehicleName
      }}
    })
    return (await restOperation.response).body.json();
  };

  export async function  linkDevice (vehicleName) {
    const restOperation = get({
      apiName: CDF_AUTO, 
      endpoint: CDF_AUTO_ENDPOINT, 
      path: `/vehicle/link-device`, 
      options: {
        queryParams: {
        "vehicle-name": vehicleName
      }}
    })
    return (await restOperation.response).body.json();
  };