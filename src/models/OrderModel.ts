import { OrderType } from "../handlers/createOrder";
import { createOrderRepository, OrderRepository } from "../repository/OrderRepository";

export class Order {
    constructor(private readonly orderRepositoryInstance:OrderRepository){}
    async createOrder(order: OrderType) {
        return await this.orderRepositoryInstance.createOrder(order);
    }

    async deleteOrderById(id: string) {
        return await this.orderRepositoryInstance.deleteOrderById(id);
    }

    async getOrderById(id: string) {
        return await this.orderRepositoryInstance.getOrderById(id);
    }

    async updateOrderById(id: string, data: Partial<OrderType>) {
        return await this.orderRepositoryInstance.updateOrderById(id, data);
    }
    async getAllOrders():Promise<OrderType[]> {
        return await this.orderRepositoryInstance.getAllOrders();
    }
}

export function creatOrderModel() {
    const orderRepositoryInstance = createOrderRepository();
    return new Order(orderRepositoryInstance);
}