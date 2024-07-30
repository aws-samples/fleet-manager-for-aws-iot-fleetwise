import React, { useState, useEffect } from 'react';
import Map, { NavigationControl, Marker, Layer, Source } from "react-map-gl/maplibre";
import { LocationClient } from "@aws-sdk/client-location";
import { CognitoIdentity } from "@aws-sdk/client-cognito-identity";
import { ROUTE_MAP_NAME, REGION, CALCULATOR_NAME, IDENTITY_POOL_ID } from 'assets/appConfig';
import { mediumBlue } from "assets/colors";
import WarningIcon from "assets/img/warning_icon.png";
import VehicleIcon from "assets/img/vehicle_icon.svg";

import { connect } from "react-redux";
import { setSelectedVehicleData } from "actions/dataActions";
import { withIdentityPoolId } from '@aws/amazon-location-utilities-auth-helper';

const RouteMap = ({ selectedVehicleData }) => {

  const [authHelper, setAuthHelper] = useState(null)

  const getAuthHelper =async () => {
    const authHelper = await withIdentityPoolId(REGION + ':' + IDENTITY_POOL_ID)
    setAuthHelper(authHelper)
  }

  useEffect(()=>{
   getAuthHelper()
  },[])

  const fromCoordinates = selectedVehicleData?.fromCoordinates !== undefined ? selectedVehicleData?.fromCoordinates : {
    "Latitude": "33.946462",
    "Longitude": "-118.384497"
  }
  const toCoordinates = selectedVehicleData?.toCoordinates !== undefined ? selectedVehicleData?.toCoordinates : {
    "Latitude": "34.041878000853",
    "Longitude": "-118.257006983392"
  }
  const [vehiclePosition, setVehiclePosition] = useState({
    "Latitude":fromCoordinates.Latitude,
    "Longitude":fromCoordinates.Longitude,
    "bearing":0
  })


  const [viewport, setViewport] = useState({
    latitude: fromCoordinates.Latitude,
    longitude: fromCoordinates.Longitude,
    zoom: 10
  });
  useEffect(()=>{
   if(!selectedVehicleData)return
   if(selectedVehicleData.fromCoordinates && selectedVehicleData.fromCoordinates.Latitude && selectedVehicleData.fromCoordinates.Longitude) {
     setViewport({
      latitude: selectedVehicleData.fromCoordinates.Latitude,
      longitude: selectedVehicleData.fromCoordinates.Longitude,
      zoom: 10
     })
   }
  },[selectedVehicleData?.fromCoordinates])

  const [route, setRoute] = useState(null);
  function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
  
  function radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
  }
  function calculateBearing(startLat, startLng, destLat, destLng) {
    const lat1 = degreesToRadians(startLat);
    const lon1 = degreesToRadians(startLng);
    const lat2 = degreesToRadians(destLat);
    const lon2 = degreesToRadians(destLng);
  
    const dLon = lon2 - lon1;
  
    const x = Math.sin(dLon) * Math.cos(lat2);
    const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  
    const bearing = radiansToDegrees(Math.atan2(x, y));
  
    return (bearing + 360) % 360; // Normalize to 0-360
  }
  
  
  

  const startMovement = (data) => {
    for (let i = 0; i < data.length; i++) {
      const longitude = data[i][0]
      const latitude = data[i][1]
      const bearing = calculateBearing(vehiclePosition.Latitude, vehiclePosition.Longitude, latitude, longitude)
      setTimeout(() => {
        setVehiclePosition({
          "Latitude":latitude,
          "Longitude":longitude,
          "bearing":bearing
        })    
      }, 100 *(i+1));
      
  }
  }


  useEffect(() => {
    
    const fetchRoute = async () => {

      const credentials = new CognitoIdentity({
        IdentityPoolId: IDENTITY_POOL_ID 
       });

       const locationService = new LocationClient({
         credentials
     });

      const params = {
        CalculatorName: CALCULATOR_NAME,
        DeparturePosition: [fromCoordinates.Longitude, fromCoordinates.Latitude], // Longitude first, Latitude second
        DestinationPosition: [toCoordinates.Longitude, toCoordinates.Latitude], // Longitude first, Latitude second
        IncludeLegGeometry: true
      };

      try {
        const { Legs } = await locationService.calculateRoute(params).promise();
        let { Geometry } = Legs[0];
        setRoute({
          "type": "FeatureCollection",
          "features": [
            {
              "type": "Feature",
              "properties": {},
              "geometry": {
                "type": "LineString",
                "coordinates": Geometry.LineString
              }
            }
          ]
        })
        const newLat = selectedVehicleData?.geoLocation.Latitude
        const newLong = selectedVehicleData?.geoLocation.Longitude
      //  const bearing = calculateBearing(vehiclePosition.Latitude, vehiclePosition.Longitude, newLat, newLong)
      if(newLat && newLong) {
        setVehiclePosition({
          "Latitude":newLat,
          "Longitude":newLong,
          "bearing":0
        })
      } 
      } catch (error) {
      }
    };
    if(authHelper) {
      fetchRoute();
    }

  }, [selectedVehicleData,authHelper]);
  const layerStyle = {
    id: 'route',
    type: 'line',
    paint: {
      'line-color': mediumBlue,
      'line-width': 4
    }
  };
  return (
    <>
    {
      authHelper?(
        <Map
        initialViewState={{
          container: "map"
        }}
        {...viewport}
        mapStyle={`https://maps.geo.${REGION}.amazonaws.com/maps/v0/maps/${ROUTE_MAP_NAME}/style-descriptor`}{...authHelper.getMapAuthenticationOptions()}
        onMove={e => setViewport(e.viewState)}
        style={{ height: "100%", width: "100%" }}
      >
        <NavigationControl position="top-right" showCompass={false} />
        {route && (selectedVehicleData?.simulationStatus === 'RUNNING' || selectedVehicleData?.simulationStatus === 'HEALTHY') && (
          <Source id="route-data" type="geojson" data={route}>
            <Layer {...layerStyle} />

            <Marker longitude={route.features[0].geometry.coordinates[10][0]} latitude={route.features[0].geometry.coordinates[10][1]}  >
              <div >
                <img src={WarningIcon} width="25px" height="25px" />
              </div>
            </Marker>
            <Marker longitude={vehiclePosition.Longitude} latitude={vehiclePosition.Latitude}>
              <div>
                <img src={VehicleIcon} width="20px" height="20px" />
              </div>
            </Marker>
          </Source>
        )}
      </Map>
      ):null
    }
      
    </>
  );
};


const mapStateToProps = (state) => {
  const {
    data: { selectedVehicleData },
  } = state;
  return { selectedVehicleData };
};

const mapDispatchToProps = (dispatch) => ({
  setSelectedVehicle: (vehicleData) => dispatch(setSelectedVehicleData(vehicleData, { fromVehicleList: true })),
});

export default connect(mapStateToProps, mapDispatchToProps)(RouteMap);
