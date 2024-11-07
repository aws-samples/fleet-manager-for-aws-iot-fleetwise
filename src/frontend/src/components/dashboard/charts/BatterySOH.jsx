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
import BatterySOHChart from "components/vehicles/BatterySOHChart";

const BatterySOH = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
        <BatterySOHChart />
    </div>
  );
};

export default BatterySOH;

const useStyles = makeStyles((theme) => ({
  container: {
    fontSize: "0.8rem",
    width: "45vw"
  }
}));
