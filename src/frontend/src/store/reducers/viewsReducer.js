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
} from "actions/types";

const defaultState = {
  otaSidebarOpen: false,
  rightSidebarOpen: true,
  singleVehicleView: false,
  tripHistoryView: false,
  filterIdOpen: null,
  jobIdOpen: null
};

const viewsReducer = (state = defaultState, action) => {
  switch (action.type) {
    
    case VIEWS_SET_RIGHT_SIDEBAR_OPEN:
      return {
        ...state,
        rightSidebarOpen: action.payload
      };
    case VIEWS_SET_SINGLE_VEHICLE_VIEW:
      return {
        ...state,
        singleVehicleView: action.payload
      };
    
    case VIEWS_SET_SIMULATE_SINGLE_VEHICLE_VIEW:
      return {
        ...state,
        singleSimulateVehicleView: action.payload
      };
    case SHOW_TOAST_FLEETMANAGER:
      return {
        ...state,
        showToastPayload: action.payload
      };
    default:
      return state;
  }
};

export default viewsReducer;
