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
import BatteryChart from "components/vehicles/BatteryChart";
import { darkNavyText } from "assets/colors";

const Battery = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
        <BatteryChart />
    </div>
  );
};

Battery.propTypes = {
  selectedVin: PropTypes.object.isRequired,
  batteryData: PropTypes.array.isRequired,
};

export default Battery;

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0 5.81rem",
    fontSize: "0.8rem",
    color: darkNavyText
  },
}));
