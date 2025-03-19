import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AppModule } from 'src/app/app.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  standalone: true, // ✅ Keep this since it's a standalone component
  imports: [CommonModule, FormsModule, IonicModule],
   schemas: [CUSTOM_ELEMENTS_SCHEMA], // ✅ Import required modules
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})export class LoginComponent {
  credentials = { email: '', password: '',fcm_token:'' };

  constructor(private authService: AuthService, private router: Router,    private toastController: ToastController) {}
  async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000, // Show for 3 seconds
      position: 'top',
      color
    });
    await toast.present();
  }
   login() {
    debugger;
    const fcmToken = localStorage.getItem('FCMToken'); // Get FCM token
this.credentials.fcm_token=fcmToken?fcmToken:'';
    this.authService.login(this.credentials).subscribe(
      async (response) => {
        if (response.status) {
          // ✅ Success: Navigate to dashboard
          localStorage.setItem('userRole', response.usertype);
          localStorage.setItem('token', response.token);
          this.showToast('Login successful!', 'success');

          if (response.usertype === 2) {
            this.router.navigate(['/docList']);
          } else if (response.usertype === 1) {
            this.router.navigate(['/merchant-dashboard']);
          }
        } else {
          // ❌ Error: Show toast with API error message
          this.showToast(response.msg || 'Login failed!', 'danger');
        }
      },
      async (error) => {
        // ❌ Network or API failure
        this.showToast('Server error! Please try again later.', 'danger');
      }
    );
  }
  addMerchant(){
    this.router.navigate(['/add-merchant']);
    
  }
}