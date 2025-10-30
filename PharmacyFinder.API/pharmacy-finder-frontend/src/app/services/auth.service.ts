//import { Injectable } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
//import { Observable, tap } from 'rxjs';

//export interface LoginData {
//  email: string;
//  password: string;
//}

//export interface LoginResponse {
//  token: string;
//  role: string;
//  id: number;
//  email: string;
//  name: string;
//}

//@Injectable({
//  providedIn: 'root'
//})
//export class AuthService {
//  private apiUrl = 'http://localhost:5067/api/Auth'; // Adjust to your API URL

//  constructor(private http: HttpClient) { }

//  // Method for login API call
//  login(loginData: LoginData): Observable<LoginResponse> {
//    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData)
//      .pipe(
//        tap(response => {
//          // Store user data in localStorage after successful login
//          this.setUserData(response);
//        })
//      );
//  }

//  // Add this method to store user data
//  setUserData(userData: LoginResponse): void {
//    localStorage.setItem('auth_token', userData.token);
//    localStorage.setItem('user_role', userData.role);
//    localStorage.setItem('user_id', userData.id.toString());
//    localStorage.setItem('user_email', userData.email);
//    localStorage.setItem('user_name', userData.name || '');
//  }

//  // Get user role from localStorage
//  getUserRole(): string {
//    return localStorage.getItem('user_role') || 'Customer';
//  }

//  getUserId(): number {
//    return parseInt(localStorage.getItem('user_id') || '0');
//  }

//  // Check if user is authenticated
//  isAuthenticated(): boolean {
//    return !!localStorage.getItem('auth_token');
//  }

//  // Logout method
//  logout(): void {
//    localStorage.removeItem('auth_token');
//    localStorage.removeItem('user_role');
//    localStorage.removeItem('user_id');
//    localStorage.removeItem('user_email');
//    localStorage.removeItem('user_name');
//  }

//  // Get auth token for API requests
//  getToken(): string | null {
//    return localStorage.getItem('auth_token');
//  }
//}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  userName: string;  
  email: string;
  password: string;
  role: string;
  phone?: string;
  address?: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  username: string;  
}

export interface RegisterResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5067/api/Authentication';

  constructor(private http: HttpClient) { }

  // Login method
  login(loginData: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => {
          this.setUserData(response);
        })
      );
  }

  // Register method
  register(registerData: RegisterData): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, registerData);
  }

  // Store user data after login - updated to match backend response
  setUserData(userData: LoginResponse): void {
    localStorage.setItem('token', userData.token); 
    localStorage.setItem('user_role', userData.role);
    localStorage.setItem('user_name', userData.username);
  }


  getUserRole(): string {
    return localStorage.getItem('user_role') || 'Customer';
  }

  getUserId(): number {
    return parseInt(localStorage.getItem('user_id') || '0');
  }

  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  logout(): void {
    localStorage.removeItem('token'); 
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
  }

  
  getToken(): string | null {
    return localStorage.getItem('token'); 
  }

  getUserName(): string {
    return localStorage.getItem('user_name') || '';
  }

  getUserEmail(): string {
    return localStorage.getItem('user_email') || '';
  }

  clearAuthData(): void {
    this.logout();
  }

  getDecodedRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
     
      return decoded['role'] || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
