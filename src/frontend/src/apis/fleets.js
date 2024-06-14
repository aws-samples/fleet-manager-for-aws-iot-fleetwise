import { API } from "aws-amplify";
import { CDF_AUTO } from "apis/_NAMES";

//Get all fleets
export const getAllFleets = async () => {
  return API.get(CDF_AUTO, `/fleet`);
};

//Add new fleet
export const addNewFleet = async (data) => {
  return API.post(CDF_AUTO, `/fleet`, {
    body: data,
  });
};