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
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

const CustomHeaderPlayIcon = ({

}) => {
  return (
    <th
      style={{
        borderBottom: "1px solid rgba(224, 224, 224, 1)",
        top: 0,
        zIndex: 13,
        position: "sticky",
        textAlign: "left",
        paddingLeft: 16,
        backgroundColor: "#3F51B5",
      }}
    >
      <PlayArrowIcon
        style={{
          color: "white",
        }}
      />
    </th>
  );
};

export default CustomHeaderPlayIcon;
