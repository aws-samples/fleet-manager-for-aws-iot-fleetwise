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
import { makeStyles } from "@material-ui/core/styles";
import { darkNavyText } from "assets/colors";

const Status = ({ telemetry, geoLocation }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <div className={classes.label}>Speed</div>
        <div className={classes.info}>{telemetry.Speed !== undefined ? telemetry.Speed : "-"}</div>
      </div>
      <div className={classes.row}>
        <div className={classes.label}>Total Operating Time</div>
        <div className={classes.info}>{telemetry.TotalOperatingTime !== undefined ? parseFloat(telemetry.TotalOperatingTime).toFixed(4) : "-"}</div>
      </div>
      <div className={classes.row}>
        <div className={classes.label}>Cabin Air Temperature</div>
        <div className={classes.info}>{telemetry.InCabinTemperature != undefined ? telemetry.InCabinTemperature : "-"}</div>
      </div>
      <div className={classes.row}>
        <div className={classes.label}>Outside Air Temperature</div>
        <div className={classes.info}>{telemetry.OutsideAirTemperature !== undefined ? telemetry.OutsideAirTemperature : "-"}</div>
      </div>
      <div className={classes.row}>
        <div className={classes.label}>Latitude/Longitude</div>
        <div className={classes.info}>{geoLocation.Latitude != undefined ? parseFloat(geoLocation.Latitude).toFixed(4) + ", " + parseFloat(geoLocation.Longitude).toFixed(4) : "-"}</div>
      </div>
    </div>
  );
};

export default Status;

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0 10.81rem",
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
  info: {
    // flex: 1,
    overflow: "hidden"
  },
}));
