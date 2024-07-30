import { ApiError,get,post } from "aws-amplify/api";
import { CDF_AUTO } from "apis/_NAMES";
import { CDF_AUTO_ENDPOINT } from "assets/appConfig";
import { fetchAuthSession } from 'aws-amplify/auth'
const apiGateWayName = CDF_AUTO;
const accessToken = (await fetchAuthSession()).tokens?.idToken?.toString();

/*Get all fleets
export const getAllFleets = async () => {
  try {
  return get({
    apiName: CDF_AUTO, 
    endpoint: CDF_AUTO_ENDPOINT, 
    path: `/fleet`
  })
} catch (error) {
  console.error("Error fetching Fleets", error);
}
};
*/
export async function getAllFleets() {
  try {
    const restOperation = get(
      {
          apiName: CDF_AUTO, 
          endpoint: CDF_AUTO_ENDPOINT, 
          path: `/fleet`
      });
    return (await restOperation.response).body.json();
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

//Add new fleet
export const addNewFleet = async (data) => {
  return post({ 
    apiName: CDF_AUTO, 
    endpoint: CDF_AUTO_ENDPOINT, 
    path: `/fleet`, 
    options: {
      body: data
    }
  });
};