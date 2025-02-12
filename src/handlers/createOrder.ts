import z from "zod";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuid } from "uuid";
import createDynamoDBClient from "../clients/dynamoDBClient";

export const orderSchema = z.object({
  price: z.number(),
  quantity: z.number(),
  productId: z.string(),
  userId: z.string(),
  address: z.string(),
  status: z.string(),
  paymentStatus: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type OrderType = z.infer<typeof orderSchema>;

export const handler = async (event: any) => {
  try {
    const client = createDynamoDBClient();
    const body = JSON.parse(event.body);

    const data = orderSchema.parse(body);

    const orderItem = {
      PK: "ORDER",
      SK: `ORDER#${uuid()}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const putCommand = new PutCommand({
      TableName: "Orders",
      Item: orderItem,
    });
    return client.send(putCommand);
  } catch (error: unknown) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: (error as Error).message,
        },
        null,
        2,
      ),
    };
  }
};
