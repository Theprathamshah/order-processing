import { creatOrderModel, Order } from "../models/OrderModel";
class deleteOrderById {
    constructor(private readonly orderModel: Order) {

    }
    async process(event:any) {
        console.log('Event: ', event);
        const id = event.pathParameters.id;
        const order = await this.orderModel.deleteOrderById(id);
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
        const instance = new deleteOrderById(orderInstance);
        return await instance.process(event);
        
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