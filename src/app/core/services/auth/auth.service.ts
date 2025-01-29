import { Injectable } from '@angular/core';
import { Observable, delay, shareReplay, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../../environments/environment';
import { SignInRequest, JwtResponse } from '../../models/auth';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) { }

  signIn(request : SignInRequest) : Observable<JwtResponse> {
    return this.http
    .post<JwtResponse>(environment.baseUrl + '/auth/signIn', request)
    .pipe(
      tap((response : JwtResponse) => localStorage.setItem("token", response.token)),
      shareReplay(1)
    );
  }
  
  logOut() {
    localStorage.clear();
  }

  isLoggedIn() : boolean{
    const token = localStorage.getItem("token");
    return !this.jwtHelper.isTokenExpired(token);
  }
}
