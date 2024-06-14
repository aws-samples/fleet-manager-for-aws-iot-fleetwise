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
import BatteryChart from "./BatteryChart";

const VehicleBattery = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
        <BatteryChart />
        <div className={classes.lastUpdated}>
            Last updated: 10 seconds ago
        </div>
    </div>
  );
};


export default VehicleBattery;

const useStyles = makeStyles(() => ({
  container: {
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

