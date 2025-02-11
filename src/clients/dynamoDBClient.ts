import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export default function createDynamoDBClient() {
  const client = new DynamoDBClient({ region: "ap-south-1" });
  const dynamoDBDocumentClient = DynamoDBDocumentClient.from(client);
  return dynamoDBDocumentClient;
}
