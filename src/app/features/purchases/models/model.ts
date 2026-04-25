export interface Purchase {
  id: number;
  supplier: string;
  total: number;
  arrived: boolean;
  orderedAt: Date;
  arrivedAt: Date | null;
};

export interface PurchaseSupplier {
  id: number;
  companyName: string;
  contactName: string;
  contactPhone: string;
};

export interface PurchaseItem {
  id: number;
  productId: number;
  productName: string;
  productUnit: string;
  quantity: number;
  price: number;
  total: number;
};

export interface PurchaseDetails {
  id: number;
  supplier: PurchaseSupplier;
  total: number;
  items: PurchaseItem[];
  arrived: boolean;
  receiveComments: string | null;
  orderedAt: Date;
  arrivedAt: Date | null;
};
