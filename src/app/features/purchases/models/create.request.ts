export interface CreatePurchaseRequest {
  supplierId: number;
  productsWithQuantities: Record<number, number>;
};
