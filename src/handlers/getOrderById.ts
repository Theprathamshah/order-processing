import { GetCommand } from "@aws-sdk/lib-dynamodb";
import createDynamoDBClient from "../clients/dynamoDBClient";
import { Order } from "../models/OrderModel";

export const handler = async (event: any) => {
  try {
    if (!event.pathParameters?.id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing order ID in request path" }),
      };
    }

    const orderId = event.pathParameters.id;
    const client = createDynamoDBClient();
    const getCommand = new GetCommand({
      TableName: "Orders",
      Key: {
        PK: "ORDER",
        SK: `ORDER#${orderId}`,
      },
    });
    const result = await client.send(getCommand);
    console.log("Result in get order by id", result);
    return result.Item as unknown as Order;
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
