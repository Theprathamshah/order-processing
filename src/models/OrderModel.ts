import { OrderType } from "../handlers/createOrder";
import { createOrderRepository, OrderRepository } from "../repository/OrderRepository";

export class Order {
    constructor(private readonly orderRepositoryInstance:OrderRepository){}
    async createOrder(order: OrderType) {
        return this.orderRepositoryInstance.createOrder(order);
    }
}

export function creatOrderModel() {
    const orderRepositoryInstance = createOrderRepository();
    return new Order(orderRepositoryInstance);
}