import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  constructor(private http: HttpClient, private router: Router,private apiService: ApiService) {}
 
  getRole(): string {
    return localStorage.getItem('userRole') || '';
  }
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUserData(): any {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  }
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.apiService.post<any>('login/auth', credentials,true).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response.userdata)); // ✅ Save user data
        localStorage.setItem('userType', response.usertype.toString()); 
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

 

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}