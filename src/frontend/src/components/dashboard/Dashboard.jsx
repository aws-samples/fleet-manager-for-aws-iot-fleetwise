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
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { CircularProgress, Snackbar } from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { connect } from "react-redux";

import ErrorBoundary from "components/global/ErrorBoundary";
import Header from "./Header";
import TablesContainer from "./tables/TablesContainer";
import DeviceDetails from "./detailsPage/DeviceDetails";
import { setFleetListData } from "actions/dashboardDataActions";
import { white, darkNavyText, mediumBlue } from "assets/colors";

import { filtersBar } from "assets/dimensions";
import AddNewVehicle from "./modals/add-new-vehicle/AddNewVehicle";
import SelectCampaign from "./campaigns/SelectCampaign";
import SelectFleet from "./fleets/SelectFleet";
import { Modal } from "@material-ui/core";
import CreateNewFleet from "./modals/create-fleet/CreateNewFleet";
import SimulateFleet from "./modals/simulate-fleet/SimulateFleet";
import { getAllFleets } from "apis/fleets";
import { getAllCampaigns } from "apis/campaigns";
import { getVehiclesByFleetName, getVehiclesByCampaign, getTelemetryDetails } from "apis/vehicles";


import MuiAlert from '@material-ui/lab/Alert';


const Dashboard = ({ updateFleetListData }) => {

  const classes = useStyles();
  const [selectedVin, setSelectedVin] = useState(null);
  const [isAddVehicle, setIsAddVehicle] = useState(false);
  const [isCreateFleet, setIsCreateFleet] = useState(false);
  const [isSimulateAll, setSimulateAll] = useState(false);
  const [isDetails, setIsDetails] = useState(false);
  const [fleets, setFleets] = useState([]);
  const [selectedFleet, setSelectedFeet] = useState('')
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampign, setSelectedCampaign] = useState('')
  const [vehicles, setVehicles] = useState([])
  const [vehiclesCampaignWise, setVehiclesCampaignWise] = useState([])

  const [selectedVehicleDetails, setSelectedVehicleDetails] = useState({})
  const [dataLoaded, setDataLoaded] = useState(false)
  const [loading, setLoading] = useState(true);

  const [isSuccessToast, setIsSuccessToast] = useState(true);
  const [toastMsg, setToastMsg] = useState("");
  const [refreshData, setRefreshData] = useState(true);
  const [lastUpdatedTime, setLastUpdatedTime] = useState('');
  const [totalFleetVehicleCount, setTotalFleetVehicleCount] = useState(0)
  const [totalCampaignVehicleCount, setTotalCampaignVehicleCount] = useState(0)

  const [isCampaignSelected, setCampaignSelected] = useState(false)
  const [campaignRefreshId, setCampaignRefreshId] = useState()
  const [fleetRefreshId, setFleetRefreshId] = useState()
  const [timeoutId, setTimeoutId] = useState()
  const [selectedFleetIndex, setSelectedFleetIndex] = useState(0)
  const [selectedCampaignIndex, setSelectedCampaignIndex] = useState(0)
  const [startPolling, setStartPolling] = useState(false)
  const [error, setError] = useState('')

  const defaultPaginationState = {
    "fleetTable": {
      "selectedPage": 0,
      "rowsPerPage": 10
    },
    "campaignTable": {
      "selectedPage": 0,
      "rowsPerPage": 10
    }
  }
  const [paginationState, setPaginationState] = useState(defaultPaginationState)

  const handleChangePaginationState = (state) => {
    setError('')
    setPaginationState(state)
  }
  let fleetId
  const getCurrentDate = () => {
    const today = new Date();
    const time = today
      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      .toUpperCase();
    const date = today.toLocaleDateString()
    return date + " " + time;
  }

  const getData = async () => {
    try {
     setError('')
      let fleetList = await getAllFleets()
      if(fleetList.body) {
        let error = fleetList.body
        error = error.toString()
        error = error.replace(/["']/g, "");
        setError(error)
        setLoading(false)
        return
      } 
      let campaignList  = (await (await (await getAllCampaigns()).response).body.text()).toString();

      if(campaignList.body) {
        let error = campaignList.body;
        error = error.toString()
        error = error.replace(/["']/g, "");
        setError(error)
        setLoading(false)
        return
      }
      setToastOpen(false)
      campaignList = ["Select campaign", ...campaignList]
      let fleetIndex = selectedFleetIndex
      let campaignIndex = selectedCampaignIndex
      if (selectedFleet !== '' && selectedCampign !== '') {
        fleetIndex = fleetList.fleetSummaries.map(item => item.id).indexOf(selectedFleet);
        campaignIndex = campaignList.map(item => item).indexOf(selectedCampign);
        setSelectedFleetIndex(fleetIndex)
        setSelectedCampaignIndex(campaignIndex)
      }
      setFleets(fleetList.fleetSummaries)
      setSelectedFeet(fleetList.fleetSummaries?.length!==0?fleetList.fleetSummaries[fleetIndex].id:'')
      updateFleetListData(fleetList.fleetSummaries)
      setCampaigns(campaignList)
      setSelectedCampaign(campaignList[campaignIndex])
      if(fleetList.fleetSummaries.length!==0) {
        getVehicles(fleetList.fleetSummaries[fleetIndex].id)
      } else { 
        setLastUpdatedTime(getCurrentDate())
        setDataLoaded(true)
        setLoading(false)
      }
      setRefreshData(false)
    } catch (err) {
      if(err.toString().includes('status code 500')) {
        setError(err.toString())
      }
      setLoading(false)
    }
  };

  const getVehicles = async (fleet) => {
    try {
      setError('')
      fleetId = fleet
      const response = await getVehiclesByFleetName(fleet);
      if(response.body) {
        let error = response.body
        error = error.toString()
        error = error.replace(/["']/g, "");
        setError(error)
        setLoading(false)
        setStartPolling(false)
        return
      } 
        const vehicleList = response.vehicles
        const totalVehiclesCount = response.totalCount
        setTotalFleetVehicleCount(totalVehiclesCount)
  
        const vehicles = []
        let isSimulationInProcessForAnyVehicle = false
        for (let i = 0; i < vehicleList.length; i++) {
  
          const vehicle = vehicleList[i];
          const attributes = vehicle.attributes
          if (attributes !== undefined) {
            vehicles.push({
              "mileage": "-",
              "license": attributes.license ? attributes.license : "-",
              "make": attributes.make ? attributes.make : "-",
              "vin": attributes.vin ? attributes.vin : "-",
              "year": attributes.year ? attributes.year : "-",
              "model": attributes.model ? attributes.model : "-",
              "simulationStatus": vehicle.vehicle_simulator_status ? vehicle.vehicle_simulator_status : "STOPPED",
              "vehicleName": vehicle.vehicleName,
            });
            if (vehicle.vehicle_simulator_status === "STARTING") {
              isSimulationInProcessForAnyVehicle = true
            }
          }
  
        }
        setVehicles(vehicles)
        setLastUpdatedTime(getCurrentDate())
        setDataLoaded(true)
        setLoading(false)
        if (isSimulationInProcessForAnyVehicle) {
          setStartPolling(true)
        } else {
          setStartPolling(false)
        }
      
      

    } catch (err) {
      setStartPolling(false)
      setLoading(false)
      if(err.toString().includes('status code 500')) {
        setError(err.toString())
      }
    }
  }

  const clearPolling = () => {
    if (fleetRefreshId !== undefined) {
      clearInterval(fleetRefreshId)
    }
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
    }
  }

  const fetchVehicles = async () => {
    setError('')
    try {
      if (fleetId === undefined) {
        fleetId = selectedFleet
      }
      const response = await getVehiclesByFleetName(fleetId);
      if(response.body) {
        let error = response.body
        error = error.toString()
        error = error.replace(/["']/g, "");
        setError(error)
        setStartPolling(false)
        setLoading(false)
        return
      }
      const vehicleList = response.vehicles
      const totalVehiclesCount = response.totalCount
      setTotalFleetVehicleCount(totalVehiclesCount)

      const vehicles = []
      let isSimulationInProcessForAnyVehicle = false
      for (let i = 0; i < vehicleList.length; i++) {

        const vehicle = vehicleList[i];
        const attributes = vehicle.attributes
        if (attributes !== undefined) {
          vehicles.push({
            "mileage": "-",
            "license": attributes.license ? attributes.license : "-",
            "make": attributes.make ? attributes.make : "-",
            "vin": attributes.vin ? attributes.vin : "-",
            "year": attributes.year ? attributes.year : "-",
            "model": attributes.model ? attributes.model : "-",
            "simulationStatus": vehicle.vehicle_simulator_status ? vehicle.vehicle_simulator_status : "STOPPED",
            "vehicleName": vehicle.vehicleName,
          });
          if (vehicle.vehicle_simulator_status === "STARTING") {
            isSimulationInProcessForAnyVehicle = true
          }
        }

      }
      setVehicles(vehicles)
      setLastUpdatedTime(getCurrentDate())
      if (!isSimulationInProcessForAnyVehicle) {
        setStartPolling(false)
      }
    } catch (err) {
      if(err.toString().includes('status code 500')) {
        setError(err.toString())
      }
      setStartPolling(false)
    }
  };

  useEffect(() => {
    if (startPolling) {
      clearPolling()
      const intervalId = setInterval(fetchVehicles, 10000);
      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
      }, 300000); // 300000 milliseconds = 5 minutes
      setTimeoutId(timeoutId)
      setFleetRefreshId(intervalId)
    } else {
      clearPolling()
    }

  }, [startPolling])

  const updateVehicleList = (status, vn) => {
    setError('')
    const newList = (isCampaignSelected ? vehiclesCampaignWise : vehicles).map((item) => {
      if (item.vehicleName === vn) {
        const updatedItem = {
          ...item,
          simulationStatus: status,
        };
        return updatedItem;
      }
      return item;
    });
    isCampaignSelected ? setVehiclesCampaignWise(newList) : setVehicles(newList);
  }

  const startPollingForVehicleSimulation = (value, status, vehicleName) => {
    if (!isCampaignSelected) {
      setStartPolling(value)
    }
    updateVehicleList(status, vehicleName)
  }


  let count = 0;
  const handleSetSelectedCampaign = async (campaign) => {
    setError('')
    setStartPolling(false)
    const index = campaigns.map(item => item).indexOf(campaign);
    setSelectedCampaignIndex(index)
    setSelectedCampaign(campaign)
    count = 0;
    if (campaignRefreshId !== undefined) {
      clearInterval(campaignRefreshId)
    }
    if (campaign !== 'Select campaign') {
      setLoading(true)
      setDataLoaded(false)
      setCampaignSelected(true)
      const error = await getVehiclesBasedOnCampaign(campaign)
      if( !(typeof error === 'string' || error instanceof String)) {
        const id = setInterval(function () { getVehiclesBasedOnCampaign(campaign) }, 5000)
        setCampaignRefreshId(id)
      }
    }
  }

  const getVehiclesBasedOnCampaign = async (campaign) => {
    try {
      setError('')
      const response = await getVehiclesByCampaign(campaign);
      if(response.body) {
        let error = response.body
        error = error.toString()
        error = error.replace(/["']/g, "");
        setError(error)
        setLoading(false)
        return error
      }
      const vehicleList = response.vehicles
      const totalVehiclesCount = response.totalCount
      setTotalCampaignVehicleCount(totalVehiclesCount)

      const vehicles = []
      for (let i = 0; i < vehicleList.length; i++) {

        const vehicle = vehicleList[i];
        const longitude = vehicle.telemetry.Longitude
        if (longitude !== undefined) {
          vehicles.push({
            "simulationStatus": vehicle.vehicle_simulator_status ? vehicle.vehicle_simulator_status : "STOPPED",
            "vin": vehicle.metadata.vin ? vehicle.metadata.vin : "-",
            "RightFrontTirePressure": parseFloat(vehicle.telemetry.RightFrontTirePressure).toFixed(2),
            "LeftFrontTirePressure": parseFloat(vehicle.telemetry.LeftFrontTirePressure).toFixed(2),
            "RightRearTirePressure": parseFloat(vehicle.telemetry.RightRearTirePressure).toFixed(2),
            "LeftRearTirePressure": parseFloat(vehicle.telemetry.LeftRearTirePressure).toFixed(2),
            "MaxCellVoltage": parseFloat(vehicle.telemetry.MaxCellVoltage).toFixed(2),
            "BatteryDCVoltage": parseFloat(vehicle.telemetry.BatteryDCVoltage).toFixed(2),
            "OutsideAirTemperature": parseFloat(vehicle.telemetry.OutsideAirTemperature).toFixed(2),
            "MinCellVoltage": parseFloat(vehicle.telemetry.MinCellVoltage).toFixed(2),
            "InCabinTemperature": parseFloat(vehicle.telemetry.InCabinTemperature).toFixed(2),
            "BatteryCurrent": parseFloat(vehicle.telemetry.BatteryCurrent).toFixed(2),
            "IsCharging": vehicle.telemetry.IsCharging ? "true" : "false",
            "MaxTemperature": parseFloat(vehicle.telemetry.MaxTemperature).toFixed(2),
            "MinTemperature": parseFloat(vehicle.telemetry.MinTemperature).toFixed(2),
            "BatteryAvailableChargePower": parseFloat(vehicle.telemetry.BatteryAvailableChargePower).toFixed(2),
            "hasActiveDTC": vehicle.telemetry.hasActiveDTC ? "true" : "false",
            "BatteryAvailableDischargePower": parseFloat(vehicle.telemetry.BatteryAvailableDischargePower).toFixed(2),
            "TotalOperatingTime": parseFloat(vehicle.telemetry.TotalOperatingTime).toFixed(2),
            "Speed": parseFloat(vehicle.telemetry.Speed).toFixed(2),
            "StateOfHealth": parseFloat(vehicle.telemetry.StateOfHealth).toFixed(2),
            "FanRunning": vehicle.telemetry.FanRunning ? "true" : "false",
            "Current": parseFloat(vehicle.telemetry.Current).toFixed(2),
            "RightFrontTireTemperature": parseFloat(vehicle.telemetry.RightFrontTireTemperature).toFixed(2),
            "RightRearTireTemperature": parseFloat(vehicle.telemetry.RightRearTireTemperature).toFixed(2),
            "LeftFrontTireTemperature": parseFloat(vehicle.telemetry.LeftFrontTireTemperature).toFixed(2),
            "LeftRearTireTemperature": parseFloat(vehicle.telemetry.LeftRearTireTemperature).toFixed(2),
            "vehicleName": vehicle.vehicle_name,
          });
        } else {
          vehicles.push({
            "simulationStatus": vehicle.vehicle_simulator_status ? vehicle.vehicle_simulator_status : "STOPPED",
            "vin": vehicle.metadata.vin ? vehicle.metadata.vin : "-",
            "RightFrontTirePressure": "-",
            "LeftFrontTirePressure": "-",
            "RightRearTirePressure": "-",
            "LeftRearTirePressure": "-",
            "MaxCellVoltage": "-",
            "BatteryDCVoltage": "-",
            "OutsideAirTemperature": "-",
            "MinCellVoltage": "-",
            "InCabinTemperature": "-",
            "BatteryCurrent": "-",
            "IsCharging": "-",
            "MaxTemperature": "-",
            "MinTemperature": "-",
            "BatteryAvailableChargePower": "-",
            "hasActiveDTC": "-",
            "BatteryAvailableDischargePower": "-",
            "TotalOperatingTime": "-",
            "Speed": "-",
            "StateOfHealth": "-",
            "FanRunning": "-",
            "Current": "-",
            "RightFrontTireTemperature": "-",
            "RightRearTireTemperature": "-",
            "LeftFrontTireTemperature": "-",
            "LeftRearTireTemperature": "-",
            "vehicleName": vehicle.vehicle_name,
          });
        }

      }
      setVehiclesCampaignWise(vehicles)
      setLastUpdatedTime(getCurrentDate())
      if (count == 0) {
        setDataLoaded(true)
        setLoading(false)
      }
      count++

    } catch (err) {
      setLoading(false)
      if(err.toString().includes('status code 500')) {
        setError(err.toString())
      }
    }
  }

  const handleSelectedVehicle = async (vehicle) => {
    setError('')
    setLoading(true)
    setDataLoaded(false)
    getVehicleDetails(vehicle)
  }

  const getVehicleDetails = async (vehicle) => {
    try {
      setError('')
      const telemetryDetails = await getTelemetryDetails(vehicle);
      if(telemetryDetails.body) {
        let error = telemetryDetails.body
        error = error.toString()
        error = error.replace(/["']/g, "");
        setError(error)
        setLoading(false)
        return
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
      setSelectedVehicleDetails(vehicleDetails)
      setIsDetails(true)
      setDataLoaded(true)
      setLoading(false)

    } catch (err) {
      setLoading(false)
      if(err.toString().includes('status code 500')) {
        setError(err.toString())
      }
    }
  }



  useEffect(() => {
    if (!refreshData) {
      return
    }
    getData();
    return () => {
      clearPolling()
      clearInterval(campaignRefreshId);
    };
  }, [refreshData]);

  const handleSetSelectedFleet = (fleet) => {
    setError('')
    setStartPolling(false)
    const index = fleets.map(item => item.id).indexOf(fleet);
    setSelectedFleetIndex(index)
    setLoading(true)
    setDataLoaded(false)
    setSelectedFeet(fleet)
    getVehicles(fleet)

  }
  const switchToFleetView = () => {
    setError('')
    if (campaignRefreshId !== undefined) {
      clearInterval(campaignRefreshId)
    }
    setSelectedCampaign("Select campaign")
    setCampaignSelected(false)
  }



  // AddNewVehicle Modal
  const [openVehicle, setOpenVehicle] = useState(false)
  const handleVehicleOpen = () => setOpenVehicle(true)
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

  const [toastOpen, setToastOpen] = useState(false);
  const handleToast = (isSuccess, msg) => {
    if (isSuccess) {
      setRefreshData(isSuccess);
    }
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

  const ActionButtons = () => {
    return (
      <div style={{ marginTop: "1rem" }}>
        <div
          className={classes.addVehicleButton}
          onClick={() => {
            setIsAddVehicle(true);
            handleVehicleOpen();
          }}
        >
          Add new vehicle
        </div>
      </div>
    );
  };

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

  const AddNewVehicleModal = () => {
    return (
      <Modal
        open={openVehicle}
        onclose={handleVehicleClose}
      >
        <AddNewVehicle fleets={fleets} handleToast={handleToast} handleClose={handleVehicleClose} />
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

  return (
    <>
      {dataLoaded ? isDetails ? (
        <div className={classes.vehicleDetails}>
          <div className={classes.backLink} onClick={() => { setIsDetails(false); setSelectedVin(null); }}>
            <ArrowBackIcon />
            Back to Fleet Dashboard
          </div>
          <div className={classes.breadcrumb}>
            <span className={classes.previous} onClick={() => { setIsDetails(false); setSelectedVin(null); }}>
              my fleet {<ArrowForwardIosIcon style={{ margin: "0 10px" }} />}
            </span>{" "}
            vin {selectedVehicleDetails.device.vin}
          </div>
          <DeviceDetails vehicleDetails={selectedVehicleDetails} />
        </div>
      ) : (
        <div>
          <div className={classes.filtersContainer}>
            <ErrorBoundary error ={error}>
              <React.Suspense fallback={<div />}>
                <div>
                </div>
                <StartSimulationNNewFleet />
                <CreateNewFleetModal />
                <SimulationFleetModal />
              </React.Suspense>
            </ErrorBoundary>
          </div>
          <div className={classes.headerContainer}>
            {selectedVin === null ? (
              <Header
                title={isCampaignSelected ? null : <div className={classes.subHeader}><SelectFleet fleets={fleets} selectedFleet={selectedFleet} handleSetSelectedFleet={handleSetSelectedFleet} /></div>}
                lastUpdated={lastUpdatedTime}
                vehiclesCount={isCampaignSelected ? totalCampaignVehicleCount : totalFleetVehicleCount}
                actionButtonComponent={<><SelectCampaign campaigns={campaigns} selectedCampign={selectedCampign} handleSetSelectedCampaign={handleSetSelectedCampaign} switchToFleetView={switchToFleetView} /> <ActionButtons /> <AddNewVehicleModal /> </>}
              />
            ) : null}
            {selectedVin === null ? (
              <TablesContainer  data={isCampaignSelected ? vehiclesCampaignWise : vehicles} fleetName={selectedFleet} campaignName={selectedCampign} handleSelectedVehicle={handleSelectedVehicle} totalVehicleCount={isCampaignSelected ? totalCampaignVehicleCount : totalFleetVehicleCount} handleToast={handleToast} isCampaignSelected={isCampaignSelected} startPollingForVehicleSimulation={startPollingForVehicleSimulation}
                paginationState={paginationState}
                handleChangePaginationState={handleChangePaginationState} />
            ) : (
              null
            )}
          </div>
          <ShowToastMessage />
        </div>
      ) : loading ? <div style={{ background: "#66000000", display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div> : <ErrorBoundary error ={error} />}
    </>
  );
};


const mapDispatchToProps = (dispatch) => ({
  updateFleetListData: (payload) => dispatch(setFleetListData(payload)),
});


export default connect(null, mapDispatchToProps)(Dashboard);

const useStyles = makeStyles((theme) => ({
  filtersContainer: {
    background: white,
    flex: `0 0 ${filtersBar.height}`,
    padding: "0 2rem",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "nowrap",
    whiteSpace: "nowrap",
    flexDirection: "row",
    alignItems: "center",
    height: 46,
  },
  headerContainer: {
    marginLeft: "2rem",
    marginRight: "2rem",
  },
  vehicleDetails: {
    padding: '1rem 2rem 2rem 2rem',
    backgroundColor: white,
    height: "100%",
    display: "flex",
    flexDirection: "column",
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
  breadcrumb: {
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 32,
    color: darkNavyText,
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
  },
  previous: {
    display: "flex",
    alignItems: "center",
    color: "#BBC0C1",
    cursor: "pointer",
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
  subHeader: {
    display: "flex",
    justifyContent: "space-between", /* Adjust as needed */
    marginTop: "1rem",
  }
}));
