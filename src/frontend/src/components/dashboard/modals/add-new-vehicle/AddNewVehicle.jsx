import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";

import {  grayVehicleBg, mediumBlue, darkNavyText, lightGrayishBlue, white, slateBlue, mistySteel } from "assets/colors";
import dropdownIcon from "../../../../assets/img/modal_dropdown.svg";
import { addNewVehicle } from "apis/vehicles";
import { CircularProgress } from "@material-ui/core";

const AddNewVehicle = ({ fleets, handleToast, handleClose }) => {
  const classes = useStyles();

  const [vin, setVin] = useState("");
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [fleet, setFleet] = React.useState('');
  const [fleetSelected, setFleetSelected] = React.useState(false);

  const handleFleetChange = (event) => {
    setFleet(event.target.value);
    setFleetSelected(true);
    if (formErrors["fleet"]) {
      const errs = { ...formErrors };
      delete errs["fleet"];
      setFormErrors(errs);
    }
  };

  const fleetOptions = [
    { value: 'Fleet 1', label: 'Fleet 1' },
    { value: 'Fleet 2', label: 'Fleet 2' },
    { value: 'Fleet 3', label: 'Fleet 3' },
    { value: 'Fleet 4', label: 'Fleet 4' },
  ];

  const validateFormInputs = () => {
    const errObj = {};

    if (!vin || vin === "") {
      errObj["vin"] = "Vin field is required.";
    }
    if (vin.length !== 17) {
      errObj["vin"] = "Please enter exactly 17 characters.";
    }
    if (!year || year === "") {
      errObj["year"] = "Year field is required.";
    }
    if (!make || make === "") {
      errObj["make"] = "Make field is required.";
    }
    if (!model || model === "") {
      errObj["model"] = "Model field is required.";
    }
    if (!licensePlate || licensePlate === "") {
      errObj["licensePlate"] = "License plate field is required.";
    }
    if (!fleet || fleet === "") {
      errObj["fleet"] = "Fleet field is required.";
    }
    setFormErrors(errObj);
    return errObj;
  };

  const addVehicle = async () => {
    if (Object.keys(validateFormInputs()).length > 0) return;
    setLoading(true);

    const payload = {
      "fleet-name": fleet,
      vin: vin.trim(),
      make: make.trim(),
      model: model.trim(),
      year: year.trim(),
      license: licensePlate.trim(),
    };

    try {
      const res = await addNewVehicle(payload);
      if(res.body) {
        let error = res.body
        error = error.toString()
        error = error.replace(/["']/g, "");
        if(error.includes("Please choose a unique VIN")) {
          const errObj = {};
          errObj["vin"] = error;
          setFormErrors(errObj)
        } else {
          handleToast(false,error)
        }
        setLoading(false);
        return;
    }
      handleToast(true, "Vehicle added successfully.");
      handleClose();
    } catch (err) {
      if(err.toString().includes('status code 500')) {
        handleToast(false,err.toString())
    } else {
      handleToast(false, "Couldn't add a vehicle.");
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
        <p className={classes.formLabel}>ADD NEW VEHICLE</p>
        <p className={classes.subLabel}>Add a vehicle to the fleet</p>
        <form className={classes.formContainer}>
        
          <Spacing />
          <label className={classes.textFieldLabel} for="fleet">
            Fleet
          </label>
          <select name="fleet" value={fleet} id="fleet" onChange={handleFleetChange} className={fleetSelected ? classes.selected : classes.select}>
            <option value="" disabled hidden>
              Select Fleet
            </option>
            {fleets.map((option) => (
              <option key={option.id} value={option.id}>{option.id}</option>
            ))}
          </select>
          <div className={classes.formFieldError}>{formErrors["fleet"]}</div>
          <Spacing />
          <label className={classes.textFieldLabel} for="vin">
            Vin
          </label>
          <input
            id="vin"
            placeholder="Enter VIN"
            className={classes.textField}
            value={vin}
            onChange={(e) => {
              setVin(e.target.value);
              if (formErrors["vin"]) {
                const errs = { ...formErrors };
                delete errs["vin"];
                setFormErrors(errs);
              }
            }}
          />
          <div className={classes.formFieldError}>{formErrors["vin"]}</div>
          <Spacing />
          <label className={classes.textFieldLabel} for="year">
            Year
          </label>
          <input
            id="year"
            placeholder="Enter Year"
            className={classes.textField}
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              if (formErrors["year"]) {
                const errs = { ...formErrors };
                delete errs["year"];
                setFormErrors(errs);
              }
            }}
          />
          <div className={classes.formFieldError}>{formErrors["year"]}</div>
        
          <Spacing />
          <label className={classes.textFieldLabel} for="make">
            Make
          </label>
          <input
            id="make"
            placeholder="Enter Make"
            className={classes.textField}
            value={make}
            onChange={(e) => {
              setMake(e.target.value);
              if (formErrors["make"]) {
                const errs = { ...formErrors };
                delete errs["make"];
                setFormErrors(errs);
              }
            }}
          />
          <div className={classes.formFieldError}>{formErrors["make"]}</div>
          
          <Spacing />
          <label className={classes.textFieldLabel} for="model">
            Model
          </label>
          <input
            id="model"
            placeholder="Enter Model"
            className={classes.textField}
            value={model}
            onChange={(e) => {
              setModel(e.target.value);
              if (formErrors["model"]) {
                const errs = { ...formErrors };
                delete errs["model"];
                setFormErrors(errs);
              }
            }}
          />
          <div className={classes.formFieldError}>{formErrors["model"]}</div>
         
          <Spacing />
          <label className={classes.textFieldLabel} for="license">
            License Plate
          </label>
          <input
            id="license"
            placeholder="Enter License Plate"
            className={classes.textField}
            value={licensePlate}
            onChange={(e) => {
              setLicensePlate(e.target.value);
              if (formErrors["licensePlate"]) {
                const errs = { ...formErrors };
                delete errs["licensePlate"];
                setFormErrors(errs);
              }
            }}
          />
          <div className={classes.formFieldError}>{formErrors["licensePlate"]}</div>
        </form>
        <Spacing />
        <div className={classes.addToFleetButton} onClick={addVehicle}>
          Add vehicle
        </div>
        <div className={classes.cancelButton} onClick={handleClose}>
          Cancel
        </div>
      </div>
      <Loader />
    </>
  );
};

const Spacing = () => {
  const classes = useStyles();
  return <div className={classes.spacing} />;
};

const useStyles = makeStyles((theme) => ({
  addToFleetButton: {
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
  mainContainer: {
    borderRadius: "4px",
    backgroundColor: grayVehicleBg,
    padding: '1rem', // Top Right Bottom Left
    fontSize: "20px",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  },
  formFieldError: {
    color: "red",
    fontSize: "12px"
  },
  formLabel: {
    color: darkNavyText,
    fontSize: "20px",
    fontWeight: "700",
    margin: "0rem",
    marginBottom: "4px"
  },
  subLabel: {
    color: slateBlue,
    fontSize: "14px",
    fontWeight: "400",
    margin: "0rem",
    marginTop: "4px"
  },
  textFieldLabel: {
    color: darkNavyText,
    fontSize: "16px",
    fontWeight: "700",
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
  spacing: {
    marginBottom: "1rem",
  },
}));

export default AddNewVehicle;
