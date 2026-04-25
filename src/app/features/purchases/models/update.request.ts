export interface UpdatePurchaseRequest {
  purchaseId: number;
  productsWithQuantities: Record<number, number>;
};
