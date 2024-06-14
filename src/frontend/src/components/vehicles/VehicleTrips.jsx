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
import React, { useEffect } from "react";
import { connect } from "react-redux";
import clsx from "clsx";
import _get from "lodash.get";
import { FixedSizeList } from "react-window";
import VirtualListCustomScrollbar from "components/global/VirtualListCustomScrollbar";
import { getVehicleTrips } from "apis/vehicles";
import { makeStyles } from "@material-ui/core/styles";
import { darkNavyText, white, grayVehicleBg, mediumBlue, darkGray } from "assets/colors";
import { useState } from "react";
import { CircularProgress, Tooltip } from "@material-ui/core";

const VehicleTrips = ({
  selectedVehicleData
}) => {
  const classes = useStyles();
  
  const [trips, setTrips] = useState([])
  const [dataLoaded, setDataLoaded] = useState(false)
  const [dataLoading, setDataLoading] = useState(false)
  const [selectedTripIdx, setSelectedTripIdx] = React.useState(null);
  const outerRef = React.useRef();
  const [error, setError] = useState('')

  const getTrips = async () => {
    setError('')
    setDataLoading(true)
    try {

      const trips = await getVehicleTrips(selectedVehicleData?.vehicleName)
      if(trips.body) {
        let error = trips.body
        error = error.toString()
        error = error.replace(/["']/g, "");
        setError(error)
        setDataLoading(false)
        return
      }
      setTrips(trips)
      setDataLoaded(true)

    } catch (err) {
      setError(err.toString())
    } finally {
      setDataLoading(false)
    }
  }
  useEffect(() => {
    getTrips()
  }, [])

  const truncate = (str) => {
    return str.length > 14 ? str.substring(0, 13) + "..." : str;
  }

  const TripRow = React.memo(({ index, style }) => {
    const notLoaded = !dataLoaded;
    const trip = trips[index] || {};
    const { date, start, stop, distance,duration } = trip;
    const isSelected = index === selectedTripIdx;
    const isEven = (index + 1) % 2 === 0;
    return (
      <div
        className={clsx(classes.tripRow, {
          [classes.evenTripRow]: isEven,
          [classes.selectedTripRow]: isSelected,
          [classes.loadingRow]: notLoaded,
          // [classes.tripRowHover]: !notLoaded
        })}
        key={index}
        style={style}
        onClick={notLoaded ? () => null : {}}
      >
        {notLoaded ? (
          "Loading..."
        ) : (
          <>
            <div className={classes.date}>
              {date}
            </div>
            <Tooltip title={start}>
              <div className={classes.start}>
                {truncate(start+"")}
              </div>
            </Tooltip>
            <Tooltip title={stop}>
              <div className={classes.end}>
                {truncate(stop+"")}
              </div>
            </Tooltip>
            <div className={classes.distance}>
              {distance}
            </div>
            <div className={classes.distance}>
              {duration}
            </div>
          </>
        )}
      </div>
    );
  });
  const Loader = () => {
    if (dataLoading) {
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
  if (dataLoading) return <div style={{ textAlign: "center" }}>Loading...</div>;
  if (!dataLoading && !trips?.length)
    return <div style={{ textAlign: "center" }}>{error?error:"No trip history"}</div>;

  return (
    <div className={classes.container}>
      <div className={classes.headerBar}>
        <div className={classes.date}>DATE</div>
        <div className={classes.start}>START LOCATION</div>
        <div className={classes.end}>END LOCATION</div>
        <div className={classes.distance}>MILES</div>
        <div className={classes.distance}>DURATION</div>

      </div>
      <div className={classes.tripsContainer}>
        {/* <AutoSizer>
          {({ height, width }) => ( */}
        <FixedSizeList
          className={classes.list}
          height={300}
          itemCount={trips?.length}
          itemSize={35}
          width={"100%"}
          outerElementType={VirtualListCustomScrollbar}
          outerRef={outerRef}
        >
          {TripRow}
        </FixedSizeList>
        {/* //   )}
        // </AutoSizer> */}
        {/*  */}
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  const {
    data: { selectedVehicleData },

  } = state;
  return { selectedVehicleData };
};

export default connect(mapStateToProps, null)(VehicleTrips);

const highlightedTripRow = {
  backgroundColor: mediumBlue,
  color: white
};

const useStyles = makeStyles(() => ({
  container: {
    fontSize: "0.75rem",
    color: darkGray,
    backgroundColor: white,
    display: "flex",
    flexDirection: "column"
  },
  headerBar: {
    padding: "0 1rem",

    height: "2.16rem",
    backgroundColor: darkGray,
    color: white,
    fontSize: "0.61rem",
    display: "flex",
    alignItems: "center",
    fontWeight: "bold",
  },
  tripsContainer: {
    height: "100%",
  },
  tripRow: {
    padding: "0 1rem",
    display: "flex",
    alignItems: "center",
    height: "2.16rem",
    color: darkNavyText
  },
  tripRowHover: {
    "&:hover": {
      ...highlightedTripRow,
      cursor: "pointer"
    }
  },
  evenTripRow: {
    backgroundColor: grayVehicleBg
  },
  selectedTripRow: highlightedTripRow,
  loadingRow: {
    justifyContent: "center"
  },
  date: {
    flex: 1.8
  },
  start: {
    flex: 2.16,
    "&:hover": {
      cursor: "pointer"
    }
  },

  end: {
    flex: 2.16,
    "&:hover": {
      cursor: "pointer"
    }
  },
  distance: {
    flex: 1
  }
}));
