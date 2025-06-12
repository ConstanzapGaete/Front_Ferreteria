import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/java-api/auth';
  private jwtHelper = new JwtHelperService();

  private loggedInSubject!: BehaviorSubject<boolean>;
  public isLoggedIn$!: Observable<boolean>;

  // Nuevo subject para aviso de expiración inminente
  private sessionExpiringSubject = new Subject<void>();
  public sessionExpiring$ = this.sessionExpiringSubject.asObservable();

  private warningShown = false;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const isLogged = isPlatformBrowser(this.platformId) && this.hasValidToken();
    this.loggedInSubject = new BehaviorSubject<boolean>(isLogged);
    this.isLoggedIn$ = this.loggedInSubject.asObservable();

    if (isPlatformBrowser(this.platformId)) {
      setInterval(() => {
        const token = localStorage.getItem('token');
        const expiry = parseInt(localStorage.getItem('token_expiry') || '0', 10);
        const timeLeft = expiry - Date.now();

        if (!token || this.jwtHelper.isTokenExpired(token) || Date.now() > expiry) {
          this.logout();
        } else if (timeLeft < 60000 && !this.warningShown) {
          this.warningShown = true;
          this.sessionExpiringSubject.next();
        }
      }, 10000); // chequea cada 10 segundos
    }
  }

  private hasValidToken(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;

    const token = localStorage.getItem('token');
    const expiry = parseInt(localStorage.getItem('token_expiry') || '0', 10);

    return !!token && !this.jwtHelper.isTokenExpired(token) && Date.now() < expiry;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
    this.warningShown = false;
    this.loggedInSubject.next(false);
  }

  notifyLogin(token: string): void {
    localStorage.setItem('token', token);

    const expiry = new Date().getTime() + 10 * 1000; // 10 segundos para pruebas
    localStorage.setItem('token_expiry', expiry.toString());

    this.warningShown = false;
    this.loggedInSubject.next(true);
  }

  renewSession(): void {
    const expiry = new Date().getTime() + 10 * 1000; // 10 segundos para pruebas
    localStorage.setItem('token_expiry', expiry.toString());
    this.warningShown = false;
  }
}
