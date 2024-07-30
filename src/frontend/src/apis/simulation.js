import { ApiError,post } from "aws-amplify/api";
import { CDF_AUTO } from "apis/_NAMES";
import { CDF_AUTO_ENDPOINT } from "assets/appConfig";

/*
export const startorStopSimulation = async (data) => {
  return post({ 
    apiName: CDF_AUTO, 
    endpoint: CDF_AUTO_ENDPOINT, 
    path:`/simulation`,
    options: {
        body: data
    }
  });
};*/

export async function startorStopSimulation(data) {
  try {
    const restOperation = post(
      {
          apiName: CDF_AUTO, 
          endpoint: CDF_AUTO_ENDPOINT, 
          path: `/simulation`,
          options: {
            body: data
          }
      });
    return (await restOperation.response).body.json()
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