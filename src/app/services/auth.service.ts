import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/java-api/auth';
  private jwtHelper = new JwtHelperService();

  private loggedInSubject!: BehaviorSubject<boolean>;
  public isLoggedIn$!: Observable<boolean>; // ✅ solo declaración aquí

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const isLogged = isPlatformBrowser(this.platformId) && this.hasValidToken();
    this.loggedInSubject = new BehaviorSubject<boolean>(isLogged);
    this.isLoggedIn$ = this.loggedInSubject.asObservable(); // ✅ inicializada correctamente

    if (isPlatformBrowser(this.platformId)) {
      setInterval(() => {
        const token = localStorage.getItem('token');
        if (!token || this.jwtHelper.isTokenExpired(token)) {
          this.logout();
        }
      }, 30000);
    }
  }

  private hasValidToken(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;

    const token = localStorage.getItem('token');
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.loggedInSubject.next(false);
  }

  notifyLogin(token: string): void {
    localStorage.setItem('token', token);
    this.loggedInSubject.next(true);
  }
}
