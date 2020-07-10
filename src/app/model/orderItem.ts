export interface OrderItem {
  
    id?: number;
    description: string;
    isFinished: boolean;
    registerDate?: Date;
    updateDate?: Date;
    price?: number;
}