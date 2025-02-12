import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import createDynamoDBClient from "../clients/dynamoDBClient";
import { Order } from "../models/OrderModel";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
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

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: `Order with ID ${orderId} not found` }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Order retrieved successfully",
        order: result.Item as Order,
      }),
    };
  } catch (error) {
    console.error("Error retrieving order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error",
        error: (error as Error).message,
      }),
    };
  }
};
