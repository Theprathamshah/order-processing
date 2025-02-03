import { creatOrderModel, Order } from "../models/OrderModel";

class getOrderByOrderId {
    constructor(private readonly orderModel: Order) {
        
    }
    async getOrderById(event:any) {
        // Add your code here
        const id = event.pathParameters.id;
        const order = await this.orderModel.getOrderById(id);
        return {
            statusCode: 200,
            body: JSON.stringify(
                {
                    data: order
                },
                null,
                2
            ),
        };
    }   
}
export const handler = async (event:any) => {
    try {
        const orderInstance = creatOrderModel();
        const instance = new getOrderByOrderId(orderInstance);
        return await instance.getOrderById(event);
    } catch (error) {
        console.error('Error: ', error);
        return {
            statusCode: 500,
            body: JSON.stringify(
                {
                    message: 'Internal server error'
                },
                null,
                2
            ),
        };
    }
};
