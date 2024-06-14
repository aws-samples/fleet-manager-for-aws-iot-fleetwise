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
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { darkNavyText } from "assets/colors";

const General = ({ details }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <div className={classes.label}>VIN</div>
        <div className={classes.info}>{details.vin}</div>
      </div>
      <div className={classes.row}>
        <div className={classes.label}>License Plate</div>
        <div className={classes.info}>{details.license}</div>
      </div>
      <div className={classes.row}>
        <div className={classes.label}>Year</div>
        <div className={classes.info}>{details.year}</div>
      </div>
      <div className={classes.row}>
        <div className={classes.label}>Make</div>
        <div className={classes.info}>{details.make}</div>
      </div>
      <div className={classes.row}>
        <div className={classes.label}>Model</div>
        <div className={classes.info}>{details.model}</div>
      </div>
      <div className={classes.row}>
        <div className={classes.label}>Mileage</div>
        <div className={classes.info}>{details.mileage}</div>
      </div>
    </div>
  );
};

General.propTypes = {
  selectedVin: PropTypes.object.isRequired,
};

export default General;

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
