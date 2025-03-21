import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  userType:string | null = null;
  userCode:any;
  private subscription: Subscription = new Subscription(); // To unsubscribe later
  constructor(private router:Router,private authService: AuthService,private platform: Platform,private cdr: ChangeDetectorRef) {
   
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
     this.platform.ready().then(async () => {
      await StatusBar.setStyle({ style: Style.Dark }); // Use Style.Dark or Style.Light
       await StatusBar.show(); // Ensure the status bar is visible
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

      PushNotifications.addListener('registration', (token:any) => {
        console.log('FCM Token:', token.value);
        localStorage.setItem('FCMToken',token.value)
      });

      PushNotifications.addListener('pushNotificationReceived', (notification:any) => {
        console.log('Push received:', notification);

        if (notification.data) {
          // ✅ Handle `data` messages from Firebase
          console.log('Data Message:', notification.data);
          alert(`${notification.data.title}\n\n${notification.data.body}`);
        } else {
          // ✅ Handle normal FCM notifications
          alert(` ${notification.title}\n\n${notification.body}`);
        }
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (action:any) => {
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
  async ngOnInit(): Promise<void> {
    // Change status bar color (for Android)
     await StatusBar.setOverlaysWebView({ overlay: false });
       // Subscribe to userType updates
    this.subscription = this.authService.userType$.subscribe((type) => {
      this.userType = type;
    });
this.userType=localStorage.getItem('userType');

if (this.userType) {
  this.cdr.detectChanges(); // Force update UI when userType changes
}
    if (this.isLoggedIn) {
      // this.userType = this.authService.getUserType(); // Get stored user type
      if (this.userType === '1') {
        this.router.navigate(['/merchant-dashboard']); // Redirect to Sales Dashboard
      } else if (this.userType === '2') {
        this.router.navigate(['/docList']); // Redirect to Merchant Dashboard
      }
   this.userCode=localStorage.getItem('code');
  }
}
  checkLoginStatus() {
    this.isLoggedIn = !!localStorage.getItem('token'); // Check if token exists
  }

  logout() {
    localStorage.removeItem('token'); // Clear token
    this.isLoggedIn = false;
    localStorage.clear();
    this.router.navigate(['/login']); // Redirect to login page
  }
  loginSuccess(token: string) {
    localStorage.setItem('token', token);
    this.router.navigate(['/dashboard']).then(() => {
      window.location.reload(); // Refresh to update Logout button visibility
    });
  }
  
}
