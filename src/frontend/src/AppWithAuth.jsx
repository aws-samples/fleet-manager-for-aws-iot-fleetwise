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

const App = React.lazy(() => import("App"));
const LandingPage = React.lazy(() => import("components/landing-page/LandingPage"));

const AppWithAuth = ({ }) => {
  const { authStatus } = useAuthenticator(context => [context.authStatus]);

    return (
      <Suspense fallback={<div />}>
        {authStatus === 'authenticated' ? <App /> : <LandingPage />}
    </Suspense>
  );  
 
}

export default AppWithAuth;


///{({ signOut }) => <button onClick={signOut}>Sign out</button>}
