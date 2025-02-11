import { creatOrderModel, Order } from "../models/OrderModel";

class GetOrders {
  constructor(private readonly orderModel: Order) {}
  async getOrders(event: any) {
    // Add your code here
    const orders = await this.orderModel.getAllOrders();
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          data: orders,
        },
        null,
        2,
      ),
    };
  }
}
export async function handler(event: any) {
  try {
    const orderInstance = creatOrderModel();
    const instance = new GetOrders(orderInstance);
    return await instance.getOrders(event);
  } catch (error) {
    console.error("Error: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: "Internal server error",
        },
        null,
        2,
      ),
    };
  }
}
