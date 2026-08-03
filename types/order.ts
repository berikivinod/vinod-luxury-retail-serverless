export interface OrderItem {

    productId: number;

    productName: string;

    brand: string;

    image: string;

    quantity: number;

    price: number;

    lineTotal: number;

}

export interface ShippingAddress {

    street: string;

    city: string;

    state: string;

    zip: string;

}

export interface Order {

    orderId: string;

    userId: string;

    status: string;

    channel: string;

    orderDate: string;

    subtotal: number;

    tax: number;

    shipping: number;

    total: number;

    paymentMethod: string;

    trackingNumber?: string;

    store?: string;

    shippingAddress?: ShippingAddress;

    items: OrderItem[];

}