import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service'; // ✅ Adjust path if needed
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
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
  firmname:any;
  name:any;
  phone:any;
  email:any;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastController: ToastController,private router:Router
  ) {
    this.profileForm = this.fb.group({
      d_o_b: ['', Validators.required],
      d_o_a: [''],
      home_addr1: ['', Validators.required],
      home_addr2: [''],
   
    });

    this.loadProfile();
  }
  isEditing = false;

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }
  // ✅ Load Merchant Data from API
  loadProfile() {
    this.apiService.get('merchants/getprofile').subscribe((res: any) => {
      if (res.status) {
        this.profileForm.patchValue(res.profile);
        this.firmname=res.profile['firmname'];
        this.phone=res.profile['phone'];
        this.email=res.profile['email'];
        this.name=res.profile['person_name'];
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
    this.apiService.post('merchants/addprofiledetails', this.profileForm.value).subscribe(
      async (res: any) => {
        this.isLoading = false;
        if (res.status) {
          this.showToast('Profile updated successfully!');
          this.router.navigate(['/docList']);
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
