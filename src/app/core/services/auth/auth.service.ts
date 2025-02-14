import { Injectable } from '@angular/core';
import { Observable, delay, shareReplay, tap, map, catchError, of, switchMap, startWith } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../../environments/environment';
import { SignInRequest, JwtResponse, UserDetails } from '../../models/auth';
import { HttpClient } from '@angular/common/http';
import { Result, Failure } from '../../models/result';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) { }

  signIn(request: SignInRequest): Observable<Result<JwtResponse>> {
    return this.http.post<JwtResponse>(`${environment.baseUrl}/auth/singIn`, request).pipe(
      tap(),
      map((response: JwtResponse) => {
        localStorage.setItem("token", response.token);
        this.router.navigateByUrl('/');
        return Result.success(response);
      }),
      catchError(error => {
        const errorMessage = error.status === 400 
          ? "Invalid Email or Password"
          : "Server Error";
          
        return of(Result.failure<JwtResponse>(new Failure(errorMessage)));
      }),
      delay(1000),
      startWith(Result.loading<JwtResponse>()),
      shareReplay(1)
    );
  }

  
  logOut() {
    localStorage.clear();
    this.router.navigateByUrl("/auth");
  }

  isLoggedIn() : boolean{
    const token = localStorage.getItem("token");
    return !this.jwtHelper.isTokenExpired(token);
  }

  getUser() : UserDetails {
    const token = localStorage.getItem("token");
    return this.jwtHelper.decodeToken(token!)!;
  }
  
}
