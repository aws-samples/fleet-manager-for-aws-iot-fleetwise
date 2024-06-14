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


const Header = ({ title, lastUpdated, actionButtonComponent = null, vehiclesCount }) => {
  const classes = useStyles();


  return (
    <div className={classes.headerInnerContainer}>
      <div>
        <h1 className={classes.title}>{title!==-1?title:""}</h1>
        <p className={classes.vehicleTotal}>{vehiclesCount} vehicles</p>
        <p className={classes.lastUpdated}>Last updated: {lastUpdated}</p>
      </div>
      <div className={classes.actionButtons}>{actionButtonComponent !== null && actionButtonComponent}</div>
    </div>
  );
};


Header.propTypes = {
  title: PropTypes.string.isRequired,
  dashboardData: PropTypes.object.isRequired,
};

export default Header;

const useStyles = makeStyles((theme) => ({
  headerInnerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 5,
    marginTop: 10,
    textTransform: "uppercase",
  },
  vehicleTotal: {
    margin: "0 0 5px 0",
  },
  lastUpdated: {
    margin: "0 0 16px 0",
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  }
}));
