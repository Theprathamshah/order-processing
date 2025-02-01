import { OrderType } from "../handlers/createOrder";

export class OrderRepository {
    constructor() {

    }

    createOrder(order: OrderType) {
        
    }
}

export function createOrderRepository() {
    return new OrderRepository();
}