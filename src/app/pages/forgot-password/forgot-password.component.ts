import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  imports: [CommonModule, FormsModule, IonicModule],
     schemas: [CUSTOM_ELEMENTS_SCHEMA], // ✅ Import required modules
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordPage {
  email: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async submitForgotPassword() {
    if (!this.email) {
      this.showToast('Please enter your email');
      return;
    }

    this.apiService.post('forgot-password', { email: this.email }).subscribe(
      async (res: any) => {
        if (res.status) {
          this.showToast('Password reset link sent to your email.');
          this.router.navigate(['/login']);
        } else {
          this.showToast(res.message || 'Something went wrong');
        }
      },
      (error) => {
        this.showToast('API Error: ' + error.message);
      }
    );
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }
}
