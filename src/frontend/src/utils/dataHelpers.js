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
import _get from "lodash.get";

export const reformatVehicle = (vehicle = {}) => {
  const { geoLocation,  ...otherProps } = vehicle;
  const coordinates = [geoLocation.Longitude,geoLocation.Latitude]
  const formattedVehicle = {
    coordinates,
    properties: Object.assign(
      {},
      otherProps,
      geoLocation
    )
  };
  return formattedVehicle;
};

export const reformatVehicles = (vehicles = []) =>
  vehicles.map(reformatVehicle);












