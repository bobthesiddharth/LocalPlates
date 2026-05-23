import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  signup(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, { email, password });
  }

  verifySignup(email: string, code: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify-signup`, { email, code });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password });
  }

  verifyLogin(email: string, code: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify-login`, { email, code });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, { token, newPassword });
  }

  getGoogleConfig(): Observable<{ clientId: string; enabled: boolean }> {
    return this.http.get<{ clientId: string; enabled: boolean }>(`${this.baseUrl}/google-config`);
  }

  googleLogin(credential: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/google-login`, { credential });
  }

  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
