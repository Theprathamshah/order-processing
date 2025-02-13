import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { v4 as uuid } from "uuid";
import z from "zod";


export const orderSchema = z.object({
  price: z.number().positive("Price must be greater than 0"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  productId: z.string().min(1, "Product ID is required"),
  userId: z.string().min(1, "User ID is required"),
  address: z.string().min(5, "Address is too short"),
  status: z.string().min(1, "Status is required"),
  paymentStatus: z.string().min(1, "Payment status is required"),
  isScript: z.boolean().optional(),
});

const sqs = new SQSClient({});
const QUEUE_URL = process.env.QUEUE_URL;

export type OrderType = z.infer<typeof orderSchema>;

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log("Received order creation request");

  if (!QUEUE_URL) {
    console.error("QUEUE_URL is not defined");
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal configuration error" }),
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Request body is missing" }),
      };
    }

    const parsedBody = orderSchema.safeParse(JSON.parse(event.body));
    if (!parsedBody.success) {
      console.error("Validation failed:", parsedBody.error.format());
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Invalid input",
          errors: parsedBody.error.format(),
        }),
      };
    }

    const orderId = `ORDER#${uuid()}`;
    const orderItem = {
      PK: "ORDER",
      SK: orderId,
      ...parsedBody.data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await sqs.send(
      new SendMessageCommand({
        QueueUrl: QUEUE_URL,
        MessageBody: JSON.stringify(orderItem),
      }),
    );

    console.log(`Order ${orderId} submitted to SQS`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Order submitted successfully",
        orderId,
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
