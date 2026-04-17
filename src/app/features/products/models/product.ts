export interface Product {
  id: number;
  name: string;
  supplier: string;
  category: string;
  unit: string;
  stock: number;
  purchasePrice: number;
  salePrice: number;
}

export interface ProductLookupEntity {
  id: number;
  name: string;
}

export interface ProductSupplierEntity {
  id: number;
  companyName: string;
}

export interface ProductDetails {
  id: number;
  name: string;
  supplier: ProductSupplierEntity;
  category: ProductLookupEntity;
  unit: ProductLookupEntity;
  stock: number;
  purchasePrice: number;
  salePrice: number;
}
