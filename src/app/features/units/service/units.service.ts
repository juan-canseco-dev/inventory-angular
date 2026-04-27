import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable} from 'rxjs';
import { PagedList } from '../../../shared/types';
import { Unit, CreateUnitRequest, UpdateUnitRequest, GetUnitsRequest } from '../models';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UnitsService {

  constructor(private http: HttpClient) { }

  getAll(request: GetUnitsRequest): Observable<PagedList<Unit>> {

    let params = new HttpParams();

    if (request.pageNumber != null) {
      params = params.append("pageNumber", request.pageNumber!);
    }

    if (request.pageSize != null) {
      params = params.append("pageSize", request.pageSize);
    }

    if (request.orderBy != null) {
      params = params.append("orderBy", request.orderBy);
    }

    if (request.sortOrder != null) {
      params = params.append("sortOrder", request.sortOrder);
    }

    if (request.name != null) {
      params = params.append("name", request.name);
    }

    return this.http.get<PagedList<Unit>>(`${environment.baseApiUrl}/units`, { params: params });
  }

  getById(id: number): Observable<Unit> {
    return this.http.get<Unit>(`${environment.baseApiUrl}/units/${id}`);
  }

  create(request: CreateUnitRequest): Observable<number> {
    return this.http.post<number>(`${environment.baseApiUrl}/units`, request);
  }


  update(request: UpdateUnitRequest): Observable<any> {
    return this.http.put<any>(`${environment.baseApiUrl}/units/${request.unitOfMeasurementId}`, request);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.baseApiUrl}/units/${id}`);
  }

}
