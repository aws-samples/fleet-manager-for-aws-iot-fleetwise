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

const VehicleStatus = ({  selectedVehicleData }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <div className={classes.label}>Speed</div>
        <div className={classes.info}>{selectedVehicleData.telemetry.Speed !== undefined ? selectedVehicleData.telemetry.Speed : "-"}</div>
      </div>
      <div className={classes.row}>
        <div className={classes.label}>Total Operating Time</div>
        <div className={classes.info}>{selectedVehicleData.telemetry.TotalOperatingTime !== undefined ? parseFloat(selectedVehicleData.telemetry.TotalOperatingTime).toFixed(4) : "-"}</div>
      </div>
      <div className={classes.row}>
        <div className={classes.label}>Cabin Air Temperature</div>
        <div className={classes.info}>{selectedVehicleData.telemetry.InCabinTemperature !== undefined ? selectedVehicleData.telemetry.InCabinTemperature : "-"}</div>
      </div>
      <div className={classes.row}>
        <div className={classes.label}>Outside Air Temperature</div>
        <div className={classes.info}>{selectedVehicleData.telemetry.OutsideAirTemperature !== undefined ? selectedVehicleData.telemetry.OutsideAirTemperature : "-"}</div>
      </div>
      <div className={classes.row}>
        <div className={classes.label}>Latitude/Longitude</div>
        <div className={classes.info}>{selectedVehicleData.geoLocation.Latitude !== undefined ? parseFloat(selectedVehicleData.geoLocation.Latitude).toFixed(4) + ", " + parseFloat(selectedVehicleData.geoLocation.Longitude).toFixed(4) : "-"}</div>
      </div>
      <div className={classes.lastUpdated}>
        Last updated: 10 seconds ago
      </div>
    </div>
  );
};

export default VehicleStatus;

const useStyles = makeStyles(() => ({
  container: {
    padding: "0 2.81rem",
    fontSize: "0.9375rem",
    color: darkNavyText
  },
  row: {
    display: "flex",
    paddingBottom: "1rem"
  },
  label: {
    flex: 1,
    fontWeight: "bold"
  },
  lastUpdated: {
    textAlign: "center",
    marginTop: "1rem",
    color: darkNavyText,
    opacity: 0.3
  },
  info: {
    // flex: 1,
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
  }
}));

