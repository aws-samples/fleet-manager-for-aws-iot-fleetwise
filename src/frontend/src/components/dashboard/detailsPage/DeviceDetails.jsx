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
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Modal, Paper, Snackbar } from "@material-ui/core";
import { useDispatch } from "react-redux";

import TabsBtns from "./TabsBtns";
import General from "./General";
import Battery from "./Battery";
import amzVehicle from "assets/img/aws_daimler_photo.png";
//import amzVehicle from "assets/img/amz_vehicle_new_riv.png";
import { darkNavyText, lightGrayishBlue, mediumBlue, white, blueGraphite } from "assets/colors";

import Status from "./Status";
import NewTires from "./NewTires";
import SingleVehicleSimulation from "../modals/single-vehicle-simulation/SingleVehicleSimulation";
import LinkDeviceToVehicle from "../modals/link-device/LinkDeviceToVehicle";
import { downloadVehicleCert } from "apis/vehicles";
import { linkDevice } from "apis/vehicles";
import { startorStopSimulation } from "apis/simulation";
import Loading from "components/dashboard/tables/custom/Loader";
import { useHistory } from "react-router-dom";
import { setSelectedVehicleData } from "actions/dataActions";
import { setSingleVehicleView } from "actions/viewActions";
import { getTelemetryDetails } from "apis/vehicles";


import MuiAlert from '@material-ui/lab/Alert';
import VehicleTrips from "components/vehicles/VehicleTrips";

const DeviceDetails = ({vehicleDetails }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [selectedTab, setSelectedTab] = useState("details");
  const [loading, setLoading] = useState(false)
  const [singleVehicle, setSingleVehicle] = useState(false)
  const [linkDeviceState, setLinkDevice] = useState(false)
  const certLink = React.useRef();
  const [cert, setCert] = React.useState();
  const [qrcodeUrl, setqrcodeUrl] = useState("");
  const [isSuccessToast, setIsSuccessToast] = useState(true);
  const [toastMsg, setToastMsg] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [vehicle, setVehicle] = useState(vehicleDetails);
  const [refreshId, setRefreshId] = useState();
  const navigate = useHistory()


  const clearPolling = () => {
    if (refreshId !== undefined) {
      clearInterval(refreshId)
    }
  }
  useEffect(()=>{
    dispatch(setSelectedVehicleData(vehicle ));
  },[])

  const fetchVehicleDetails = async () => {
    try {
      const telemetryDetails = await getTelemetryDetails(vehicle.vehicleName);
      if(telemetryDetails.body) {
        clearPolling()
        let error = telemetryDetails.body
        error = error.toString()
        error = error.replace(/["']/g, "");
        handleToast(false,error)
        return;
      }

      let device = telemetryDetails.device
      device = { "mileage": "-", ...device }

      const vehicleDetails = {
        "vehicleName": telemetryDetails.vehicle_name,
        "telemetry": telemetryDetails.telemetry,
        "device": device,
        "geoLocation": telemetryDetails.geoLocation,
        "simulationStatus": telemetryDetails.vehicle_simulator_status
      }
      setVehicle(vehicleDetails)
      setToastOpen(false)
    } catch (err) {
      clearPolling()
      if(err.toString().includes('status code 500')) {
        handleToast(false,err.toString())
    }  
    }
  }

  useEffect(() => {
    let intervalId;
    if (vehicle.simulationStatus === 'HEALTHY' || vehicle.simulationStatus === 'RUNNING' || vehicle.simulationStatus === 'STARTING') {
      fetchVehicleDetails()
      intervalId = setInterval(fetchVehicleDetails, 10000); // 30000 milliseconds = 30 seconds    
      setRefreshId(intervalId)
    } else {
      clearPolling()
    }
    return () => {
      clearInterval(intervalId)
    };
  }, [vehicle.simulationStatus])

  const handleStartSimulation = () => {
    setSingleVehicle(true)
  }
  const handeLinkDeviceOpen = () => {
    setLinkDevice(true)
  }
  const getError = () => "Couldn't stop simulation"

  const handleToast = (isSuccess, msg) => {
    setIsSuccessToast(isSuccess);
    setToastMsg(msg);
    setToastOpen(true);
  };
  const handeLinkDeviceClose = () => {
    setLinkDevice(false);
  }
  const handleSingleVehicleClose = () => {
    setSingleVehicle(false)
  }
  const simulationStarted = (updatedVehicleDetails) => {
    clearPolling()
    handleSingleVehicleClose()
    dispatch(setSelectedVehicleData({ ...vehicle, ...updatedVehicleDetails }));
    dispatch(setSingleVehicleView(true))
    navigate.push('/map')
  }

  const SingleVehicleSimulationModal = () => {
    return (
      <Modal
        open={singleVehicle}
        onClose={handleSingleVehicleClose}
      >
        <SingleVehicleSimulation handleClose={handleSingleVehicleClose} vehicleName={vehicle.vehicleName} handleToast={handleToast} simulationStarted={simulationStarted} />
      </Modal>
    );
  }

  const LinkDeviceToVehicleModal = () => {
    return (
      <Modal
        open={linkDeviceState}
        onClose={handeLinkDeviceClose}
      >
        <LinkDeviceToVehicle handleClose={handeLinkDeviceClose} vehicleName={vehicle.vehicleName} handleToast={handleToast} qrcodesrc={qrcodeUrl} />
      </Modal>
    );
  }

  React.useEffect(() => {
    if (cert) {
      certLink.current.click();
    }
  }, [cert]);

  const onDownloadClick = async () => {
    try {
      const certUrl = await downloadVehicleCert(vehicle.vehicleName);
      if(certUrl.body) {
        let error = certUrl.body
        error = error.toString()
        error = error.replace(/["']/g, "");
        handleToast(false, error)
        return
      }
      setCert(certUrl);
      handleToast(true, "Certificate downloaded successfully.")
    } catch (err) {
      if(err.toString().includes('status code 500')) {
        handleToast(false,err.toString())
        } else {
          handleToast(false, "Failed to download certificate.");
        }
    }
  }

  const onLinkDeviceClick = async () => {
    try {
      const response = await linkDevice(vehicle.vehicleName);
      if(response.statusCode != 200) {
        let error = response.body
        error = error.toString()
        error = error.replace(/["']/g, "");
        handleToast(false, error)
        return
      }
      setqrcodeUrl(response.body.replace(/["']/g, ""));
      handeLinkDeviceOpen()
    } catch (err) {
      if(err.toString().includes('status code 500')) {
        handleToast(false,err.toString())
        } else {
          handleToast(false, "Failed to retreive QR Code." + err.toString());
        }
    }
  }

  const handleToastClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastOpen(false);
  };
  const handleEndSimulation = async () => {
    clearPolling()
    try {
      const payload = {
        "command": 'stop',
        "vehicle-name": vehicle.vehicleName
      }
      setLoading(true)
      const response = await startorStopSimulation(payload)
      if(response.body) {
        let error = response.body
        error = error.toString()
        error = error.replace(/["']/g, "");
        handleToast(false,error)
        setLoading(false)
        return;
       }
      if (response.message !== undefined) {
        if (response.message === 'simulation has stopped') {
          setVehicle({ ...vehicle, "simulationStatus": 'STOPPED' })
          handleToast(true, "simulation ended successfully!")
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
  }

  const severityToastType = isSuccessToast ? "success" : "error"

  const ShowToastMessage = () => {
    return (
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={toastOpen}
        autoHideDuration={5000}
        onClose={handleToastClose}
        message={toastMsg}
      >
        <MuiAlert
          onClose={handleToastClose}
          severity={severityToastType}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toastMsg}
        </MuiAlert>
      </Snackbar>
    )
  };

  return (
    <div>
      <SingleVehicleSimulationModal />
      <LinkDeviceToVehicleModal />
      <Paper elevation={4} className={classes.container}>
        <Grid item lg={6} sm={12}>
          <div className={classes.vehicleImg}>
            <img
              style={{ width: "100%" }}
              src={amzVehicle}
              alt="amazon vehicle"
            />
          </div>
        </Grid>
        <Grid item lg={6} sm={12} style={{ backgroundColor: "#F8F8F9" }}>
          <div className={classes.vinContainer}>
            <h1 className={classes.vin}>{vehicle.device.vin}</h1>
            <h4 className={classes.vanType}>{vehicle.device.year + " " + vehicle.device.make + " " + vehicle.device.model}</h4>
          </div>
          <div className={classes.divider}></div>
          <TabsBtns selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
          {selectedTab === "details" ? (
            <General details={vehicle.device} />
          ) : selectedTab === "tires" ? (
            <NewTires telemetry={vehicle.telemetry} />
          ) : selectedTab === "status" ? (
            <Status telemetry={vehicle.telemetry} geoLocation={vehicle.geoLocation} />
          ) : selectedTab === "trips" ? (
            <VehicleTrips />
          ) : (
            <Battery />
          )}
        
          <div className={classes.bottomAction}>
            {vehicle.simulationStatus === 'RUNNING' || vehicle.simulationStatus === 'HEALTHY' ?
              (<div className={classes.endSimulation} onClick={handleEndSimulation}>
                End Simulation
              </div>) : vehicle.simulationStatus === 'STARTING' ? <div className={classes.inProcessSimulation}>
                {selectedTab === "trips" ? "Simulate Trip" : "Simulate Trip"}
              </div> : <div className={classes.startSimulation} onClick={handleStartSimulation}>
                {selectedTab === "trips" ? "Simulate Trip" : "Simulate Trip"}
              </div>
            }
            <div onClick={onDownloadClick} className={classes.downloadCertificate}>
              Download Certificate
            </div>
            <div onClick={onLinkDeviceClick} className={classes.linkDevice}>
              Link Device
            </div>
            <a className={classes.hiddenElement} download href={cert} ref={certLink} />
          </div>
        </Grid>
      </Paper>
      <ShowToastMessage />
      {loading ?
        <Loading /> : null}
    </div>
  );
};

export default DeviceDetails;

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    justifyContent: "center",
    display: "flex",
  },
  vehicleImg: {},
  vinContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
    color: darkNavyText
  },
  vin: {
    fontSize: 36,
    fontWeight: 400,
    marginBottom: 12,
  },
  vanType: {
    fontSize: 24,
    fontWeight: 400,
    marginTop: 0,
    marginBottom: 59,
    opacity: 0.5,
    // color: "#8E939B",
  },
  startSimulation: {
    padding: "0.5rem 1rem",
    margin: "1rem",
    color: white,
    borderRadius: "0.33rem",
    "&:hover": {
      cursor: "pointer"
    },
    backgroundColor: mediumBlue
  },
  inProcessSimulation: {
    padding: "0.5rem 1rem",
    margin: "1rem",
    color: white,
    borderRadius: "0.33rem",
    cursor: 'not-allowed',
    opacity: 0.5,
    backgroundColor: mediumBlue
  },
  endSimulation: {
    padding: "0.5rem 1rem",
    margin: "1rem",
    color: white,
    borderRadius: "0.33rem",
    "&:hover": {
      cursor: "pointer"
    },
    backgroundColor: blueGraphite
  },
  downloadCertificate: {
    padding: "0.5rem 1rem",
    margin: "1rem",
    color: darkNavyText,
    borderRadius: "0.33rem",
    "&:hover": {
      cursor: "pointer"
    },
    backgroundColor: lightGrayishBlue
  },
  linkDevice: {
    padding: "0.5rem 1rem",
    margin: "1rem",
    color: darkNavyText,
    borderRadius: "0.33rem",
    "&:hover": {
      cursor: "pointer"
    },
    backgroundColor: lightGrayishBlue
  },
  bottomAction: {
    paddingTop: "1rem",
    fontSize: "1rem",
    display: "flex",
    justifyContent: "center", /* Adjust as needed */
  },
  hiddenElement: {
    display: "none"
  },
  divider: {
    borderBottom: "1px solid #E3E4E6",
    width: "75%",
    margin: "0 auto 30px auto",
  },
}));
