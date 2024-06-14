import { API } from "aws-amplify";
import { CDF_AUTO } from "apis/_NAMES";


export const startorStopSimulation = async (data) => {
  return API.post(CDF_AUTO, `/simulation`, {
    body: data,
  });
};