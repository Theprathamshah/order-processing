import { QueryCommand } from "@aws-sdk/client-dynamodb";
import createDynamoDBClient from "../clients/dynamoDBClient";
import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";

export const handler = async (event: any) => {
  try {
    const client = createDynamoDBClient();
    const id = event.pathParameters.id;
    const queryCommand = new QueryCommand({
      TableName: "Orders",
      KeyConditionExpression: "PK = :pk AND SK = :sk",
      ExpressionAttributeValues: {
        ":pk": { S: "ORDER" },
        ":sk": { S: `ORDER#${id}` },
      },
    });
    console.log(id);
    const queryResult = await client.send(queryCommand);
    console.log("Query result in delete order by id", queryResult);

    if (!queryResult.Items || queryResult.Items.length === 0) {
      throw new Error("Order not found");
    }
    const deleteRequests = queryResult.Items.map((item) => ({
      DeleteRequest: {
        Key: {
          PK: item.PK.S,
          SK: item.SK.S,
        },
      },
    }));

    const batchWriteCommand = new BatchWriteCommand({
      RequestItems: {
        Orders: deleteRequests,
      },
    });
    const result = await client.send(batchWriteCommand);
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Error: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: "Internal server error",
        },
        null,
        2,
      ),
    };
  }
};
