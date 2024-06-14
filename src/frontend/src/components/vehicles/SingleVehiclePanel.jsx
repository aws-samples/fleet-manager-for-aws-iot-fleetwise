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
import clsx from "clsx";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import KeyboardArrowLeftRoundedIcon from "@material-ui/icons/KeyboardArrowLeftRounded";
import ErrorBoundary from "components/global/ErrorBoundary";
import { setShowToastPayload, setSingleSimulateVehicleViewOpen, setSingleVehicleView } from "actions/viewActions";
import { setSelectedVehicleData } from "actions/dataActions";
import { rightSidebar as rightSidebarDimensions } from "assets/dimensions";
import { darkNavyText, grayVehicleBg, lightGrayishBlue, mediumBlue, white, blueGraphite } from "assets/colors";
import { downloadVehicleCert } from "apis/vehicles";
import { startorStopSimulation } from "apis/simulation";
import { Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { getTelemetryDetails } from "apis/vehicles";

import CircularProgress from "@material-ui/core/CircularProgress";


const VehicleTabsContainer = React.lazy(() => import("./VehicleTabsContainer"));

const SingleVehiclePanel = ({
  singleVehicleView,
  closeSingleView,
  openSingleSimulateVehicleView,
  selectedVehicleData,
  resetSelectedVehicleData,
  showToastPayload,
  setSelectedVehicle
}) => {
  const classes = useStyles();
  const closingPanelRef = React.useRef(false);

  const certLink = React.useRef();
  const [cert, setCert] = React.useState();
  const [loading, setLoading] = useState(false)

  const [isSuccessToast, setIsSuccessToast] = useState(true);
  const [toastMsg, setToastMsg] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [refreshId, setRefreshId] = useState();
  const [pollingStarted, setPollingStarted] = useState(false)

  React.useEffect(() => {
    if (cert) {
      certLink.current.click();
    }
  }, [cert]);


  const handleToast = (isSuccess, msg) => {
    setIsSuccessToast(isSuccess);
    setToastMsg(msg);
    setToastOpen(true);
  };

  const handleToastClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastOpen(false);
  };

  const closePanelHandler = () => {
    setPollingStarted(false)
    clearPolling()
    closingPanelRef.current = true;
    closeSingleView();
    resetSelectedVehicleData();
  };

  const handleStartSimulation = () => {
    openSingleSimulateVehicleView();
  }
  const getError = () => "Couldn't stop simulation"

  const handleEndSimulation = async () => {
    if (selectedVehicleData.simulationStatus === 'STARTING') {
      return;
    }
    try {
      const payload = {
        "command": 'stop',
        "vehicle-name": selectedVehicleData.vehicleName
      }
      setLoading(true)
      const response = await startorStopSimulation(payload)
      if(response.body) {
        let error = response.body
        error = error.toString()
        error = error.replace(/["']/g, "");
        handleToast(false, error)
        setLoading(false)
        return
      }
      if (response.message !== undefined) {
        if (response.message === 'simulation has stopped') {
          setSelectedVehicle({ ...selectedVehicleData, "simulationStatus": "STOPPED" })
          handleToast(true, "simulation ended successfully!")
        } else {
          handleToast(false, getError)
        }
      } else {
        handleToast(false, response.toString())
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

  const onDownloadClick = async () => {
    try {
      const certUrl = await downloadVehicleCert(selectedVehicleData.vehicleName);
      if(certUrl.body) {
        let error = certUrl.body
        error = error.toString()
        error = error.replace(/["']/g, "");
        handleToast(false, error)
        return
      }
      setCert(certUrl);
      handleToast(true, "Certificate downloaded successfully.");
    } catch (err) {
      if(err.toString().includes('status code 500')) {
        handleToast(false,err.toString())
        } else {
          handleToast(false, "Failed to download certificate.");
        }
    }
  }

  React.useEffect(() => {
    if (selectedVehicleData) closingPanelRef.current = false;
  }, [selectedVehicleData]);

  const clearPolling = () => {
    if (refreshId !== undefined) {
      clearInterval(refreshId)
    }
  }

  const fetchVehicleDetails = async () => {
    try {
      const telemetryDetails = await getTelemetryDetails(selectedVehicleData.vehicleName);
      if(telemetryDetails.body) {
        let error = telemetryDetails.body
        error = error.toString()
        error = error.replace(/["']/g, "");
        handleToast(false,error)
        clearPolling()
        return
      }
      let device = telemetryDetails.device
      device = { "mileage": "-", ...device }
      // if(telemetryDetails.geoLocation && telemetryDetails.geoLocation.Latitude && telemetryDetails.geoLocation.Longitude) {
        setSelectedVehicle({ ...selectedVehicleData, "simulationStatus": telemetryDetails.vehicle_simulator_status, "telemetry": telemetryDetails.telemetry, "geoLocation": telemetryDetails.geoLocation, "device": device })
     // }
      setToastOpen(false)
    } catch (err) {
      clearPolling()
      if(err.toString().includes('status code 500')) {
        handleToast(false,err.toString)
      }
    }
  }


  React.useEffect(() => {
    if (selectedVehicleData === undefined || selectedVehicleData === null) {
      return
    }
    if (selectedVehicleData.simulationStatus === 'STARTING' || selectedVehicleData.simulationStatus === 'HEALTHY' || selectedVehicleData.simulationStatus === 'RUNNING') {
      setPollingStarted(true)
    } else {
      setPollingStarted(false)
    }
  }, [selectedVehicleData]);

  useEffect(() => {
    let intervalId;
    if (pollingStarted) {
      fetchVehicleDetails()
      intervalId = setInterval(fetchVehicleDetails, 1000); 
      setRefreshId(intervalId)
    } else {
      clearPolling()
    }
    return () => {
      clearInterval(intervalId)
    };
  }, [pollingStarted])

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
    <div
      className={clsx(classes.root, {
        [classes.viewOpen]: singleVehicleView,
        [classes.viewClose]: !singleVehicleView
      })}
    >
      <div className={classes.flexWrapper}>
        <div className={classes.actionBar}>
          <div className={classes.backButton} onClick={closePanelHandler}>
            <KeyboardArrowLeftRoundedIcon fontSize="default" /> Back
          </div>
        </div>
        <div className={classes.contentWrapper}>
          <ErrorBoundary>
            {selectedVehicleData && (
              <React.Suspense fallback={<div />}>
                <VehicleTabsContainer
                  selectedVehicleData={selectedVehicleData}
                  closingPanelRef={closingPanelRef}
                />
                <div className={classes.bottomAction}>
                  {selectedVehicleData.simulationStatus === 'RUNNING' || selectedVehicleData.simulationStatus === 'HEALTHY' ?
                    (<div className={classes.endSimulation} onClick={handleEndSimulation}>
                      End Simulation
                    </div>) : selectedVehicleData.simulationStatus === 'STARTING' ? <div className={classes.inProcessSimulation}>
                      {!selectedVehicleData?.tabSelected && selectedVehicleData?.tabSelected === "trips" ? "Simulate Trip" : "Simulate Trip"}
                    </div> : <div className={classes.startSimulation} onClick={handleStartSimulation}>
                      {selectedVehicleData?.tabSelected === "trips" ? "Simulate Trip" : "Simulate Trip"}
                    </div>
                  }

                  <div onClick={onDownloadClick} className={classes.downloadCertificate}>
                    Download Certificate
                  </div>
                  <a className={classes.hiddenElement} download href={cert} ref={certLink} />
                </div>
              </React.Suspense>
            )}
          </ErrorBoundary>
        </div>
      </div>
      <ShowToastMessage />
      {loading ? <div style={{
        display: "flex",
        position: "absolute",
        top: 0,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <CircularProgress />
      </div>
        : null}
    </div>
  );
};

const mapStateToProps = state => {
  const {
    views: { singleVehicleView },
    data: { selectedVehicleData }
  } = state;
  return { singleVehicleView, selectedVehicleData };
};

const mapDispatchToProps = dispatch => ({
  showToastPayload: (isSuccess, toastMessage) => dispatch(setShowToastPayload(isSuccess, toastMessage)),
  openSingleSimulateVehicleView: () => dispatch(setSingleSimulateVehicleViewOpen(true)),
  closeSingleView: () => dispatch(setSingleVehicleView(false)),
  resetSelectedVehicleData: () => dispatch(setSelectedVehicleData(null)),
  setSelectedVehicle: (vehicleData) => dispatch(setSelectedVehicleData(vehicleData, { fromVehicleList: true })),
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleVehiclePanel);

const useStyles = makeStyles(theme => ({
  root: {
    position: "absolute",
    opacity: 1,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    backgroundColor: grayVehicleBg,
    zIndex: 1
  },
  flexWrapper: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    overflowY: "auto"
  },
  actionBar: {
    flex: "0 0 3.47rem",
    display: "flex"
  },
  backButton: {
    display: "flex",
    padding: "0 1.4rem",
    alignItems: "center",
    color: darkNavyText,
    "&:hover": {
      cursor: "pointer"
    },
    fontSize: "1.125rem"
  },
  hiddenElement: {
    display: "none"
  },
  startSimulation: {
    padding: "0.5rem 1rem",
    color: white,
    borderRadius: "0.33rem",
    "&:hover": {
      cursor: "pointer"
    },
    backgroundColor: mediumBlue
  },
  inProcessSimulation: {
    padding: "0.5rem 1rem",
    color: white,
    borderRadius: "0.33rem",
    cursor: 'not-allowed',
    opacity: 0.5,
    backgroundColor: mediumBlue
  },
  endSimulation: {
    padding: "0.5rem 1rem",
    color: white,
    borderRadius: "0.33rem",
    "&:hover": {
      cursor: "pointer"
    },
    backgroundColor: blueGraphite
  },
  downloadCertificate: {
    padding: "0.5rem 1rem",
    color: darkNavyText,
    borderRadius: "0.33rem",
    "&:hover": {
      cursor: "pointer"
    },
    backgroundColor: lightGrayishBlue
  },
  bottomAction: {
    padding: "1rem",
    fontSize: "1rem",
    display: "flex",
    backgroundColor: white,
    justifyContent: "space-around", /* Adjust as needed */
  },
  contentWrapper: {
    flex: 1
  },
  viewOpen: {
    marginLeft: 0,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  viewClose: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: rightSidebarDimensions.width
  }
}));
