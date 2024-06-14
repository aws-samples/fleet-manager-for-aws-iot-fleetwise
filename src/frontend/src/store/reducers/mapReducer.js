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
} from "actions/types";

const defaultState = {
  viewport: {
    latitude: 34,
    longitude: -118,
    zoom: 0
  },
};

const mapReducer = (state = defaultState, action) => {
  switch (action.type) {
    case MAP_SET_VIEWPORT:
      return {
        ...state,
        viewport: action.payload
      };
    default:
      return state;
  }
};

export default mapReducer;
