import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { grayVehicleBg, mediumBlue, darkNavyText, lightGrayishBlue, white, mistySteel, slateBlue } from "assets/colors";
import { startorStopSimulation } from "apis/simulation";
import Loading from "components/dashboard/tables/custom/Loader";
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, REGION, PLACE_INDEX_NAME, CALCULATOR_NAME } from 'assets/appConfig';
import Location from 'aws-sdk/clients/location';



const SingleVehicleSimulation = ({ handleClose, vehicleName, handleToast, simulationStarted }) => {
    const classes = useStyles();

    const [startLocation, setStartLocation] = useState("Los Angeles Airport Marriott, 5855 W Century Blvd, Los Angeles, CA 90045, United States");
    const [endLocation, setEndLocation] = useState("STILE Downtown Los Angeles by Kasa, 929 S Broadway, Los Angeles, CA 90015, United States");
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    let fromCoordinates = {}
    let toCoordinates = {}

    const handleGeocode = async (address, type) => {
        let errObj = {};
        const client = new Location({
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID,
                secretAccessKey: AWS_SECRET_ACCESS_KEY
            },
            region: REGION // Your AWS region
        });
        const params = {
            IndexName: PLACE_INDEX_NAME, // Replace with your Place Index name
            Text: address
        };

        try {
            const response = await client.searchPlaceIndexForText(params).promise();
            if (response.Results && response.Results.length > 0) {
                const [Longitude, Latitude] = response.Results[0].Place.Geometry.Point;
                
                if (type === 'startLocation') {
                    fromCoordinates = { Latitude, Longitude }
                } else {
                    toCoordinates = { Latitude, Longitude }
                }
                if (formErrors[type]) {
                    errObj = { ...formErrors };
                    delete errObj[type];
                }

            } else {
                errObj = { ...formErrors };
                errObj[type] = "No coordinates found for this address."
            }
        } catch (error) {
            errObj = { ...formErrors };
            errObj[type] = 'Failed to fetch coordinates'
        } finally {
            
            setFormErrors(errObj)
            if (Object.keys(errObj).length > 0) {
                setLoading(false)
                return false
            } else {
                return true
            }
        }
    };

    const validateFleetFormInputs = () => {
        const errObj = {};
        if (!startLocation || startLocation === "") {
            errObj["startLocation"] = "Start location field is required.";
        }
        if (!endLocation || endLocation === "") {
            errObj["endLocation"] = "End location field is required.";
        }

        setFormErrors(errObj);
        return errObj;
    };


    const getError = () => "Couldn't start simulation"


    const startSimulation = async () => {
        setFormErrors({})
        if (Object.keys(validateFleetFormInputs()).length > 0) {
            return;
        }

        setLoading(true);
        if (!(await handleGeocode(startLocation, "startLocation"))) {
            return
        }

        if (!(await handleGeocode(endLocation, "endLocation"))) {
            return
        }

        if (Object.keys(formErrors).length === 0) {
            try {
                const locationService = new Location({
                    credentials: {
                        accessKeyId: AWS_ACCESS_KEY_ID,
                        secretAccessKey: AWS_SECRET_ACCESS_KEY
                    },
                    region: REGION
                });

                const params = {
                    CalculatorName: CALCULATOR_NAME,
                    DeparturePosition: [fromCoordinates.Longitude, fromCoordinates.Latitude], // Longitude first, Latitude second
                    DestinationPosition: [toCoordinates.Longitude, toCoordinates.Latitude], // Longitude first, Latitude second
                    IncludeLegGeometry: true
                };

                const routeResponse = await locationService.calculateRoute(params).promise();
                let { Geometry } = routeResponse.Legs[0];

                const payload = {
                    "command": 'start',
                    "vehicle-name": vehicleName,
                    "startCoordinates": fromCoordinates,
                    "endCoordinates": toCoordinates,
                    "startAddress": startLocation,
                    "endAddress": endLocation,
                    "locationData": routeResponse
                }
                const response = await startorStopSimulation(payload)

                if(response.body) {
                    let error = response.body
                    error = error.toString()
                    error = error.replace(/["']/g, "");
                    handleToast(false,error)
                    setLoading(false)
                    return;
                   }
                const vehicleDetail = response[vehicleName]
                if (vehicleDetail !== undefined) {
                    if (vehicleDetail.vehicle_simulator_status !== undefined) {
                        if (vehicleDetail.vehicle_simulator_status === 'RUNNING' || vehicleDetail.vehicle_simulator_status === 'HEALTHY' || vehicleDetail.vehicle_simulator_status === 'STARTING') {
                            const updatedVehicleDetails = {
                                fromCoordinates,
                                toCoordinates,
                                "vehicleName": vehicleDetail.vehicle_name,
                                "simulationStatus": vehicleDetail.vehicle_simulator_status,
                                "routeData": Geometry.LineString
                            }
                            simulationStarted(updatedVehicleDetails)
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
                setLoading(false)
            }
        } else {
            setLoading(false)
        }

    };
    return (
        <div className={classes.mainContainer} style={modalStyle}>
            <p className={classes.formLabel}>SINGLE VEHICLE SIMULATION</p>
            <p className={classes.subLabel}>Simulate a vehicle’s operations and telemetry through a path.</p>
            <form className={classes.formContainer}>
                <label className={classes.textFieldLabel} for="startLocation">
                    Start Location
                </label>
                <input
                    id="startLocation"
                    placeholder="Enter start location (address, coordinates)"
                    className={classes.textField}
                    value={startLocation}
                    onChange={(e) => {
                        setStartLocation(e.target.value);
                        if (formErrors["startLocation"]) {
                            const errs = { ...formErrors };
                            delete errs["startLocation"];
                            setFormErrors(errs);
                        }
                    }}
                />
                <div className={classes.formFieldError}>{formErrors["startLocation"]}</div>
                <label className={classes.textFieldLabel} for="endLocation">
                    End Location
                </label>
                <input
                    id="endLocation"
                    placeholder="Enter end location (address, coordinates)"
                    className={classes.textField}
                    value={endLocation}
                    onChange={(e) => {
                        setEndLocation(e.target.value);
                        if (formErrors["endLocation"]) {
                            const errs = { ...formErrors };
                            delete errs["endLocation"];
                            setFormErrors(errs);
                        }
                    }}
                />
                <div className={classes.formFieldError}>{formErrors["endLocation"]}</div>
            </form>
            <div className={classes.startSimulationButton} onClick={startSimulation}>
                Start Simulation
            </div>
            <div className={classes.cancelButton} onClick={handleClose}>
                Cancel
            </div>
            {loading ?
                <Loading /> : null}
        </div>
    );
}

const Spacing = () => {
    const classes = useStyles();
    return <div className={classes.spacing} />;
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: "0px 2px 4px -1px rgba(0, 0, 0, 0.20), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)",
    p: 4,
};

const useStyles = makeStyles((theme) => ({
    formFieldError: {
        color: "red",
        fontSize: "12px"
    },
    startSimulationButton: {
        display: "inline-block",
        height: "2.72rem",
        lineHeight: "2.72rem",
        padding: "0 1.31rem",
        borderRadius: "0.33rem",
        fontSize: "0.80rem",
        fontWeight: 500,
        backgroundColor: mediumBlue,
        color: white,
        marginEnd: "8px",
        marginTop: "1rem",
        "&:hover": {
            cursor: "pointer",
        },
    },
    formLabel: {
        color: darkNavyText,
        fontSize: "20px",
        fontWeight: "700",
        margin: "0px"
    },
    subLabel: {
        color: slateBlue,
        fontSize: "14px",
        fontWeight: "400",
        margin: "0rem",
    },
    mainContainer: {
        padding: '1rem', // Top Right Bottom Left
        backgroundColor: grayVehicleBg,
        borderRadius: "4px",
        fontSize: "20px",
    },
    formContainer: {
        display: "flex",
        flexDirection: "column",
        width: "100%"
    },
    textFieldLabel: {
        color: darkNavyText,
        fontSize: "16px",
        fontWeight: "700",
        marginTop: "1rem"
    },
    textField: {
        padding: "10px",
        fontSize: "12px",
        backgroundColor: white,
        color: darkNavyText,
        fontWeight: "400",
        border: "none",
        marginTop: "0.5rem",
        '&::placeholder': { // Target the placeholder
            color: `${mistySteel} !important`, // Set the placeholder color
        },
    },
    spacing: {
        marginBottom: "1.5rem",
    },
    cancelButton: {
        display: "inline-block",
        height: "2.72rem",
        lineHeight: "2.72rem",
        padding: "0 1.31rem",
        borderRadius: "0.33rem",
        fontSize: "0.80rem",
        fontWeight: 500,
        backgroundColor: lightGrayishBlue,
        color: darkNavyText,
        marginStart: "8px",
        marginTop: "4px",
        "&:hover": {
            cursor: "pointer",
        },
    },
}));

export default SingleVehicleSimulation;