import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import dropdownIcon from "../../../../assets/img/modal_dropdown.svg";

import { grayVehicleBg, mediumBlue, darkNavyText, lightGrayishBlue, white, mistySteel, slateBlue } from "assets/colors";

const SimulateFleet = ({ handleClose }) => {
    const classes = useStyles();

    const [fleetName, setFleetName] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const [noVehicle, setNoVehicle] = React.useState('');
    const [noVehicleSelected, setNoVehicleSelected] = React.useState(false);

    const handleNoVehicleChange = (event) => {
        setNoVehicle(event.target.value);
        setNoVehicleSelected(true);
        if (formErrors["fleet"]) {
        const errs = { ...formErrors };
        delete errs["fleet"];
        setFormErrors(errs);
        }
    };

    const validateFleetFormInputs = () => {
        const errObj = {};
        if (!fleetName || fleetName === "") {
            errObj["fleetName"] = "Fleet name field is required.";
        }
        setFormErrors(errObj);
        return errObj;
    };
    
    const noOfVehicles = [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
    ];

    const addFleet = async () => {
        if (Object.keys(validateFleetFormInputs()).length > 0) return;
        setLoading(true);

        const payload = {};

        try {
            const res = "await addNewVehicle(payload)";
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };
    if (loading) return <div style={{ textAlign: "center" }}>Loading...</div>;
    return (
        <div className={classes.mainContainer} style={modalStyle}>
            <p className={classes.formLabel}>SIMULATE FLEET</p>
            <p className={classes.subLabel}>Create a simulated fleet for demo purposes. The simulation will shut down after a specified amount of time</p>
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
                <label className={classes.textFieldLabel} for="fleet">
                    Select number of demo vehicles
                </label>
                <select name="fleet" value={noVehicle} id="fleet" onChange={handleNoVehicleChange} className={noVehicleSelected ? classes.selected : classes.select}>
                    <option value="" disabled hidden>
                        Select number of demo vehicles
                    </option>
                    {noOfVehicles.map((option) => (
                        <option key={option.value} value={option.value}>{option.value}</option>
                    ))}
                </select>
            </form>
            <div className={classes.addNewFleetButton} onClick={addFleet}>
                Create Simulated Fleet
            </div>
            <div className={classes.cancelButton} onClick={handleClose}>
                Cancel
            </div>
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
    select: {
        padding: "10px",
        backgroundColor: white,
        color: `${mistySteel} !important`,
        border: "none",
        fontWeight: "300",
        fontSize: "12px",
        marginTop: "0.5rem",
        "-webkit-appearance": "none",
        appearance: "none",
        backgroundImage: `url(${dropdownIcon})`,
        backgroundSize: "16px",
        backgroundRepeat: " no-repeat",
        backgroundPosition: " calc(100% - 8px) center",
    },
    selected: {
        padding: "10px",
        backgroundColor: white,
        color: `${darkNavyText} !important`,
        border: "none",
        fontWeight: "300",
        fontSize: "12px",
        marginTop: "0.5rem",
        "-webkit-appearance": "none",
        appearance: "none",
        backgroundImage: `url(${dropdownIcon})`,
        backgroundSize: "16px",
        backgroundRepeat: " no-repeat",
        backgroundPosition: " calc(100% - 8px) center",
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

export default SimulateFleet;