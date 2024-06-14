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
  MAP_SET_VIEWPORT,
} from "./types";
import { validCoord } from "utils/geojsonHelpers";

export const setMapViewport = (viewport) => ({
  type: MAP_SET_VIEWPORT,
  payload: viewport,
});



export const zoomToCustomViewport = ({ longitude, latitude, zoom } = {}) => {
  return (dispatch, getState) => {
    if (!validCoord([longitude, latitude])) return;

    const {
      map: { viewport },
    } = getState();

    const newViewport = {
      ...viewport,
      longitude,
      latitude,
      zoom,
      transitionDuration: "auto",
    };

    dispatch(setMapViewport(newViewport));
  };
};






