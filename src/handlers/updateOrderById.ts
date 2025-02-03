import { Order } from "../models/OrderModel";

class UpdateOrderById {
    constructor(private readonly orderModel: Order) {

    }
    async updateOrderById(event:any) {
        const id = event.pathParameters.id;
        const data = JSON.parse(event.body);
        const order = await this.orderModel.updateOrderById(id, data);
        return {
            statusCode: 204,
            body: JSON.stringify(
                {
                    message: `Order with id ${id} updated successfully`,
                    data: order
                },
                null,
                2
            ),
        }
    }
}

export const handler = async (event:any) => {
    console.log('Event: ', event);

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: 'update order api called'
            },
            null,
            2
        ),
    };
};
