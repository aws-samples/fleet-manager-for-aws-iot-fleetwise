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
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import VehiclesList from "components/vehicles/VehiclesList";
import ErrorBoundary from "components/global/ErrorBoundary";
import {  white, dividerShadowColor, mediumBlue } from "assets/colors";

const SingleVehiclePanel = React.lazy(() => import("components/vehicles/SingleVehiclePanel"));

const RightSidebar = ({
  singleVehicleView
}) => {
  const classes = useStyles();

  
  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <ErrorBoundary>
          <React.Suspense fallback={<div />}>
            {singleVehicleView ? <SingleVehiclePanel /> : null}
          </React.Suspense>
          <VehiclesList />
        </ErrorBoundary>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const {
    views: { singleVehicleView }
  } = state;
  return {
    singleVehicleView,
  };
};


export default connect(mapStateToProps, null)(RightSidebar);

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    overflowY: "auto",
    backgroundColor: white,
  },
  content: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    position: "relative",
  },
  actionBar: {
    flex: "0 0 4.69rem",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    zIndex: 1,
    boxShadow: `0 -0.1rem 0.25rem ${dividerShadowColor}`,
  },
  scheduleOtaBtn: {
    display: "inline-block",
    height: "2.72rem",
    lineHeight: "2.72rem",
    padding: "0 1.31rem",
    borderRadius: "0.33rem",
    fontSize: "0.94rem",
    fontWeight: 500,
    backgroundColor: mediumBlue,
    color: white,
    "&:hover": {
      cursor: "pointer",
    },
  },
  disabled: {
    opacity: "0.4",
    "&:hover": {
      cursor: "not-allowed",
    },
  },
}));
