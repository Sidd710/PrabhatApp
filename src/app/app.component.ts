import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  isLoggedIn = false;

  constructor(private router:Router,private authService: AuthService,private platform: Platform ) {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
    this.initPushNotifications();

    this.checkLoginStatus();
  }
  async initPushNotifications() {
    if (Capacitor.isNativePlatform()) {
      const permStatus = await PushNotifications.requestPermissions();
      if (permStatus.receive === 'granted') {
        await PushNotifications.register();
      }

      PushNotifications.addListener('registration', (token) => {
        console.log('FCM Token:', token.value);
        localStorage.setItem('FCMToken',token.value)
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Notification Received:', notification);
        alert(notification.body);
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
        console.log('Notification Clicked:', action);
      });
    }
  }
  // setupPushNotifications() {
  //   this.firebaseX.getToken().then(token => {
  //     console.log('Firebase Token:', token);
  //     // Send this token to your backend for FCM messages
  //   });

  //   this.firebaseX.onMessageReceived().subscribe(data => {
  //     console.log('Notification received:', data);
  //     alert(data.body);
  //   });

  //   this.firebaseX.onTokenRefresh().subscribe((56139token:any) => {
  //     console.log('Token refreshed:', token);
  //   });
  // }
  ngOnInit(): void {
   
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
