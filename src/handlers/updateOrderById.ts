import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import createDynamoDBClient from "../clients/dynamoDBClient";
import { orderSchema } from "./createOrder";

export const handler = async (event: any) => {
  if (!event.pathParameters?.id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing order ID in request path" }),
    };
  }

  const orderId = event.pathParameters.id;
  const body = JSON.parse(event.body || "{}");

  try {
    const data = orderSchema.partial().parse(body); // Validate input fields
    if (Object.keys(data).length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No update fields provided" }),
      };
    }

    const client = createDynamoDBClient();

    // Build update expressions
    const updateExpressions: string[] = [];
    const expressionAttributeValues: Record<string, any> = {};
    Object.entries(data).forEach(([key, value], index) => {
      const attributeKey = `#attr${index}`;
      const valueKey = `:val${index}`;
      updateExpressions.push(`${attributeKey} = ${valueKey}`);
      expressionAttributeValues[valueKey] = value;
    });

    // Always update `updatedAt`
    updateExpressions.push("#updatedAt = :updatedAt");
    expressionAttributeValues[":updatedAt"] = new Date().toISOString();

    const updateCommand = new UpdateCommand({
      TableName: "Orders",
      Key: {
        PK: "ORDER",
        SK: `ORDER#${orderId}`,
      },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames: {
        ...Object.fromEntries(
          Object.keys(data).map((key, index) => [`#attr${index}`, key]),
        ),
        "#updatedAt": "updatedAt",
      },
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    const result = await client.send(updateCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Order updated successfully",
        updatedOrder: result.Attributes,
      }),
    };
  } catch (error: any) {
    console.error("Validation or Update Error:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid request",
        error: error.message,
      }),
    };
  }
};
