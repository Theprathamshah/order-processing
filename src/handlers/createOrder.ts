import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuid } from "uuid";
import createDynamoDBClient from "../clients/dynamoDBClient";
import z from "zod";

// Order Schema Validation
export const orderSchema = z.object({
  price: z.number(),
  quantity: z.number(),
  productId: z.string(),
  userId: z.string(),
  address: z.string(),
  status: z.string(),
  paymentStatus: z.string(),
});

export type OrderType = z.infer<typeof orderSchema>;

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const client = createDynamoDBClient();

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing request body" }),
      };
    }

    const parsedBody = orderSchema.safeParse(JSON.parse(event.body));
    if (!parsedBody.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Invalid input",
          errors: parsedBody.error.format(),
        }),
      };
    }

    const orderItem = {
      PK: "ORDER",
      SK: `ORDER#${uuid()}`,
      ...parsedBody.data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await client.send(new PutCommand({ TableName: "Orders", Item: orderItem }));

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Order created successfully",
        order: orderItem,
      }),
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: (error as Error).message,
      }),
    };
  }
};
