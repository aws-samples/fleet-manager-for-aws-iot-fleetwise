// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useEffect, useState } from "react";
import { Marker } from "react-map-gl/maplibre";

// Customized popup that displays locker titles and descriptions

// A pushpin icon that changes color when selected
import PinIcon from "./PinIcon";

// Displays a single marker with interaction and a custom icon
const VehicleMarker = ({ vehicle, SelectVehicle, onVehicleSelect }) => (
  // Render a react-map-gl Marker with a click handler that passes data back to its parent
  // See https://visgl.github.io/react-map-gl/docs/api-reference/marker
  <Marker
    latitude={vehicle.latitude}
    longitude={vehicle.longitude}
    onClick={(e) => {
      e.originalEvent.stopPropagation();
      onVehicleSelect(vehicle);
    }}
  >
    <PinIcon size={35} isSelected={vehicle === SelectVehicle} />
  </Marker>
);

// Render markers for all lockers, with a popup for the selected locker
export default ({ vehicles }) => {
  const [SelectVehicle, setSelectVehicle] = useState();


  return (
    <>
      {
        // Render markers for all vehicles
        vehicles.map((vehicle, index) => (
          <VehicleMarker
            key={index}
            vehicle={vehicle}
            SelectVehicle={SelectVehicle}
            onVehicleSelect={setSelectVehicle}
          />
        ))
      }
    </>
  );
};
