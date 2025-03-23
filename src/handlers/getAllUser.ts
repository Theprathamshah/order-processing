import { APIGatewayProxyEvent } from "aws-lambda";
import createDynamoDBClient from "../clients/dynamoDBClient";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

export const handler = async (event: APIGatewayProxyEvent) => {
  console.log("Fetching all users...");

  const client = createDynamoDBClient();

  try {
    const result = await client.send(
      new ScanCommand({ TableName: "usersTable" }),
    );
    return { statusCode: 200, body: JSON.stringify({ users: result.Items }) };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
