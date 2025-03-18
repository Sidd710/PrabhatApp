import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MessagingService } from './services/messaging.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  isLoggedIn = false;

  constructor(private router:Router,private authService: AuthService,private messagingService: MessagingService ) {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
    this.checkLoginStatus();
  }
  ngOnInit(): void {
    this.messagingService.requestPermission();
    this.messagingService.receiveMessage();
  }
  checkLoginStatus() {
    this.isLoggedIn = !!localStorage.getItem('token'); // Check if token exists
  }

  logout() {
    localStorage.removeItem('token'); // Clear token
    this.isLoggedIn = false;
    this.router.navigate(['/login']); // Redirect to login page
  }
  loginSuccess(token: string) {
    localStorage.setItem('token', token);
    this.router.navigate(['/dashboard']).then(() => {
      window.location.reload(); // Refresh to update Logout button visibility
    });
  }
  
}
