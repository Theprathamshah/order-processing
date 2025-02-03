import { Ordering } from 'effect/src/Ordering';
import z from 'zod';
import { Order, creatOrderModel } from '../models/OrderModel';

const orderSchema = z.object({ 
    price: z.number(),
    quantity: z.number(),
    productId: z.string(),
    userId: z.string(),
    address: z.string(),
    status: z.string(),
    paymentStatus: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type OrderType = z.infer<typeof orderSchema>;
class CreateBookHandler {
    constructor(private readonly orderModel: Order) {
    }

    async process(event:any) {
        console.log('Event: ', event);
        const body = JSON.parse(event.body);

        //validation 
        const data = orderSchema.parse(body);
        const order = await this.orderModel.createOrder(data);
        return {
            statusCode: 201,
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
        const instance = new CreateBookHandler(orderInstance);
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
