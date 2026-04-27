import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PermissionResourceGroup } from '../models/group';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  private http = inject(HttpClient);

  getAll() : Observable<PermissionResourceGroup[]> {
    return this.http.get<PermissionResourceGroup[]>(`${environment.baseApiUrl}/resources`);
  }

}
