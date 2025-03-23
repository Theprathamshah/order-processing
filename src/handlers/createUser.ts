import { APIGatewayProxyEvent } from "aws-lambda";
import createDynamoDBClient from "../clients/dynamoDBClient";
import { QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuid } from "uuid";
import crypto from "crypto";

const hashPassword = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
};

export const handler = async (event: APIGatewayProxyEvent) => {
  console.log("event: ", event);
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Request body is missing" }),
    };
  }

  const user = JSON.parse(event.body);
  const { email, password } = user;
  console.log("User is", user);

  if (!email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Email and password are required" }),
    };
  }

  const client = createDynamoDBClient();
  const userEmail = email.trim().toLowerCase();

  console.log("Before checking user existence");

  const findUserParams = new QueryCommand({
    TableName: "usersTable",
    IndexName: "EmailIndex",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": userEmail,
    },
  });

  try {
    const findUserResult = await client.send(findUserParams);
    if (findUserResult.Items && findUserResult.Items.length > 0) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: "User already exists" }),
      };
    }
  } catch (error) {
    console.error("Error checking user existence:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }

  console.log("After checking user existence");
  console.log("Before hashing password");

  try {
    const hashedPassword = await hashPassword(password);
    console.log("After hashing password");

    const userId = `USER#${uuid()}`;

    const userItem = {
      userId,
      email: userEmail,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Before put command");

    const putUserParams = new PutCommand({
      TableName: "usersTable",
      Item: userItem,
    });
    console.log("After put command");

    console.log("Before creating user...");
    await client.send(putUserParams);
    console.log("User created successfully", user.email);
    console.log("After creating user...");

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "User created successfully",
      }),
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
