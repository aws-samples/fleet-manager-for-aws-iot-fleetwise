import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";


import {  grayVehicleBg, mediumBlue, darkNavyText, lightGrayishBlue, white, mistySteel } from "assets/colors";
import { CircularProgress } from "@material-ui/core";

const LinkDeviceToVehicle = ({ handleToast, vehicleName, handleClose, qrcodesrc }) => {
    const classes = useStyles();

    const [loading, setLoading] = useState(false);
    const [temp, settemp] = useState(qrcodesrc);
    
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
                <p className={classes.formLabel}>Link Phone to Vehicle </p>
                <img
                    style={{ width: "100%" }}
                    src={temp}
                    alt="qr code"
                    />
                <div className={classes.cancelButton} onClick={handleClose}>
                    Completed
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

export default LinkDeviceToVehicle;