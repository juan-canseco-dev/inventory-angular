import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
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

interface StompFrame {
  command: string;
  headers: Record<string, string>;
  body: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly dashboardUrl = `${environment.baseUrl}/dashboard`;

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

  watchUpdates(): Observable<DashboardUpdatedMessage> {
    return new Observable<DashboardUpdatedMessage>((observer) => {
      let socket: WebSocket | null = null;
      let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
      let stopped = false;

      const connect = (): void => {
        if (stopped) return;

        socket = new WebSocket(this.getSocketUrl());

        socket.onmessage = (event) => {
          this.readSockJsMessage(String(event.data)).forEach((frame) => {
            if (frame.command === 'CONNECTED') {
              this.sendStompFrame(socket, [
                'SUBSCRIBE',
                'id:dashboard-updates',
                'destination:/topic/dashboard/updates',
                '',
                ''
              ].join('\n'));
              return;
            }

            if (frame.command !== 'MESSAGE') {
              return;
            }

            const message = this.parseDashboardMessage(frame.body);
            if (message?.type === 'dashboard.updated') {
              observer.next(message);
            }
          });

          if (event.data === 'o') {
            this.sendConnectFrame(socket);
          }
        };

        socket.onclose = () => {
          if (!stopped) {
            reconnectTimer = setTimeout(connect, 5000);
          }
        };

        socket.onerror = () => socket?.close();
      };

      connect();

      return () => {
        stopped = true;
        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
        }
        socket?.close();
      };
    });
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

  private getSocketUrl(): string {
    const apiBaseUrl = environment.baseUrl || `${window.location.origin}/api`;
    const appBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '');
    const wsBaseUrl = appBaseUrl.replace(/^http/, 'ws');

    return `${wsBaseUrl}/ws-stomp`;
  }

  private sendConnectFrame(socket: WebSocket | null): void {
    const token = localStorage.getItem('token');
    const headers = [
      'CONNECT',
      'accept-version:1.2',
      'heart-beat:0,0'
    ];

    if (token) {
      headers.push(`Authorization:Bearer ${token}`);
    }

    headers.push('', '');
    this.sendStompFrame(socket, headers.join('\n'));
  }

  private sendStompFrame(socket: WebSocket | null, frame: string): void {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }

    socket.send(JSON.stringify([`${frame}\u0000`]));
  }

  private readSockJsMessage(message: string): StompFrame[] {
    if (!message.startsWith('a')) {
      return [];
    }

    try {
      const frames = JSON.parse(message.substring(1)) as string[];
      return frames.map((frame) => this.parseStompFrame(frame));
    } catch {
      return [];
    }
  }

  private parseStompFrame(frame: string): StompFrame {
    const cleanFrame = frame.replace(/\u0000$/, '');
    const [head, body = ''] = cleanFrame.split('\n\n');
    const [command, ...headerLines] = head.split('\n');
    const headers = headerLines.reduce<Record<string, string>>((result, line) => {
      const separator = line.indexOf(':');
      if (separator > -1) {
        result[line.substring(0, separator)] = line.substring(separator + 1);
      }
      return result;
    }, {});

    return {
      command,
      headers,
      body
    };
  }

  private parseDashboardMessage(body: string): DashboardUpdatedMessage | null {
    try {
      return JSON.parse(body) as DashboardUpdatedMessage;
    } catch {
      return null;
    }
  }
}

type DashboardRequestDateRange = Pick<DashboardRequest, 'startDate' | 'endDate'>;
