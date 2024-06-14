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
import vehicleTires from "assets/img/vehicle_tires.svg";

const NewTires = ({ telemetry }) => {
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
                        <div className={classes.info}>{telemetry.LeftFrontTireTemperature !== undefined ? telemetry.LeftFrontTireTemperature : "-"}</div>
                    </div>
                    <div className={classes.row}>
                        <div className={classes.label}>Pressure</div>
                        <div className={classes.info}>{telemetry.LeftFrontTirePressure !== undefined ? `${parseFloat(telemetry.LeftFrontTirePressure).toFixed(2)} PSI` : "-"}</div>
                    </div>
                    <div className={`${classes.row} ${classes.space}`}>
                        <div className={classes.label}>RL</div>
                    </div>
                    <div className={classes.row}>
                        <div className={classes.label}>Temp</div>
                        <div className={classes.info}>{telemetry.LeftRearTireTemperature !== undefined ? telemetry.LeftRearTireTemperature : "-"}</div>
                    </div>
                    <div className={classes.row}>
                        <div className={classes.label}>Pressure</div>
                        <div className={classes.info}>{telemetry.LeftRearTirePressure !== undefined ? `${parseFloat(telemetry.LeftRearTirePressure).toFixed(2)} PSI` : "-"}</div>
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
                        <div className={classes.info}>{telemetry.RightFrontTireTemperature !== undefined ? telemetry.RightFrontTireTemperature : "-"}</div>
                    </div>
                    <div className={classes.row}>
                        <div className={classes.label}>Pressure</div>
                        <div className={classes.info}>{telemetry.RightFrontTirePressure !== undefined ? `${parseFloat(telemetry.RightFrontTirePressure).toFixed(2)} PSI` : "-"}</div>
                    </div>
                    <div className={`${classes.row} ${classes.space}`}>
                        <div className={classes.label}>RR</div>
                    </div>
                    <div className={classes.row}>
                        <div className={classes.label}>Temp</div>
                        <div className={classes.info}>{telemetry.RightRearTireTemperature != undefined ? telemetry.RightRearTireTemperature : "-"}</div>
                    </div>
                    <div className={classes.row}>
                        <div className={classes.label}>Pressure</div>
                        <div className={classes.info}>{telemetry.RightRearTirePressure !== undefined ? `${parseFloat(telemetry.RightRearTirePressure).toFixed(2)} PSI` : "-"}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewTires;

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        justifyContent: "space-between", /* Adjust as needed */
        padding: "0 10.81rem",
        fontSize: "0.8rem",
        color: darkNavyText
    },
    row: {
        display: "flex",
        justifyContent: "space-between", /* Adjust as needed */
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
        marginLeft: "1rem",
        overflow: "hidden"
    },
}));
