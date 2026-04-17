export interface UpdateProductRequest {
  productId: number;
  supplierId: number;
  categoryId: number;
  unitId: number;
  name: string;
  purchasePrice: number;
  salePrice: number;
}
