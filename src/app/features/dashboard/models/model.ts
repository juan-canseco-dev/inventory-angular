export interface DashboardDateRangeRequest {
  startDate: Date | null;
  endDate: Date | null;
}

export interface DashboardLimitRequest extends DashboardDateRangeRequest {
  limit: number;
}

export interface DashboardLowStockRequest {
  stockThreshold: number;
}

export interface DashboardLowStockListRequest extends DashboardLowStockRequest {
  limit: number;
}

export interface DashboardRequest {
  startDate: Date | null;
  endDate: Date | null;
  limit: number;
  stockThreshold: number;
}

export interface InventoryValueSummary {
  totalValue: number;
}

export interface MonthlySalesPoint {
  year: number;
  month: number;
  totalValue: number;
}

export interface ProductWithLowStock {
  id: number;
  name: string;
  stockQuantity: number;
}

export interface ProductsByCategory {
  categoryId: number;
  categoryName: string;
  productCount: number;
}

export interface TopCustomerByRevenue {
  id: number;
  fullName: string;
  totalRevenue: number;
}

export interface TopSoldProduct {
  productId: number;
  productName: string;
  totalSold: number;
}

export interface TopSupplierByRevenue {
  id: number;
  name: string;
  totalRevenue: number;
}

export interface DashboardUpdatedMessage {
  type: 'dashboard.updated';
}

export interface DashboardData {
  purchasesValueSummary: InventoryValueSummary;
  monthlySalesSeries: MonthlySalesPoint[];
  outOfStockProductsCount: number;
  productsCountByCategory: ProductsByCategory[];
  productsWithLowStockCount: number;
  productsWithLowStock: ProductWithLowStock[];
  salesValueSummary: InventoryValueSummary;
  topCustomersByRevenue: TopCustomerByRevenue[];
  topSoldProducts: TopSoldProduct[];
  topSuppliersByRevenue: TopSupplierByRevenue[];
  totalInventoryValueSummary: InventoryValueSummary;
}
