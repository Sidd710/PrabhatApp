import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authState = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  isLoggedIn$ = this.authState.asObservable();
  constructor(private http: HttpClient, private router: Router,private apiService: ApiService) {}
 
  getRole(): string {
    return localStorage.getItem('userRole') || '';
  }
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
  getUserType(): string | null {
    return localStorage.getItem('userType'); // Retrieve user type
  }

  getUserData(): any {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  }
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.apiService.post<any>('login/auth', credentials,true).pipe(
      tap(response => {
        this.authState.next(true); // Notify that user is logged in

        localStorage.setItem('token', response.token);
        localStorage.setItem('userData', JSON.stringify(response.userdata)); // ✅ Save user data
        localStorage.setItem('userType', response.usertype.toString()); 
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.authState.next(false); // Notify that user is logged out

    this.router.navigate(['/login']);
  }

  checkLoginStatus(): boolean {
    return !!localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
  
}