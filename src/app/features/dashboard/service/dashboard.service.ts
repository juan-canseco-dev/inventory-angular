import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { toLocalDateTimeString } from '../../../shared/utils/time.utils';
import {
  DashboardData,
  DashboardLimitRequest,
  DashboardLowStockListRequest,
  DashboardLowStockRequest,
  DashboardRequest,
  DashboardUpdatedMessage,
  InventoryValueSummary,
  MonthlySalesPoint,
  ProductsByCategory,
  ProductWithLowStock,
  TopCustomerByRevenue,
  TopSoldProduct,
  TopSupplierByRevenue
} from '../models';
import { RxStompService } from '../../../core/websockets';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly http = inject(HttpClient);
  private readonly stompService = inject(RxStompService);
  private readonly dashboardUrl = `${environment.baseApiUrl}/dashboard`;

  getDashboardData(request: DashboardRequest): Observable<DashboardData> {
    const dateRange = {
      startDate: request.startDate,
      endDate: request.endDate
    };
    const limitRequest = {
      ...dateRange,
      limit: request.limit
    };
    const lowStockRequest = {
      stockThreshold: request.stockThreshold
    };
    const lowStockListRequest = {
      ...lowStockRequest,
      limit: request.limit
    };

    return forkJoin({
      purchasesValueSummary: this.getPurchasesValueSummary(dateRange),
      monthlySalesSeries: this.getMonthlySalesSeries(dateRange),
      outOfStockProductsCount: this.getOutOfStockProductsCount(),
      productsCountByCategory: this.getProductsCountByCategory(),
      productsWithLowStockCount: this.getProductsWithLowStockCount(lowStockRequest),
      productsWithLowStock: this.getProductsWithLowStock(lowStockListRequest),
      salesValueSummary: this.getSalesValueSummary(dateRange),
      topCustomersByRevenue: this.getTopCustomersByRevenue(limitRequest),
      topSoldProducts: this.getTopSoldProducts(limitRequest),
      topSuppliersByRevenue: this.getTopSuppliersByRevenue(limitRequest),
      totalInventoryValueSummary: this.getTotalInventoryValueSummary()
    });
  }

  getPurchasesValueSummary(request: DashboardRequestDateRange): Observable<InventoryValueSummary> {
    return this.http.get<InventoryValueSummary>(
      `${this.dashboardUrl}/purchases-value/summary/by-period`,
      { params: this.toDateRangeParams(request) }
    );
  }

  getMonthlySalesSeries(request: DashboardRequestDateRange): Observable<MonthlySalesPoint[]> {
    return this.http.get<MonthlySalesPoint[]>(
      `${this.dashboardUrl}/sales-value/series/monthly`,
      { params: this.toDateRangeParams(request) }
    );
  }

  getOutOfStockProductsCount(): Observable<number> {
    return this.http.get<number>(`${this.dashboardUrl}/products/out-of-stock/count`);
  }

  getProductsCountByCategory(): Observable<ProductsByCategory[]> {
    return this.http.get<ProductsByCategory[]>(`${this.dashboardUrl}/products/count/by-category`);
  }

  getProductsWithLowStockCount(request: DashboardLowStockRequest): Observable<number> {
    return this.http.get<number>(
      `${this.dashboardUrl}/products/low-stock/count`,
      { params: this.toLowStockParams(request) }
    );
  }

  getProductsWithLowStock(request: DashboardLowStockListRequest): Observable<ProductWithLowStock[]> {
    return this.http.get<ProductWithLowStock[]>(
      `${this.dashboardUrl}/products/low-stock`,
      { params: this.toLowStockParams(request).append('limit', request.limit) }
    );
  }

  getSalesValueSummary(request: DashboardRequestDateRange): Observable<InventoryValueSummary> {
    return this.http.get<InventoryValueSummary>(
      `${this.dashboardUrl}/sales-value/summary/by-period`,
      { params: this.toDateRangeParams(request) }
    );
  }

  getTopCustomersByRevenue(request: DashboardLimitRequest): Observable<TopCustomerByRevenue[]> {
    return this.http.get<TopCustomerByRevenue[]>(
      `${this.dashboardUrl}/top-customers/by-revenue`,
      { params: this.toLimitParams(request) }
    );
  }

  getTopSoldProducts(request: DashboardLimitRequest): Observable<TopSoldProduct[]> {
    return this.http.get<TopSoldProduct[]>(
      `${this.dashboardUrl}/top-products/by-sales`,
      { params: this.toLimitParams(request) }
    );
  }

  getTopSuppliersByRevenue(request: DashboardLimitRequest): Observable<TopSupplierByRevenue[]> {
    return this.http.get<TopSupplierByRevenue[]>(
      `${this.dashboardUrl}/top-suppliers/by-revenue`,
      { params: this.toLimitParams(request) }
    );
  }

  getTotalInventoryValueSummary(): Observable<InventoryValueSummary> {
    return this.http.get<InventoryValueSummary>(`${this.dashboardUrl}/inventory-value/summary/total`);
  }

  ///topic/dashboard/updates
  watchUpdates(): Observable<DashboardUpdatedMessage> {
    return this.stompService.watch('/topic/dashboard/updates').pipe(
      map(message=> JSON.parse(message.body) as DashboardUpdatedMessage)
    );
  }

  private toDateRangeParams(request: DashboardRequestDateRange): HttpParams {
    let params = new HttpParams();

    if (request.startDate) {
      params = params.append('startDate', toLocalDateTimeString(request.startDate));
    }

    if (request.endDate) {
      params = params.append('endDate', toLocalDateTimeString(request.endDate));
    }

    return params;
  }

  private toLimitParams(request: DashboardLimitRequest): HttpParams {
    return this.toDateRangeParams(request).append('limit', request.limit);
  }

  private toLowStockParams(request: DashboardLowStockRequest): HttpParams {
    return new HttpParams().append('stockThreshold', request.stockThreshold);
  }
}

type DashboardRequestDateRange = Pick<DashboardRequest, 'startDate' | 'endDate'>;
