import { OrderItem } from './orderItem';

export interface Order {
    [x: string]: any;
    id?: number;
    description: string;
    registerDate?: Date;
    updateDate?: Date;
    itens: OrderItem[];
}