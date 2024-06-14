import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";


import {  grayVehicleBg, mediumBlue, darkNavyText, lightGrayishBlue, white, mistySteel } from "assets/colors";
import { CircularProgress } from "@material-ui/core";
import { addNewFleet } from "apis/fleets";

const CreateNewFleet = ({ handleToast, handleClose }) => {
    const classes = useStyles();

    const [fleetName, setFleetName] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateFleetFormInputs = () => {
        const errObj = {};
        if (!fleetName || fleetName.trim() === "") {
            errObj["fleetName"] = "Fleet name field is required.";
        }
        setFormErrors(errObj);
        return errObj;
    };

    const addFleet = async () => {
        if (Object.keys(validateFleetFormInputs()).length > 0) return;
        setLoading(true);

        const payload = {
            "fleet-name": fleetName
        };

        try {
            const res = await addNewFleet(payload);
            if(res.body) {
                let error = res.body
                error = error.toString()
                error = error.replace(/["']/g, "");
                handleToast(false,error)
                setLoading(false);
                return;
            }
            handleToast(true, "Fleet added successfully.", "create-fleet");
            handleClose();
        } catch (err) {
            if(err.toString().includes('status code 500')) {
                handleToast(false,err.toString())
              } else {
                handleToast(false, "Couldn't add a fleet.");
              }
        } finally {
            setLoading(false);
        }
    };

    const Loader = () => {
        if (loading) {
            return (
                <div style={{ background: "#66000000", display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </div>
            );
        } else {
            return (
                <></>
            );
        }
    }

    const pointerEventsVal = loading ? 'none' : 'auto';

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        pointerEvents: pointerEventsVal,
        bgcolor: 'background.paper',
        boxShadow: "0px 2px 4px -1px rgba(0, 0, 0, 0.20), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)",
        p: 4,
    };


    return (
        <>
            <div className={classes.mainContainer} style={modalStyle}>
                <p className={classes.formLabel}>CREATE A NEW FLEET</p>
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
                    Create fleet
                </div>
                <div className={classes.cancelButton} onClick={handleClose}>
                    Cancel
                </div>
            </div>
            <Loader />
        </>
    );
}

const Spacing = () => {
    const classes = useStyles();
    return <div className={classes.spacing} />;
};

// const modalStyle = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 500,
//     bgcolor: 'background.paper',
//     boxShadow: "0px 2px 4px -1px rgba(0, 0, 0, 0.20), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)",
//     p: 4,
// };

const useStyles = makeStyles((theme) => ({
    formFieldError: {
        color: "red",
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
        marginEnd: "8px",
        marginTop: "4px",
        "&:hover": {
            cursor: "pointer",
        },
    },
    formLabel: {
        color: darkNavyText,
        fontSize: "20px",
        fontWeight: "700",
        marginTop: "0px"
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
        marginTop: "0px"
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

export default CreateNewFleet;