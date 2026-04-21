export interface Order {
  id: number;
  customer: string;
  total: number;
  delivered: boolean;
  orderedAt: Date;
  deliveredAt : Date | null;
};


export interface OrderCustomer {
  id: number;
  dni: string;
  phone: string;
  fullName: string;
};


export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productUnit: string;
  quantity: number;
  price: number;
  total: number;
};

export interface OrderDetails {
  id: number;
  customer: OrderCustomer;
  total: number;
  items: OrderItem[];
  delivered: boolean;
  orderedAt: Date;
  deliveredAt : Date | null;
  deliverComments?: string | null;
};
