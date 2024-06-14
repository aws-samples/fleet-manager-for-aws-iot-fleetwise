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
  VIEWS_SET_RIGHT_SIDEBAR_OPEN,
  VIEWS_SET_SINGLE_VEHICLE_VIEW,
  VIEWS_SET_SIMULATE_SINGLE_VEHICLE_VIEW,
  SHOW_TOAST_FLEETMANAGER
} from "./types";



export const setRightSideBarOpen = isOpen => ({
  type: VIEWS_SET_RIGHT_SIDEBAR_OPEN,
  payload: isOpen
});

export const setSingleVehicleView = isOpen => ({
  type: VIEWS_SET_SINGLE_VEHICLE_VIEW,
  payload: isOpen
});

export const setSingleSimulateVehicleView = isOpen => ({
  type: VIEWS_SET_SIMULATE_SINGLE_VEHICLE_VIEW,
  payload: isOpen
});

export const showToastPayload = (isSuccess, toastMessage) => ({
  type: SHOW_TOAST_FLEETMANAGER,
  payload: {isSuccess, toastMessage}
});

export const setSingleVehicleViewOpen = () => {
  return dispatch => {
    dispatch(setSingleVehicleView(true));
    dispatch(setRightSideBarOpen(true));
  };
};

export const setSingleSimulateVehicleViewOpen = (value) => {
  return dispatch => {
    dispatch(setSingleSimulateVehicleView(value));
  };
};

export const setShowToastPayload = (isSuccess, toastMessage) => {
  return dispatch => {
    dispatch(showToastPayload(isSuccess, toastMessage));
  };
};






