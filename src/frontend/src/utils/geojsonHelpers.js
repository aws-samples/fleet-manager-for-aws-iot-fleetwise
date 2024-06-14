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



export const fixBoundingBox = (bboxArr = []) => {
  if (bboxArr[0] < -180) bboxArr[0] = -180;
  if (bboxArr[2] > 180) bboxArr[2] = 180;
  return bboxArr;
};

export const validCoord = (longLatArr = []) => {
  if (
    !Array.isArray(longLatArr) ||
    longLatArr.length !== 2 ||
    !Number.isFinite(longLatArr[0]) ||
    !Number.isFinite(longLatArr[1])
  ) {
    return false;
  }
  return (
    longLatArr[0] >= -180 &&
    longLatArr[0] <= 180 &&
    longLatArr[1] >= -90 &&
    longLatArr[1] <= 90
  );
};

