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
import React, { useRef, memo, useEffect } from "react";
import { connect } from "react-redux";
import clsx from "clsx";
import _get from "lodash.get";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import VirtualListCustomScrollbar from "components/global/VirtualListCustomScrollbar";
import { makeStyles } from "@material-ui/core/styles";
import { setSingleVehicleViewOpen } from "actions/viewActions";
import { setSelectedVehicleData,initializeVehicleList } from "actions/dataActions";
import { addCommasToNumber } from "utils/helpers";
import {  veryLightGray, lightGray, darkBlue, blueGraphite, gentleBlue, white } from "assets/colors";
import RightArrowBlack from "assets/img/right-arrow-black.svg";
import SelectFleet from "components/dashboard/fleets/SelectFleet";
import { getTelemetryDetails, getVehiclesByFleetName, getTelemetryDetailsByFleetName } from "apis/vehicles";
import { CircularProgress } from "@material-ui/core";
import { setVehicleListCount } from "actions/mapDataActions";
import { AGGREGATE_VEHICLES_DATA } from "data/testData";
import ErrorBoundary from "components/global/ErrorBoundary";

const VehiclesList = ({
  setSelectedVehicle,
  openSingleVehicleView,
  items,
  updateVehicleListCount,
  selectedVehicle,
  setAllVehicles,

}) => {
  const classes = useStyles();
  const outerRef = useRef();

  const [selectedFleet, setSelectedFeet] = React.useState(items[0].id)
  const [totalVehicleCount, setTotalVehicleCount] = React.useState('')
  const [dataLoaded, setDataLoaded] = React.useState(false)
  const [loading, setLoading] = React.useState(true);
  const [vehicles, setVehicles] = React.useState([]);
  const [error , setError] = React.useState('')

  const [selectedVehicleDetails, setSelectedVehicleDetails] = React.useState({})

  const handleSetSelectedFleet = (fleet) => {
    setSelectedFeet(fleet)

  }

  useEffect(() => {
    getVehicles(selectedFleet);
  }, [selectedFleet]);

  useEffect(() => {
    if (vehicles && selectedVehicle) {
      const newList = vehicles.map((item) => {
        if (item.vehicleName === selectedVehicle.vehicleName) {
          const updatedItem = {
            ...item,
            simulationStatus: selectedVehicle.simulationStatus,
          };
          return updatedItem;
        }
        return item;
      });
      setVehicles(newList);
    }
  }, [selectedVehicle])

  const dummyGeoLocation = (index) => {
    return {
      "Longitude": AGGREGATE_VEHICLES_DATA.vehicles[index].geoLocation.coordinates[0],
      "Latitude": AGGREGATE_VEHICLES_DATA.vehicles[index].geoLocation.coordinates[1]
    }
  }

  const getVehicles = async (fleet) => {
    try {
      setError('')
      setLoading(true)
      setDataLoaded(false)
      const vehicleList = await getTelemetryDetailsByFleetName(fleet);
      if(vehicleList.body) {
        let error = vehicleList.body
        error = error.toString()
        error = error.replace(/["']/g, "");
        setError(error)
        setLoading(false)
        return
      }
      const response = await getVehiclesByFleetName(fleet);
      if(response.body) {
        let error = response.body
        error = error.toString()
        error = error.replace(/["']/g, "");
        setError(error)
        setLoading(false)
        return
      }
      const totalVehiclesCount = response.totalCount
      setTotalVehicleCount(totalVehiclesCount)
      updateVehicleListCount(totalVehiclesCount);
      const newVehicles = []
      for (let i = 0; i < vehicleList.length; i++) {

        const vehicle = vehicleList[i];
        const attributes = vehicle.device
        let geoLocation = vehicle.geoLocation
        if (attributes !== undefined) {

          newVehicles.push({
            "mileage": "-",
            "license": attributes.license !== undefined ? attributes.length : "-",
            "make": attributes.make !== undefined ? attributes.make : "-",
            "vin": attributes.vin !== undefined ? attributes.vin : "-",
            "year": attributes.year !== undefined ? attributes.year : "-",
            "model": attributes.model !== undefined ? attributes.model : "-",
            "vehicleName": vehicle.vehicle_name,
            "simulationStatus": vehicle.vehicle_simulator_status,
            "geoLocation": geoLocation
          });
        }

      }
      setVehicles(newVehicles)
      setDataLoaded(true)
      setLoading(false)
      setAllVehicles(newVehicles,totalVehiclesCount)
    } catch (err) {
      setLoading(false)
      if(err.toString().includes('status code 500')) {
        setError(err.toString())
    }
    }
  }

  const itemCount = vehicles.length;

  const setVehicleAndOpenSingleView = (vehicleObj) => () => {
    getVehicleDetails(vehicleObj);
  };

  const getVehicleDetails = async (vehicle) => {
    try {
      setError('')
      setLoading(true)
      setDataLoaded(false)
      const vehicleName = vehicle.vehicleName;
      const telemetryDetails = await getTelemetryDetails(vehicleName);
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
      setSelectedVehicle(vehicleDetails);
      openSingleVehicleView();
      setDataLoaded(true)
      setLoading(false)

    } catch (err) {
      setLoading(false)
      if(err.toString().includes('status code 500')) {
        setError(err.toString())
      }
    }
  }

  useEffect(() => { }, []);

  const VehicleRow = memo(({ index, style }) => {
  
    const vehicle = vehicles[index];
    const isEven = (index + 1) % 2 === 0;
    const swVersion = "1.1"
    const { vin, make, model, year, simulationStatus } = vehicle;
    const safeVehicleTypeLabel = `${year || ""} ${make || ""} ${model || ""}`;

    return !dataLoaded ? (
      <></>
    ) : (
      <div
        className={clsx(classes.columnsContainer, classes.flexCenter, classes.listItem, classes.hoveredArrowImg, {
          [classes.listItemEven]: isEven,
        })}
        style={style}
        onClick={setVehicleAndOpenSingleView(vehicle)}
      >
        <div className={classes.vin}>{vin}</div>
        <div className={clsx(classes.type, classes.halfOpacity)}>{safeVehicleTypeLabel}</div>
        <div className={classes.status}><div className={classes.statusVal}>{simulationStatus}</div></div>
        <div className={classes.software}>
          <span className={classes.halfOpacity}>{swVersion}</span>
        </div>
      </div>
    );
  });

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

  return (
    <div className={classes.root}>
      <div className={clsx(classes.managerBar, classes.flexCenter)}>
        <div className={clsx(classes.myFleet)}>{<SelectFleet fleets={items} selectedFleet={selectedFleet} handleSetSelectedFleet={handleSetSelectedFleet} />}</div>
        <div className={clsx(classes.fleetStats, classes.flexCenter)}>{addCommasToNumber(totalVehicleCount)} vehicles</div>
      </div>
      <div className={clsx(classes.columnsContainer, classes.flexCenter, classes.headerBar)}>
        <div className={clsx(classes.vin, classes.boldText)}>VIN</div>
        <div className={clsx(classes.type, classes.boldText)}>TYPE</div>
        <div className={clsx(classes.status, classes.boldText)}>STATUS</div>
        <div className={clsx(classes.software, classes.boldText)}>SOFTWARE</div>
        <div />
      </div>
      <div className={classes.content}>
        <Loader />
        <ErrorBoundary error = {error}>
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              className={classes.list}
              height={height}
              itemCount={itemCount}
              itemSize={35}
              width={width}
              outerElementType={VirtualListCustomScrollbar}
              outerRef={outerRef}
              itemKey={(index) => index}
            >
              {VehicleRow}
            </FixedSizeList>
          )}
        </AutoSizer>
        </ErrorBoundary>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const {
    data: { selectedVehicleData },
    fleetData: { items }
  } = state;
  return {
    items,
    selectedVehicle: selectedVehicleData
  };
};

const mapDispatchToProps = (dispatch) => ({
  setAllVehicles: (vehicles, vehicleCount) => dispatch(initializeVehicleList({ vehicles, vehicleCount })),
  openSingleVehicleView: () => dispatch(setSingleVehicleViewOpen()),
  updateVehicleListCount: (num) => dispatch(setVehicleListCount(num)),
  setSelectedVehicle: (vehicleData) => dispatch(setSelectedVehicleData(vehicleData, { fromVehicleList: true })),
});

export default connect(mapStateToProps, mapDispatchToProps)(VehiclesList);

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    overflowY: "auto",
  },
  flexCenter: {
    display: "flex",
    alignItems: "center",
  },
  columnsContainer: {
    padding: "0 1.31rem",
  },
  vin: {
    flex: 2.6,
    overflow: "hidden",
    textTransform: "uppercase",
  },
  type: {
    flex: 2.57,
  },
  status: {
    flex: 2,
  },
  statusVal: {
    display: "inline",
    backgroundColor: gentleBlue,
    color: white,
    padding: "0.2rem",
    borderRadius: "0.33rem",
    fontSize: "0.61rem",
  },
  software: {
    flex: 1,
  },
  headerBar: {
    flex: "0 0 1.69rem",
    backgroundColor: blueGraphite,
    // opacity: 0.5,
    color: "white",
    paddingLeft: "1.31rem",
    fontSize: "0.61rem",
  },
  content: {
    flex: 1,
    overflow: "hidden",
  },
  list: {
    border: 0,
  },
  listItem: {
    paddingLeft: "1.31rem",
    "&:hover": {
      cursor: "pointer",
    },
    fontSize: "0.75rem",
    color: darkBlue,
    backgroundColor: veryLightGray,
  },
  listItemEven: {
    backgroundColor: lightGray,
  },
  managerBar: {
    flex: "0 0 2.25rem",
    backgroundColor: darkBlue,
    // opacity: 0.7,
    color: "white",
    padding: "0 0.5rem",
  },
  myFleet: {
    fontSize: "1.125rem",
    fontWeight: "bold",
  },
  fleetStats: {
    fontSize: "0.75rem",
    flex: 3.57,
    "& > div": {
      margin: "0 0.3rem",
    },
  },
  hoveredArrowImg: {
    "&:hover": {
      backgroundImage: `url(${RightArrowBlack})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center right 1.31rem",
      backgroundSize: "0.5rem",
    },
  },
  halfOpacity: {
    // opacity: 0.5,
  },
  boldText: {
    fontWeight: "bold",
  },
}));
