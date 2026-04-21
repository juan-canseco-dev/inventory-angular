export interface UpdateOrderRequest {
  orderId: number;
  productsWithQuantities: Record<number, number>;
};
