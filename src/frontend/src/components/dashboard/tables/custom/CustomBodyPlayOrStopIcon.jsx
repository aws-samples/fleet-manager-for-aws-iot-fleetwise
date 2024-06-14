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
import React from "react";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import { startorStopSimulation } from "apis/simulation";

const CustomBodyPlayorStopIcon = ({
  simulationStatus,
  vehicleName,
  handleLoading,
  handleToast,
  startPollingForVehicleSimulation
}) => {
  
  const getError = () => {
    let msg = ""
    if (simulationStatus === 'RUNNING' || simulationStatus === 'HEALTHY') {
      msg = "Couldn't stop simulation"
    } else {
      msg = "Couldn't start simulation"
    }
    return msg
  }
  const handlePlayOrStopSimulation = async () => {
    if (simulationStatus === 'STARTING') {
      return;
    }
    try {
      const payload = {
        "command": simulationStatus === 'RUNNING' || simulationStatus === 'HEALTHY' ? 'stop' : 'start',
        "vehicle-name": vehicleName
      }
      handleLoading(true)
      const response = await startorStopSimulation(payload)
      if(response.body) {
        let error = response.body
        error = error.toString()
        error = error.replace(/["']/g, "");
        handleToast(false,error)
        handleLoading(false)
        return;
       }
      if (response.message !== undefined) {
        if (response.message === 'simulation has stopped') {
          startPollingForVehicleSimulation(false, "STOPPED", vehicleName)
        } else {
          handleToast(false, getError)
        }
      } else if (response[vehicleName] !== undefined) {
        const status = response[vehicleName].vehicle_simulator_status
        if (status !== undefined) {
          if (status === 'RUNNING' || status === 'HEALTHY' || status === 'STARTING') {
            startPollingForVehicleSimulation(status === 'STARTING' ? true : false, status, vehicleName)
          } else {
            handleToast(false, getError)
          }
        } else {
          handleToast(false, getError)
        }
      } else {
        handleToast(false, response)
      }
    } catch (err) {
      if(err.toString().includes('status code 500')) {
        handleToast(false,err.toString())
    } else {
        handleToast(false, getError)
    }   
   } finally {
      handleLoading(false)
    }


  }
  return (

    <th
      onClick={handlePlayOrStopSimulation}
      style={{
        top: 0,
        zIndex: 13,
        position: "sticky",
        textAlign: "left",
        backgroundColor: "white",
      }}
    >
      {
        simulationStatus === 'RUNNING' || simulationStatus === 'HEALTHY' ? (
          <StopIcon
            style={{
              cursor: "pointer",
              color: "red",
            }} />
        ) : simulationStatus === 'STARTING' ? <PlayArrowIcon
          style={{
            cursor: "pointer",
            color: "black",
            fill: 'grey', cursor: 'not-allowed', opacity: 0.5
          }}
        /> : <PlayArrowIcon
          style={{
            cursor: "pointer",
            color: "black",
          }}
        />
      }

    </th>
  );
};

export default CustomBodyPlayorStopIcon;
