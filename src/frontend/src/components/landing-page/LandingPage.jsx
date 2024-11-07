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
import React, { Suspense, useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { useTheme, View, Image, Text, Heading, useAuthenticator, Button } from '@aws-amplify/ui-react';
//const App = React.lazy(() => import("App"));
//const LandingPage = React.lazy(() => import("components/landing-page/LandingPage"));
//import Input from "./StyledInput";
//import Submit from "./SubmitButton";
import Navbar from "components/navigation/Navbar";
import AuthorizedRoutes from "AuthorizedRoutes";
import { withStyles } from "@material-ui/core/styles";
import landingImg from "assets/img/landing_bg.jpg";
import { darkNavyText, white } from "assets/colors";
import Logo from "assets/img/aws-logo.svg";
import { makeStyles } from '@material-ui/core'



const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100%",
    width: "100%",
    background: `${darkNavyText} url(${landingImg}) center / cover no-repeat`,
    userSelect: "none"
  },
  content: {
    color: white,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 1.5rem",
    margin: "3rem 0 2rem 0",
    "& .Logo": {
      width: "4.69rem",
      marginBottom: "1.88rem"
    },
    "& .appName": {
      textAlign: "center",
      fontSize: "4.69rem",
      fontWeight: 300,
      lineHeight: "6.23rem",
      marginBottom: "2.16rem"
    },
    "& .intro": {
      fontSize: "1.69rem",
      fontWeight: 300
    },
    "& .divider": {
      opacity: 0.1,
      width: "100%",
      height: 1,
      backgroundColor: "#ffffff",
      margin: "4.6rem 0",
      [theme.breakpoints.up("md")]: {
        width: "50rem"
      }
    }
  },
  userBox: {
    width: "100%",
    marginTop: "0.5rem",
    [theme.breakpoints.up("sm")]: {
      width: "16.875rem",
      padding: 0
    }
  },
  forgotPassword: {
    textAlign: "center",
    marginTop: "0.8rem",
    "&:hover": {
      cursor: "pointer",
      textDecoration: "underline"
    }
  }
}));


const LandingPage = ({  }) => {
  const classes = useStyles();
    return (
    <div className={classes.root}>
        <div className={classes.content}>
          <img src={Logo} alt="AWS" className="Logo" />
          <div className="appName">Connected Mobility Solution</div>
          <div className="intro">for AWS</div>
      <Authenticator>
      {({ signOut }) => <button onClick={signOut}>Sign out</button>}
      </Authenticator>
    </div>
    </div>
    )
  }

//export default withStyles(useStyles)(LandingPage);
export default LandingPage;