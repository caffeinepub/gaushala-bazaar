import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Order {
    id: bigint;
    customerName: string;
    status: string;
    productId: bigint;
    productName: string;
    address: string;
    shopName: string;
    phone: string;
}
export interface Product {
    id: bigint;
    name: string;
    description: string;
    available: boolean;
    shopName: string;
    price: bigint;
}
export interface backendInterface {
    addProduct(shopName: string, name: string, description: string, price: bigint): Promise<bigint>;
    deleteProduct(id: bigint): Promise<boolean>;
    getOrders(): Promise<Array<Order>>;
    getProducts(): Promise<Array<Product>>;
    placeOrder(productId: bigint, customerName: string, phone: string, address: string): Promise<bigint>;
    updateOrderStatus(orderId: bigint, status: string): Promise<boolean>;
}
