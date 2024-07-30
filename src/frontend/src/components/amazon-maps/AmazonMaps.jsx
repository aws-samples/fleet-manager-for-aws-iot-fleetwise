import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";

import Map, { NavigationControl, Layer, Source, useMap } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import {  setSelectedVehicleData } from "actions/dataActions";
import { setSingleVehicleViewOpen } from "actions/viewActions";
import { LOCATION_MAP_NAME, REGION, IDENTITY_POOL_ID } from 'assets/appConfig';
import { withIdentityPoolId } from '@aws/amazon-location-utilities-auth-helper';

// Displays clusters and single pin from GeoJSON data.
const ClustersFeature = ({ vehicles = [] }) => {
  // Properties for clusters layer when zoomed out
  const clustersLayer = {
    id: "clusters",
    type: "circle",
    source: "clusters-source",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": ["step", ["get", "point_count"], "#51bbd6", 100, "#f1f075", 750, "#f28cb1"],
      "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
    },
  };

  //! Properties for cluster count. Currently NOT working
  const clusterCountLayer = {
    id: "cluster-count",
    type: "symbol",
    source: "clusters-source",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
  };

  // Properties for points layer when zoomed in
  const pointsLayer = {
    id: "points",
    type: "circle",
    source: "clusters-source",
    filter: ["!", ["has", "point_count"]],

    paint: {
      "circle-color": ["match", ["get", "status"], "active", "#B5D6F4", "inactive", "#D1D5DB", "#EB6F6F"],
      "circle-radius": 8,
      "circle-stroke-width": 2,
      "circle-stroke-color": ["match", ["get", "status"], "active", "#539FE5", "inactive", "#7D8998", "#D91515"],
    },
  };

  const CLUSTER_DATA = {
    type: "FeatureCollection",
    crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    features: vehicles,
  };


  return (
    <>
      <Source
        id="clusters-source"
        type="geojson"
        data={CLUSTER_DATA}
        cluster={true}
        clusterMaxZoom={14}
        clusterRadius={50}
        clusterProperties={{ total_count: ["+", ["get", "count"]] }}
      >
        <Layer {...clustersLayer} />
        {/* <Layer {...clusterCountLayer} /> */}
        <Layer {...pointsLayer} />
      </Source>
    </>
  );
};

const FlyToFragment = ({vehicles}) => {
  const { current: map } = useMap();

  useEffect(() => {
    if (vehicles?.length===0) return;
    let Longitude = vehicles[0].coordinates[0];
    let Latitude = vehicles[0].coordinates[1];

    map.flyTo({ center: [Longitude, Latitude], zoom: 15 });
  }, [map, vehicles]);
  return <></>;
};

 function AmazonMaps({ vehicles, selectedVehicleData, setSelectedVehicle, openSingleVehicleView }) {
const [authHelper, setAuthHelper] = useState(null)
  const [viewport, setViewport] = useState({
    latitude: 37.8,
    longitude: -100.4,
    zoom: 3.8
  });
  const getAuthHelper =async () => {
    const authHelper = await withIdentityPoolId(REGION + ':' + IDENTITY_POOL_ID)
    setAuthHelper(authHelper)

  }
  useEffect(()=>{
   getAuthHelper()
  },[])

  useEffect(()=>{
    if (vehicles?.length===0) return;
    let Longitude = -100.4
    let Latitude = 37.8
    if(vehicles[0].coordinates[0] && vehicles[0].coordinates[1]) {
      Longitude = vehicles[0].coordinates[0]
      Latitude = vehicles[0].coordinates[1]
    } else if(vehicles.length == 2 && vehicles[1].coordinates[0] && vehicles[1].coordinates[1]) {
      Longitude = vehicles[1].coordinates[0]
      Latitude = vehicles[1].coordinates[1]
    }

    setViewport({
      latitude: Latitude,
      longitude: Longitude,
      zoom: 3.8
    });
  },[vehicles])


  const transformVehicles = vehicles.map(({ coordinates: [longitude, latitude], properties: { vin } }) => {
    return {
      longitude,
      latitude,
      title: vin,
      address: vin,
    };
  });

  const transformVehicleDataForCluster = ()=> {
    const newVehicles = vehicles.filter(({ coordinates: [longitude, latitude]})=>{
      return longitude && latitude
    })
    return newVehicles.map(({ coordinates: [longitude, latitude], properties }) => {
    return {
      type: "Feature",
      properties,
      geometry: { type: "Point", coordinates: [longitude, latitude] },
    };
  });
}

  // Pass data that is needed for the popup to be displayed when an unclustered point is clicked
  const handleClick = (e) => {
    e.originalEvent.stopPropagation();
    const feature = e.features && e.features[0];

    // Checking for click events on unclustered points
    if (feature?.layer?.id === "points") {
      const vehicleObj = {
        coordinates: [feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
        properties: feature.properties,
      };
      setSelectedVehicle(vehicleObj);
      openSingleVehicleView();
    }
  };

  return (
    <> {
      authHelper?(
        <Map
        initialViewState={{
          container: "map", // HTML element ID of map element
          longitude: (vehicles && vehicles.length!==0)?vehicles[0].coordinates[0]: -100.4,
          latitude: (vehicles && vehicles.length!==0)?vehicles[0].coordinates[1] : 37.8,
          zoom: 3.8,
          boxZoom: true,
        }}
        {...viewport}
        onMove={e => setViewport(e.viewState)}
        style={{ height: "100%", width: "100%" }}
        mapStyle={`https://maps.geo.${REGION}.amazonaws.com/maps/v0/maps/${LOCATION_MAP_NAME}/style-descriptor`}{...authHelper.getMapAuthenticationOptions()}
        interactiveLayerIds={["points", "clusters", "cluster-count"]} // 'points' layer from clusters to have a pointer cursor when hovered
        onClick={handleClick}
      >
        <NavigationControl position="top-right" showZoom showCompass={false} />
        <ClustersFeature vehicles={transformVehicleDataForCluster()} />
        {/* <FlyToFragment vehicles={vehicles} /> */}
      </Map>
      ):null
    }
      
    </>
  );
}

//Create mapDispatch
const mapDispatch = (dispatch) => ({
  openSingleVehicleView: () => dispatch(setSingleVehicleViewOpen()),
  setSelectedVehicle: (vehicleData) => dispatch(setSelectedVehicleData(vehicleData, { fromVehicleList: true })),
});

//Create mapState
const mapState = (state) => {
  const {
    data: {
      vehicleList: { vehicles },
      selectedVehicleData,
    },
  } = state;
  return {
    vehicles,
    selectedVehicleData,
  };
};

export default connect(mapState, mapDispatch)(AmazonMaps);
