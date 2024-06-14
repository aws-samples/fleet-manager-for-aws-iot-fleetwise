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
import _get from "lodash.get";
import { makeStyles } from "@material-ui/core/styles";
import { darkNavyText, mediumBlue } from "assets/colors";
import vehicleTires from "assets/img/vehicle_tires.svg";

const VehicleTires = ({  selectedVehicleData }) => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.container}>
        <div className={classes.leftPart}>
          <div className={classes.row}>
            <div className={classes.label}>FL</div>
          </div>
          <div className={classes.row}>
            <div className={classes.label}>Temp</div>
            <div className={classes.info}>{selectedVehicleData.telemetry.LeftFrontTireTemperature !== undefined ? selectedVehicleData.telemetry.LeftFrontTireTemperature : "-"}</div>
          </div>
          <div className={classes.row}>
            <div className={classes.label}>Pressure</div>
            <div className={classes.info}>{selectedVehicleData.telemetry.LeftFrontTirePressure !== undefined ? `${parseFloat(selectedVehicleData.telemetry.LeftFrontTirePressure).toFixed(2)} PSI` : "-"}</div>
          </div>
          <div className={`${classes.row} ${classes.space}`}>
            <div className={classes.label}>RL</div>
          </div>
          <div className={classes.row}>
            <div className={classes.label}>Temp</div>
            <div className={classes.info}>{selectedVehicleData.telemetry.LeftRearTireTemperature !== undefined ? selectedVehicleData.telemetry.LeftRearTireTemperature : "-"}</div>
          </div>
          <div className={classes.row}>
            <div className={classes.label}>Pressure</div>
            <div className={classes.info}>{selectedVehicleData.telemetry.LeftRearTirePressure !== undefined ? `${parseFloat(selectedVehicleData.telemetry.LeftRearTirePressure).toFixed(2)} PSI` : "-"}</div>
          </div>
        </div>
        <div className={classes.centerPart}>
          <img src={vehicleTires} alt="Tires" className="vehicleTires" />
        </div>
        <div className={classes.rightPart}>
          <div className={classes.row}>
            <div className={classes.label}>FR</div>
          </div>
          <div className={classes.row}>
            <div className={classes.label}>Temp</div>
            <div className={classes.info}>{selectedVehicleData.telemetry.RightFrontTireTemperature !== undefined ? selectedVehicleData.telemetry.RightFrontTireTemperature : "-"}</div>
          </div>
          <div className={classes.row}>
            <div className={classes.label}>Pressure</div>
            <div className={classes.info}>{selectedVehicleData.telemetry.RightFrontTirePressure !== undefined ? `${parseFloat(selectedVehicleData.telemetry.RightFrontTirePressure).toFixed(2)} PSI` : "-"}</div>
          </div>
          <div className={`${classes.row} ${classes.space}`}>
            <div className={classes.label}>RR</div>
          </div>
          <div className={classes.row}>
            <div className={classes.label}>Temp</div>
            <div className={classes.info}>{selectedVehicleData.telemetry.RightRearTireTemperature !== undefined ? selectedVehicleData.telemetry.RightRearTireTemperature : "-"}</div>
          </div>
          <div className={classes.row}>
            <div className={classes.label}>Pressure</div>
            <div className={classes.info}>{selectedVehicleData.telemetry.RightRearTirePressure !== undefined ? `${parseFloat(selectedVehicleData.telemetry.RightRearTirePressure).toFixed(2)} PSI` : "-"}</div>
          </div>
        </div>
      </div>
      <div className={classes.lastUpdated}>
        Last updated: 10 seconds ago
      </div>
    </div>
  );
};

export default VehicleTires;

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    justifyContent: "space-between", /* Adjust as needed */
    padding: "0 2.81rem",
    fontSize: "0.8rem",
    color: darkNavyText
  },
  row: {
    display: "flex",
    justifyContent: "space-between", /* Adjust as needed */
    // paddingBottom: "1rem"
  },
  space: {
    marginTop: "1rem"
  },
  label: {
    flex: 1,
    fontWeight: "bold"
  },
  lastUpdated: {
    textAlign: "center",
    marginTop: "2rem",
    color: darkNavyText,
    opacity: 0.3
  },
  info: {
    // flex: 1,
    marginLeft: "1rem",
    overflow: "hidden"
  },
  tabLink: {
    display: "flex",
    alignItems: "flex-start",
    color: mediumBlue,
    "&:hover": {
      cursor: "pointer"
    }
  },
  singleDtc: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    "&:hover": {
      cursor: "pointer"
    },
    marginBottom: "0.2rem",
    "&:last-of-type": {
      marginBottom: 0
    }
  },
  centerPart: {
  }
}));

