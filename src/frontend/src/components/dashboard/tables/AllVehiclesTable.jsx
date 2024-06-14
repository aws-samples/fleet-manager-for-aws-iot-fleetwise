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

import MUIDataTable from "mui-datatables";
import React, { useState } from "react";

import CustomHeaderPlayIcon from "./custom/CustomHeaderPlayIcon";
import CustomBodyPlayOrStopIcon from "./custom/CustomBodyPlayOrStopIcon";
import CustomHeaderTextWithImage from "./custom/CustomHeaderTextWithImage";

import CustomTitle from "./custom/CustomTitle";
import CustomTablePagination from "./custom/CustomTablePagination";
import Loading from "./custom/Loader";

const AllVehiclesTable = ({
  data,
  fleetName,
  handleSelectedVehicle,
  totalVehicleCount,
  handleToast,
  isCampaignSelected,
  campaignName,
  startPollingForVehicleSimulation,
  paginationState,
  handleChangePaginationState
}) => {

  const [loading, setLoading] = useState(false)
  const [sort, setSort] = useState(false)
  const handleLoading = (loading) => { setLoading(loading) }
  const handleSort = () => {
    setSort(true)
  }

  
  const vehiclesColumns = [
    {
      name: "simulationStatus",
      label:"Simulation Status",
      options: {
        customHeadRender: () => {
          return (
            <CustomHeaderPlayIcon />
          );
        },
        customBodyRender: (value, tableMeta) => {
          const index = tableMeta.currentTableData[tableMeta.rowIndex].index;
          return (
            <CustomBodyPlayOrStopIcon handleLoading={handleLoading} simulationStatus={data[index].simulationStatus} vehicleName={data[index].vehicleName} handleToast={handleToast} startPollingForVehicleSimulation={startPollingForVehicleSimulation} />
          );
        },
      },
    },
    {
      name: "vin",
      label:"VIN",
      options: {
        sort: sort ? true : false,
        customHeadRender: () => {
          return (
            <CustomHeaderTextWithImage isCampaignSelected={isCampaignSelected} handleSort={handleSort} />
          );
        },
        customBodyRender: (value, tableMeta) => {
          const index = tableMeta.currentTableData[tableMeta.rowIndex].index;
          return (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => handleSelectedVehicle(data[index].vehicleName)}
            >
              {value}
            </div>
          );
        }
      }
    },
    {
      name: "year",
      label: "YEAR",
    },
    {
      name: "make",
      label: "MAKE",
    },
    {
      name: "model",
      label: "MODEL",
    },
    {
      name: "mileage",
      label: "MILEAGE",
    },
    {
      name: "license",
      label: "LICENSE PLATE",
    }
  ]
  const vehiclesColumnsBasedOnCampaign = [
    {
      name: "simulationStatus",
      label:"Simulation Status",
      options: {
        customHeadRender: () => {
          return (
            <CustomHeaderPlayIcon />
          );
        },
        customBodyRender: (value, tableMeta) => {
          const index = tableMeta.currentTableData[tableMeta.rowIndex].index;
          return (
            <CustomBodyPlayOrStopIcon handleLoading={handleLoading} simulationStatus={data[index].simulationStatus} vehicleName={data[index].vehicleName} handleToast={handleToast} startPollingForVehicleSimulation={startPollingForVehicleSimulation} />
          );
        },
      },
    },
    {
      name: "vin",
      label:"VIN",
      options: {
        sort: sort ? true : false,
        customHeadRender: () => {
          return (
            <CustomHeaderTextWithImage isCampaignSelected={isCampaignSelected} handleSort={handleSort} />
          );
        },
        customBodyRender: (value, tableMeta) => {
          const index = tableMeta.currentTableData[tableMeta.rowIndex].index;

          return (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => handleSelectedVehicle(data[index].vehicleName)}
            >
              {value}
            </div>
          );
        }
      }
    },
    {
      name: "RightFrontTirePressure",
      label: "TIRE PRESSURE FR",
    },
    {
      label: "TIRE PRESSURE FL",
      name: "LeftFrontTirePressure",
    },
    {
      label: "TIRE PRESSURE RR",
      name: "RightRearTirePressure",
    },
    {
      name: "LeftRearTirePressure",
      label: "TIRE PRESSURE RL",
    },
    {
      name: "MaxCellVoltage",
      label: "Max Cell Voltage",
    },
    {
      name: "BatteryDCVoltage",
      label: "Battery DC Voltage",
    },
    {
      name: "OutsideAirTemperature",
      label: "Outside Air Temperature",
    },
    {
      name: "MinCellVoltage",
      label: "Min Cell Voltage",
    },
    {
      name: "InCabinTemperature",
      label: "InCabin Temperature",
    },
    {
      name: "BatteryCurrent",
      label: "Battery Current",
    },
    {
      name: "IsCharging",
      label: "Is Charging",
    },
    {
      name: "MaxTemperature",
      label: "Max Temperature",
    },
    {
      name: "MinTemperature",
      label: "Min Temperature",
    },
    {
      name: "BatteryAvailableChargePower",
      label: "Battery Available Charge Power",
    },
    {
      name: "hasActiveDTC",
      label: "has Active DTC",
    },
    {
      name: "BatteryAvailableDischargePower",
      label: "Battery Available Discharge Power",
    },
    {
      name: "TotalOperatingTime",
      label: "Total Operating Time",
    },
    {
      name: "Speed",
      label: "Speed",
    },
    {
      name: "StateOfHealth",
      label: "State Of Health",
    },
    {
      name: "FanRunning",
      label: "Fan Running",
    },
    {
      name: "Current",
      label: "Current",
    },
    {
      name: "RightFrontTireTemperature",
      label: "Tire Temperature FR",
    },
    {
      name: "RightRearTireTemperature",
      label: "Tire Temperature RR",
    },
    {
      name: "LeftFrontTireTemperature",
      label: "Tire Temperature FL",
    },
    {
      name: "LeftRearTireTemperature",
      label: "Tire Temperature RL",
    },
  ]
  const vehiclesOptions = {
    pagination: true,
    page: isCampaignSelected ? paginationState.campaignTable.selectedPage : paginationState.fleetTable.selectedPage,
    count: data.length,
    paginationComponent: 'bottom',
    rowsPerPage: isCampaignSelected ? paginationState.campaignTable.rowsPerPage : paginationState.fleetTable.rowsPerPage, // Number of rows per page
    rowsPerPageOptions: [], // Rows per page options
    selectableRows: "none",
    search: false,
    sort: sort ? true : false,
    sortOrder: sort ? {
      name: 'vin',
      direction: 'asc'
    } : {},
    print: false,
    download: false,
    viewColumns: true,
    filter: false,
    serverSide: false,
    fixedHeader: true,
    responsive: "standard",
    enableNestedDataAccess: ".",

    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => {
      return (
        <CustomTablePagination
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          onChangeRowsPerPage={(event) => {
            const rowsPerPage = event.target.value
            changeRowsPerPage(rowsPerPage)
            {
              isCampaignSelected ? handleChangePaginationState({ ...paginationState, "campaignTable": { ...paginationState.campaignTable, rowsPerPage } }) :
                handleChangePaginationState({ ...paginationState, "fleetTable": { ...paginationState.fleetTable, rowsPerPage } })
            }

          }}
          onChangePage={(_, page) => {
            changePage(page)
            {
              isCampaignSelected ? handleChangePaginationState({ ...paginationState, "campaignTable": { ...paginationState.campaignTable, "selectedPage": page } }) :
                handleChangePaginationState({ ...paginationState, "fleetTable": { ...paginationState.fleetTable, "selectedPage": page } })
            }
          }
          }
        />
      );
    },
  };


  return (
    <>
      <MUIDataTable

        title={
          <CustomTitle
            state={{ "isLoading": false }}
            vehicleCount={totalVehicleCount}
            title={isCampaignSelected ? campaignName : fleetName}
          />
        }
        columns={isCampaignSelected ? vehiclesColumnsBasedOnCampaign : vehiclesColumns}
        data={data}
        options={vehiclesOptions}
      >
      </MUIDataTable>
      {loading ?
        <Loading /> : null}
    </>
  )

}

export default AllVehiclesTable;