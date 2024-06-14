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
import {
  DATA_SET_SELECTED_VEHICLE,
  DATA_SET_VEHICLE_LIST,
} from "./types";
import {
  reformatVehicles,
} from "utils/dataHelpers";
import { zoomToCustomViewport } from "actions/mapActions";
import { SINGLE_FEATURE_ZOOM_LEVEL } from "assets/appConfig";


export const setSelectedVehicleData = (vehicle) => {
  return (dispatch, getState) => {
    if (!vehicle) {
      dispatch({ type: DATA_SET_SELECTED_VEHICLE, payload: null });
    } else {
      const vehicleData = { ...vehicle };
      const {
        map: {
          viewport: { zoom, longitude: vpLng, latitude: vpLat },
        },
      } = getState();
      vehicleData.coordinates = [vehicleData.geoLocation.Longitude, vehicleData.geoLocation.Latitude]
      if (zoom < 14.5) {
        vehicleData.previousViewport = {
          zoom,
          longitude: vpLng,
          latitude: vpLat,
        };
        const Longitude = vehicleData.geoLocation.Longitude;
        const Latitude = vehicleData.geoLocation.Latitude;
        dispatch(
          zoomToCustomViewport({
            Longitude,
            Latitude,
            zoom: SINGLE_FEATURE_ZOOM_LEVEL,
          })
        );
      }

      dispatch({ type: DATA_SET_SELECTED_VEHICLE, payload: vehicleData });
    }
  };
};



export const setVehicleList = (vehicleListObj = {}) => ({
  type: DATA_SET_VEHICLE_LIST,
  payload: vehicleListObj,
});

export const initializeVehicleList = ({ vehicles = [], vehicleCount = 0} = {}) => {
  const vehicleList = {
    vehicles: reformatVehicles(vehicles),
    vehicleCount,
  };
  return setVehicleList(vehicleList);
};





