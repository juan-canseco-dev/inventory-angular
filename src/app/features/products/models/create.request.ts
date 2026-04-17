export interface CreateProductRequest {
  supplierId: number;
  categoryId: number;
  unitId: number;
  name: string;
  purchasePrice: number;
  salePrice: number;
}
