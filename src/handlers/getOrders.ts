import { ScanCommand } from "@aws-sdk/client-dynamodb";
import createDynamoDBClient from "../clients/dynamoDBClient";
import { Order } from "../models/OrderModel";

export async function handler() {
  try {
    const client = createDynamoDBClient();

    const params = {
      TableName: "Orders",
    };
    return (await client.send(new ScanCommand(params)))
      .Items as unknown as Order[];
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
}
