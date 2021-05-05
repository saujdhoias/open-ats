import { DynamoDB } from "@aws-sdk/client-dynamodb";
const dynamodb = new DynamoDB({ apiVersion: "2012-08-10" });

/**
 * @description Checks if a stage exists inside of a funnel
 * @param funnelId - The id of the funnel that you want to check
 * @param stageName - The stage name to check for (Questionnaire, Set Up Profile, etc.)
 * @returns true or false
 */
const doesStageExist = async (funnelId: string, stageName: string) => {
  const params = {
    TableName: "OpenATS", // TODO switch to parameter store?
    Key: {
      PK: { S: funnelId },
      SK: { S: `STAGE_TITLE#${stageName}` },
    },
  };

  try {
    const response = await dynamodb.getItem(params);
    return response.Item ? response.Item : false;
  } catch (error) {
    return {
      message: `ERROR: Unable to check if your stage exists ${error.message}`,
    };
  }
};
export default doesStageExist;
