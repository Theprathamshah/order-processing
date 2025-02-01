import z from 'zod';

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
    constructor() {}

    async process(event:any) {
        console.log('Event: ', event);
        const body = JSON.parse(event.body);

        //validation 
        orderSchema.parse(body);

        return {
            statusCode: 200,
            body: JSON.stringify(
                {
                    message: 'create order api called'
                },
                null,
                2
            ),
        };
    }
}

export const handler = async (event:any) => {
    try {
        const instance = new CreateBookHandler();
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
