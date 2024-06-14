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

const VehicleDetails = ({ vin, selectedVehicleData }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <div className={classes.label}>VIN</div>
        <div className={classes.info}>{vin}</div>
      </div>
      <div className={classes.row}>
        <div className={classes.label}>License Plate</div>
        <div className={classes.info}>{selectedVehicleData.device.license}</div>
      </div>
      <div className={classes.row}>
        <div className={classes.label}>Year</div>
        <div className={classes.info}>{selectedVehicleData.device.year}</div>
      </div>
      <div className={classes.row}>
        <div className={classes.label}>Make</div>
        <div className={classes.info}>{selectedVehicleData.device.make}</div>
      </div>
      <div className={classes.row}>
        <div className={classes.label}>Model</div>
        <div className={classes.info}>{selectedVehicleData.device.model}</div>
      </div>
      <div className={classes.row}>
        <div className={classes.label}>Mileage</div>
        <div className={classes.info}>{selectedVehicleData.device.mileage}</div>
      </div>
    </div>
  );
};


export default VehicleDetails;

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

