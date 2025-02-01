import { OrderType } from "../handlers/createOrder";

class Order {
    constructor(){}
    async createOrder(order: OrderType) {
        console.log('Order: ', order);
        return {
            message: 'Order created successfully'
        };
    }
}