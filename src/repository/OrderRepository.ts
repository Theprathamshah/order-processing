import { OrderType } from "../handlers/createOrder";

export type Order = {
    price: number;
    quantity: number;
    productId: string;
    userId: string;
    address: string;
    status: string;
    paymentStatus: string;
    createdAt: string;
    updatedAt: string;
}

export class OrderRepository {
    constructor() {

    }

    createOrder(order: OrderType) : Promise<Order> {
        return Promise.resolve(order);
    }

    getOrderById(id: string) : Promise<Order> {
        return Promise.resolve({
            price: 100,
            quantity: 10,
            productId: '123',
            userId: '123',
            address: '123',
            status: '123',
            paymentStatus: '123',
            createdAt: '123',
            updatedAt: '123',
        });
    }

    deleteOrderById(id: string) : Promise<boolean> {
        return Promise.resolve(true);
    }

    updateOrderById(id: string, order: Partial<OrderType>) : Promise<Partial<OrderType>> {
        return Promise.resolve(order);
    }
    
    getAllOrders() : Promise<Order[]> { 
        return Promise.resolve([{
            price: 100,
            quantity: 10,
            productId: '123',
            userId: '123',
            address: '123',
            status: '123',
            paymentStatus: '123',
            createdAt: '123',
            updatedAt: '123',
        }]);
    }
}

export function createOrderRepository() {
    return new OrderRepository();
}