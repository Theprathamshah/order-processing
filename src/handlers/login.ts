import { APIGatewayProxyEvent } from "aws-lambda";
import createDynamoDBClient from "../clients/dynamoDBClient";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const verifyPassword = (
  storedPassword: string,
  inputPassword: string,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const [salt, hash] = storedPassword.split(":");
    crypto.scrypt(inputPassword, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(hash === derivedKey.toString("hex"));
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

  const { email, password } = JSON.parse(event.body);
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
    if (!findUserResult.Items || findUserResult.Items.length === 0) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid email or password" }),
      };
    }

    const user = findUserResult.Items[0];
    console.log("User found: ", user);

    const isPasswordValid = await verifyPassword(user.password, password);
    if (!isPasswordValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid email or password" }),
      };
    }

    console.log("Password verified");

    const token = jwt.sign(
      { userId: user.userId, email: userEmail },
      JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Login successful", token }),
    };
  } catch (error) {
    console.error("Error during login:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
