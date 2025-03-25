import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;

  constructor(private fb: FormBuilder,private apiService:ApiService, private toastCtrl: ToastController,private router:Router
  ) {
    this.resetPasswordForm = this.fb.group(
      {oldPassword:['',Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      const payload = {
        oldpassword: this.resetPasswordForm.value['oldPassword'],
        newpassword: this.resetPasswordForm.value['newPassword'],
        type: localStorage.getItem('userType')
      };
      this.apiService.post('login/resetpassword', payload).subscribe(
        async (res: any) => {
          if (res.status) {
            this.showToast(res.msg);
            if (localStorage.getItem('userType') === '1') {
              this.router.navigate(['/merchant-dashboard']); // Redirect to Sales Dashboard
            } else if (localStorage.getItem('userType') === '2') {
              this.router.navigate(['/docList']); // Redirect to Merchant Dashboard
            }
            
          } else {
            this.showToast(res.msg || 'Something went wrong');
          }
        },
        (error) => {
          this.showToast('API Error: ' + error.message);
        }
      );
    }
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
