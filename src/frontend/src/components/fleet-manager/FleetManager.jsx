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
import React, {  useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import RightSideBar from "components/sidebars/RightSidebar";
import ErrorBoundary from "components/global/ErrorBoundary";
import { rightSidebar, filtersBar } from "assets/dimensions";

import RouteMap from "components/amazon-maps/RouteMap";

import { mediumBlue, white } from "assets/colors";
import AddNewVehicle from "components/dashboard/modals/add-new-vehicle/AddNewVehicle";
import { Modal, CircularProgress, Snackbar } from "@material-ui/core";
import SingleVehicleSimulation from "components/dashboard/modals/single-vehicle-simulation/SingleVehicleSimulation";
import { setSingleSimulateVehicleViewOpen } from "actions/viewActions";
import { setSelectedVehicleData } from "actions/dataActions";


import MuiAlert from '@material-ui/lab/Alert';
import SimulateFleet from "components/dashboard/modals/simulate-fleet/SimulateFleet";
import CreateNewFleet from "components/dashboard/modals/create-fleet/CreateNewFleet";
import { getAllFleets } from "apis/fleets";
import { setFleetListData } from "actions/dashboardDataActions";
import AmazonMaps from "components/amazon-maps/AmazonMaps";


const FleetManager = ({ rightSidebarOpen, showToastPayload, singleSimulateVehicleView, items, closeSingleSimulateVehicleView, updateFleetListData, selectedVehicleData, setSelectedVehicle, singleVehicleView }) => {
  const classes = useStyles();
  const [isAddVehicle, setIsAddVehicle] = useState(false);
  const [isCreateFleet, setIsCreateFleet] = useState(false);
  const [isSimulateAll, setSimulateAll] = useState(false);

  const [isSuccessToast, setIsSuccessToast] = useState(true);
  const [toastMsg, setToastMsg] = useState("");

  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (items && items.length === 0) {
      getFleets();
      setLoading(true);
    }
    if (showToastPayload) {
      const { isSuccess, toastMessage } = showToastPayload;
      handleToast(isSuccess, toastMessage);
    }
  }, [showToastPayload]);


  // AddNewVehicle Modal
  const [openVehicle, setOpenVehicle] = useState(false)

  const handleVehicleClose = () => {
    setIsAddVehicle(false);
    setOpenVehicle(false);
  }

  // CreateNewFleet Modal
  const [openFleet, setOpenFleet] = useState(false)
  const handleOpenFleet = () => setOpenFleet(true)
  const handleFleetClose = () => {
    setIsCreateFleet(false);
    setOpenFleet(false);
  }

  // SimulationFleet Modal
  const [openSimulationFleet, setSimulationFleet] = useState(false)
  const handleSimulationFleetClose = () => {
    setSimulationFleet(false);
  }
  const simulationStarted = (updatedVehicleDetails) => {
    closeSingleSimulateVehicleView()
    setSelectedVehicle({ ...selectedVehicleData, ...updatedVehicleDetails })
  }

  const AddNewVehicleModal = () => {
    return (
      <Modal
        open={openVehicle}
        onclose={handleVehicleClose}
      >
        <AddNewVehicle fleets={items} handleToast={handleToast} handleClose={handleVehicleClose} />
      </Modal>
    );
  }

  const SimulationFleetModal = () => {
    return (
      <Modal
        open={openSimulationFleet}
        onclose={handleSimulationFleetClose}
      >
        <SimulateFleet handleClose={handleSimulationFleetClose} />
      </Modal>
    );
  }

  const CreateNewFleetModal = () => {
    return (
      <Modal
        open={openFleet}
        onclose={handleFleetClose}
      >
        <CreateNewFleet handleToast={handleToast} handleClose={handleFleetClose} />
      </Modal>
    );
  }

  const StartSimulationNNewFleet = () => {
    return (
      <div className={classes.startSimulationNFleetBtn}>
        <StartSimulationOnAll />
        <ActionNewFleetButton />
      </div>
    );
  }

  const StartSimulationOnAll = () => {
    return (
      <div
        className={classes.startSimulationBtn}
        onClick={() => {
          setSimulateAll(true);
          setSimulationFleet(true);
        }}
      >
        Create a simulated fleet
      </div>
    );
  };

  const ActionNewFleetButton = () => {
    return (
      <div
        className={classes.createFleetButton}
        onClick={() => {
          setIsCreateFleet(true);
          handleOpenFleet();
        }}
      >
        Create a new fleet
      </div>
    );
  };

  const [toastOpen, setToastOpen] = useState(false);
  const handleToast = (isSuccess, msg, from) => {
    setIsSuccessToast(isSuccess);
    setToastMsg(msg);
    setToastOpen(true);
    if (from === "create-fleet" && isSuccess) {
      getFleets();
    }
  };

  const getFleets = async () => {
    try {
      const fleetList = await getAllFleets();
      if(fleetList.body) {
        let error = fleetList.body
        error = error.toString()
        error = error.replace(/["']/g, "");
        handleToast(false,error)
        setLoading(false)
        return
      }
      setToastOpen(false);
      updateFleetListData(fleetList.fleetSummaries)
      setLoading(false);
    } catch (err) {
      setLoading(false)
      if(err.toString().includes('status code 500')) {
        handleToast(false,err.toString())
       }
    }
  };

  const handleToastClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastOpen(false);
  };

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

  const SingleVehicleSimulationModal = () => {
  
    return (
      <Modal
        open={singleSimulateVehicleView}
        onclose={closeSingleSimulateVehicleView}
      >
        <SingleVehicleSimulation handleClose={closeSingleSimulateVehicleView} vehicleName={selectedVehicleData !== undefined && selectedVehicleData !== null ? selectedVehicleData.vehicleName : ""} handleToast={handleToast} simulationStarted={simulationStarted} />
      </Modal>
    );
  }

  return (
    <>
      {loading ? <div style={{ background: "#66000000", display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></div> : (
        <div className={classes.root}>
          <div className={classes.filtersContainer}>
            <ErrorBoundary>
              <React.Suspense fallback={<div />}>
                <div>
                </div>
                <StartSimulationNNewFleet />
                <CreateNewFleetModal />
                <SimulationFleetModal />
              </React.Suspense>
            </ErrorBoundary>
          </div>
          <div className={classes.contentWrapper}>
            <AddNewVehicleModal />
            <SingleVehicleSimulationModal />
            <div className={classes.content}>
              <ErrorBoundary>
                <React.Suspense fallback={<div />}>
                  {singleVehicleView ? <RouteMap />
                    : <AmazonMaps />
                  }
                </React.Suspense>
              </ErrorBoundary>
            </div>
            <div
              className={clsx(classes.rightSidebarContainer, {
                [classes.rightSidebarClosed]: !rightSidebarOpen,
              })}
            >
              <RightSideBar />
            </div>
          </div>
          <ShowToastMessage />
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  const {
    views: { rightSidebarOpen, singleSimulateVehicleView, showToastPayload, singleVehicleView },
    data: { selectedVehicleData },
    fleetData: { items }
  } = state;
  return { rightSidebarOpen, singleSimulateVehicleView, showToastPayload, items, selectedVehicleData, singleVehicleView };
};

const mapDispatchToProps = (dispatch) => ({
  updateFleetListData: (payload) => dispatch(setFleetListData(payload)),
  closeSingleSimulateVehicleView: () => dispatch(setSingleSimulateVehicleViewOpen(false)),
  setSelectedVehicle: (vehicleData) => dispatch(setSelectedVehicleData(vehicleData, { fromVehicleList: true })),
});

export default connect(mapStateToProps, mapDispatchToProps)(FleetManager);

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  filtersContainer: {
    background: white,
    flex: `0 0 ${filtersBar.height}`,
    padding: "0 2rem",
    justifyContent: "space-between",
    display: "flex",
    flexWrap: "nowrap",
    whiteSpace: "nowrap",
    flexDirection: "row",
    alignItems: "center",
  },
  addVehicleButton: {
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
  contentWrapper: {
    width: "100%",
    flex: 1,
    display: "flex",
    overflow: "hidden",
  },
  content: {
    flexGrow: 1,
    position: "relative",
    // overflow: "hidden",
  },
  rightSidebarContainer: {
    flex: `0 0 ${rightSidebar.width}`,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  rightSidebarClosed: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: `-${rightSidebar.width}`,
  },
  createFleetButton: {
    marginTop: "1rem",
    marginStart: "0.5rem",
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
  startSimulationBtn: {
    marginTop: "1rem",
    marginEnd: "0.5rem",
    display: "inline-block",
    height: "1.78rem",
    lineHeight: "1.78rem",
    borderRadius: "0.33rem",
    padding: "0 0.75rem",
    fontSize: "0.75rem",
    fontWeight: 500,
    backgroundColor: mediumBlue,
    fontWeight: 'normal',
    textTransform: 'none',
    color: white,
    "&:hover": {
      cursor: "pointer",
    },
  },
  startSimulationNFleetBtn: {
    display: "flex",
    justifyContent: "space-between",
  },
}));
