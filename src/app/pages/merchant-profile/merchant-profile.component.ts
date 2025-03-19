import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service'; // ✅ Adjust path if needed
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-merchant-profile',
  standalone: true,
  templateUrl: './merchant-profile.component.html',
  styleUrls: ['./merchant-profile.component.scss'],
   imports: [CommonModule, RouterModule, IonicModule,ReactiveFormsModule],
})
export class MerchantProfileComponent {
  profileForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastController: ToastController
  ) {
    this.profileForm = this.fb.group({
      birthdate: ['', Validators.required],
      anniversary: [''],
      address_1: ['', Validators.required],
      address_2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', Validators.required]
    });

    this.loadProfile();
  }

  // ✅ Load Merchant Data from API
  loadProfile() {
    this.apiService.get('merchant/profile').subscribe((res: any) => {
      if (res.status) {
        this.profileForm.patchValue(res.userdata);
      }
    });
  }

  // ✅ Submit Updated Profile
  async saveProfile() {
    if (this.profileForm.invalid) {
      this.showToast('Please fill all required fields.');
      return;
    }

    this.isLoading = true;
    this.apiService.post('merchant/update-profile', this.profileForm.value).subscribe(
      async (res: any) => {
        this.isLoading = false;
        if (res.status) {
          this.showToast('Profile updated successfully!');
        } else {
          this.showToast(res.msg || 'Failed to update profile.');
        }
      },
      () => {
        this.isLoading = false;
        this.showToast('Something went wrong.');
      }
    );
  }

  // ✅ Show Toast Message
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color: 'primary',
    });
    toast.present();
  }
}
