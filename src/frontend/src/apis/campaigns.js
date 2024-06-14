import { API } from "aws-amplify";
import { CDF_AUTO } from "apis/_NAMES";

//Get all campaigns
export const getAllCampaigns = async () => {
  return API.get(CDF_AUTO, `/fleet/campaign`);
};