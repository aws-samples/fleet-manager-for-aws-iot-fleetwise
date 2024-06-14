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
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import AllVehiclesTable from "./AllVehiclesTable";


const TablesContainer = ({ data, fleetName, handleSelectedVehicle, totalVehicleCount, handleToast, isCampaignSelected, campaignName, startPollingForVehicleSimulation, paginationState,
  handleChangePaginationState }) => {
  const classes = useStyles();

  return (
    <div key="1" className={classes.tableContainer}>

      <AllVehiclesTable
        data={data}
        fleetName={fleetName}
        handleSelectedVehicle={handleSelectedVehicle}
        totalVehicleCount={totalVehicleCount}
        handleToast={handleToast}
        isCampaignSelected={isCampaignSelected}
        campaignName={campaignName}
        startPollingForVehicleSimulation={startPollingForVehicleSimulation}
        paginationState={paginationState}
        handleChangePaginationState={handleChangePaginationState}
      />
    </div>
  );
};

TablesContainer.propTypes = {
  setSelectedVin: PropTypes.func.isRequired,
  setDetailsType: PropTypes.func.isRequired,
};

export default TablesContainer;

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    margin: "0 10px 5px 10px",
    width: "100%",
    marginBottom: "50px"
  },
}));
