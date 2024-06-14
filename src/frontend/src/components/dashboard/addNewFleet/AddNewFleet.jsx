import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import {  grayVehicleBg, mediumBlue, darkNavyText, lightGrayishBlue, white } from "assets/colors";


const AddNewFleet = ({ setIsCreateFleet }) => {
    const classes = useStyles();

    const [fleetName, setFleetName] = useState("");
    const [demoVehicles, setDemoVehicles] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateFleetFormInputs = () => {
        const errObj = {};
        if (!fleetName || fleetName === "") {
            errObj["fleetName"] = "Fleet name field is required.";
        }
        setFormErrors(errObj);
        return errObj;
    };

    const validateDemoVehiclesFormInputs = () => {
        const errObj = {};
        if (!demoVehicles || demoVehicles === "") {
            errObj["demoVehicles"] = "Demo vehicles field is required.";
        }
        setFormErrors(errObj);
        return errObj;
    };

    const addFleet = async () => {
        if (Object.keys(validateFleetFormInputs()).length > 0) return;
        setLoading(true);

        const payload = {

        };

        try {
            const res = "await addNewVehicle(payload)";
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    const runFleetDemo = async () => {
        if (Object.keys(validateDemoVehiclesFormInputs()).length > 0) return;
        setLoading(true);

        const payload = {

        };

        try {
            const res = "await addNewVehicle(payload)";
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={classes.mainContainer}>
            <div className={classes.backLink} onClick={() => setIsCreateFleet(false)}>
                <ArrowBackIcon />
                Back to Fleet Dashboard
            </div>
            <p className={classes.formLabel}>ADD NEW FLEET</p>
            <div className={classes.subContainer}>
                <form className={classes.formContainer}>
                    <label className={classes.textFieldLabel} for="fleetName">
                        Fleet Name
                    </label>
                    <input
                        id="fleetName"
                        placeholder="Enter Fleet Name"
                        className={classes.textField}
                        value={fleetName}
                        onChange={(e) => {
                            setFleetName(e.target.value);
                            if (formErrors["fleetName"]) {
                                const errs = { ...formErrors };
                                delete errs["fleetName"];
                                setFormErrors(errs);
                            }
                        }}
                    />
                    <div className={classes.formFieldError}>{formErrors["fleetName"]}</div>
                    <Spacing />
                </form>
                <div className={classes.addNewFleetButton} onClick={addFleet}>
                    Add new fleet
                </div>
                <div className={classes.oR}>
                    OR
                </div>
                <form className={classes.formContainer}>
                    <label className={classes.textFieldLabel} for="demoVehicles">
                        Select number of demo vehicles
                    </label>
                    <input
                        id="demoVehicles"
                        placeholder="Enter number of demo vehicles"
                        className={classes.textField}
                        value={demoVehicles}
                        onChange={(e) => {
                            setDemoVehicles(e.target.value);
                            if (formErrors["demoVehicles"]) {
                                const errs = { ...formErrors };
                                delete errs["demoVehicles"];
                                setFormErrors(errs);
                            }
                        }}
                    />
                    <div className={classes.formFieldError}>{formErrors["demoVehicles"]}</div>
                    <Spacing />
                </form>
                <div className={classes.addNewFleetButton} onClick={runFleetDemo}>
                    Run transient fleet demo
                </div>
            </div>
        </div>
    );
}

const Spacing = () => {
    const classes = useStyles();
    return <div className={classes.spacing} />;
};

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        padding: '1rem 1rem 2rem 2rem', // Top Right Bottom Left
        backgroundColor: white,
        height: "100%",
        display: "flex", /* Use flexbox */
        flexDirection: "column", /* Stack child components vertically */
    },
    formFieldError: {
        color: darkNavyText,
        fontSize: "12px"
    },
    addNewFleetButton: {
        display: "inline-block",
        height: "2.72rem",
        lineHeight: "2.72rem",
        padding: "0 1.31rem",
        borderRadius: "0.33rem",
        fontSize: "0.80rem",
        fontWeight: 500,
        backgroundColor: mediumBlue,
        color: white,
        "&:hover": {
            cursor: "pointer",
        },
    },
    backLink: {
        width: "fit-content",
        color: mediumBlue,
        fontSize: 24,
        display: "flex",
        alignItems: "center",
        margin: "10px 0 20px 0",
        cursor: "pointer",
        "& > svg": {
            marginRight: 12,
        },
    },
    formLabel: {
        color: darkNavyText,
        fontSize: "20px",
        fontWeight: "700",
    },
    subContainer: {
        borderRadius: "4px",
        backgroundColor: grayVehicleBg,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '3rem 1rem 3rem 1rem', // Top Right Bottom Left
        // border: '1px solid #000',
        maxWidth: "462px",
        fontSize: "20px",
        flex: 1, /* Make the child div grow to fill available space */
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
    },
    textField: {
        padding: "13px",
        fontSize: "12px",
        backgroundColor: lightGrayishBlue,
        border: "none",
        marginTop: "0.5rem",
    },
    spacing: {
        marginBottom: "1.5rem",
    },
    addNewFleet: {
        marginBottom: "1rem",
        display: "inline-block",
        height: "1.78rem",
        lineHeight: "1.78rem",
        borderRadius: "0.33rem",
        padding: "0 0.75rem",
        fontSize: "0.75rem",
        fontWeight: 500,
        backgroundColor: mediumBlue,
        color: white,
        "&:hover": {
            cursor: "pointer",
        },
    },
    oR: {
        marginTop: "1rem",
        marginBottom: "1rem",
        fontWeight: 700,
        display: "flex",
        justifyContent: "center",
        fontSize: "1.25rem",
    }
}));

export default AddNewFleet;