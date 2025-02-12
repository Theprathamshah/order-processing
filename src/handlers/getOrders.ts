import { APIGatewayProxyResult } from "aws-lambda";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import createDynamoDBClient from "../clients/dynamoDBClient";
import { Order } from "../models/OrderModel";

export async function handler(): Promise<APIGatewayProxyResult> {
  try {
    const client = createDynamoDBClient();

    const scanCommand = new ScanCommand({
      TableName: "Orders",
    });

    const result = await client.send(scanCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Orders retrieved successfully",
        orders: result.Items as Order[],
        lastEvaluatedKey: result.LastEvaluatedKey ?? null,
      }),
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error",
        error: (error as Error).message,
      }),
    };
  }
}
