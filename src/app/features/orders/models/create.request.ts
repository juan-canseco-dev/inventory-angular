export interface CreateOrderRequest {
  customerId: number;
  productsWithQuantities: Record<number, number>;
};
