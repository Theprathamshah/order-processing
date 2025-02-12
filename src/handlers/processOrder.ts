import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { SQSEvent } from "aws-lambda";
import createDynamoDBClient from "../clients/dynamoDBClient";
import { v4 as uuid } from "uuid";

const dbClient = createDynamoDBClient();
const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: SQSEvent) => {
  console.log(`Processing ${event.Records.length} orders`);
  try {
    const putRequests = event.Records.map((record) => {
      const order = JSON.parse(record.body);
      return {
        PutRequest: {
          Item: {
            PK: "ORDER",
            SK: `ORDER#${uuid()}`,
            ...order,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });

    if (putRequests.length > 0) {
      await dbClient.send(
        new BatchWriteCommand({
          RequestItems: {
            [TABLE_NAME]: putRequests,
          },
        }),
      );
      console.log(`Successfully processed ${putRequests.length} orders`);
    }
  } catch (error) {
    console.error("Error processing orders:", error);
  }
};
