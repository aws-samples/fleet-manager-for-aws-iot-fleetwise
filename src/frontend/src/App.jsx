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
import Navbar from "components/navigation/Navbar";
import AuthorizedRoutes from "AuthorizedRoutes";
import awsConfig from "./awsConfig";
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth'

Amplify.configure(awsConfig, {
  API: {
    REST: {
      headers: async () => {
        return { Authorization: (await fetchAuthSession()).tokens?.idToken?.toString() };
      }
    }
  }
});


const App = () => {
  return (
    <Navbar>
      <AuthorizedRoutes />
    </Navbar>
  );
};

export default App;
