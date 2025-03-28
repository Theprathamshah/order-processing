import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  PutCommandOutput,
} from "@aws-sdk/lib-dynamodb";
import { OrderType } from "../handlers/createOrder";
import { v4 as uuid } from "uuid";
import createDynamoDBClient from "../clients/dynamoDBClient";
import { QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
export type Order = {
  price: number;
  quantity: number;
  productId: string;
  userId: string;
  address: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  isScript: boolean;
};

export class OrderRepository {
  constructor(private readonly dbClient: DynamoDBDocumentClient) {
    if (!dbClient) {
      throw new Error("DynamoDB client is not initialized!");
    }
  }

  async createOrder(order: OrderType): Promise<PutCommandOutput> {
    const orderItem = {
      PK: "ORDER",
      SK: `ORDER#${uuid()}`,
      ...order,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const putCommand = new PutCommand({
      TableName: "Orders",
      Item: orderItem,
    });
    console.log("Before put command execution");
    return await this.dbClient.send(putCommand);
  }

  async getOrderById(id: string): Promise<Order> {
    console.log("Got id in get order by id", id);
    const getCommand = new GetCommand({
      TableName: "Orders",
      Key: {
        PK: "ORDER",
        SK: `ORDER#${id}`,
      },
    });
    const result = await this.dbClient.send(getCommand);
    console.log("Result in get order by id", result);
    return result.Item as unknown as Order;
  }

  async deleteOrderById(id: string): Promise<void> {
    const queryCommand = new QueryCommand({
      TableName: "Orders",
      KeyConditionExpression: "PK = :pk AND SK = :sk", // Use :sk here
      ExpressionAttributeValues: {
        ":pk": { S: "ORDER" },
        ":sk": { S: `ORDER#${id}` }, // Change :skPrefix to :sk
      },
    });

    const queryResult = await this.dbClient.send(queryCommand);
    console.log("Query result in delete order by id", queryResult);

    if (!queryResult.Items || queryResult.Items.length === 0) {
      throw new Error("Order not found");
    }

    // Construct delete requests
    const deleteRequests = queryResult.Items.map((item) => ({
      DeleteRequest: {
        Key: {
          PK: item.PK.S, // Ensure PK and SK are in the correct format
          SK: item.SK.S,
        },
      },
    }));

    const batchWriteCommand = new BatchWriteCommand({
      RequestItems: {
        Orders: deleteRequests,
      },
    });

    // Execute the batch delete operation
    await this.dbClient.send(batchWriteCommand);
  }

  updateOrderById(
    id: string,
    order: Partial<OrderType>,
  ): Promise<Partial<OrderType>> {
    return Promise.resolve(order);
  }

  async getAllOrders(): Promise<Order[]> {
    const params = {
      TableName: "Orders",
    };
    return (await this.dbClient.send(new ScanCommand(params)))
      .Items as unknown as Order[];
  }
}

export function createOrderRepository() {
  const dynamoDbClient = createDynamoDBClient();
  return new OrderRepository(dynamoDbClient);
}
