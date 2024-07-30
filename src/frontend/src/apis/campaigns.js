import { ApiError,get } from "aws-amplify/api";
import { CDF_AUTO } from "apis/_NAMES";
import { CDF_AUTO_ENDPOINT } from "assets/appConfig";

/*Get all campaigns
export const getAllCampaigns = async () => {
  return get(
  {
      apiName: CDF_AUTO, 
      endpoint: CDF_AUTO_ENDPOINT, 
      path: `/fleet/campaign`
  });
};*/

export async function getAllCampaigns() {
  try {
    const restOperation = get(
      {
          apiName: CDF_AUTO, 
          endpoint: CDF_AUTO_ENDPOINT, 
          path: `/fleet/campaign`
      });
    return restOperation;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.response) {
        const { 
          statusCode, 
          headers, 
          body 
        } = error.response;
        console.error(`Received ${statusCode} error response with payload: ${body}`);
      }
  }
}
}