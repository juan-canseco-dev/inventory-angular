import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PagedList } from '../../../shared/types';
import {
  CreateProductRequest,
  GetProductsRequest,
  Product,
  ProductDetails,
  UpdateProductRequest
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private readonly http: HttpClient) { }

  getAll(request: GetProductsRequest): Observable<PagedList<Product>> {
    let params = new HttpParams();

    if (request.pageNumber != null) {
      params = params.append('pageNumber', request.pageNumber);
    }

    if (request.pageSize != null) {
      params = params.append('pageSize', request.pageSize);
    }

    if (request.orderBy != null) {
      params = params.append('orderBy', request.orderBy);
    }

    if (request.sortOrder != null) {
      params = params.append('sortOrder', request.sortOrder);
    }

    if (request.name != null) {
      params = params.append('name', request.name);
    }

    if (request.supplierId != null) {
      params = params.append('supplierId', request.supplierId);
    }

    if (request.categoryId != null) {
      params = params.append('categoryId', request.categoryId);
    }

    if (request.unitId != null) {
      params = params.append('unitId', request.unitId);
    }

    return this.http.get<PagedList<Product>>(`${environment.baseUrl}/products`, {
      params
    });
  }

  getById(id: number): Observable<ProductDetails> {
    return this.http.get<ProductDetails>(`${environment.baseUrl}/products/${id}`);
  }

  create(request: CreateProductRequest): Observable<number> {
    return this.http.post<number>(`${environment.baseUrl}/products`, request);
  }

  update(request: UpdateProductRequest): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}/products/${request.productId}`, request);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.baseUrl}/products/${id}`);
  }
}
