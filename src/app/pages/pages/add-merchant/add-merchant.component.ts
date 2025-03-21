import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-merchant',
  templateUrl: './add-merchant.component.html',
  styleUrls: ['./add-merchant.component.scss'],
  standalone: true,
    imports: [CommonModule, RouterModule, IonicModule,ReactiveFormsModule],
    
})
export class AddMerchantComponent  implements OnInit {
  merchantForm:FormGroup;
  isLoggedIn:boolean=false;
  constructor(private apiService: ApiService, private toastCtrl: ToastController,private router:Router,private fb:FormBuilder,private http:HttpClient) {
    this.isLoggedIn = !!localStorage.getItem('token'); // Check if token exists

    this.merchantForm = this.fb.group({
      firmname: ['', Validators.required],
      person_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      gst: ['', Validators.required],
      pincode: ['', Validators.required],
      city: [{ value: '', disabled: true }, Validators.required], // Disabled initially
      state: [{ value: '', disabled: true }, Validators.required], // Disabled initially
      area: [''],
      address_1: ['', Validators.required],
      address_2: [''],
     // code: [''],
    });
    if (!this.isLoggedIn) {
      this.merchantForm.addControl('code', this.fb.control('', Validators.required));
    }
   }

  ngOnInit() {}
  fetchLocation() {
    const pincode = this.merchantForm.get('pincode')?.value;
    if (pincode.length === 6) {
      this.http.get<any>(`https://api.postalpincode.in/pincode/${pincode}`).subscribe(
        (res) => {
          if (res[0].Status === 'Success' && res[0].PostOffice.length > 0) {
            const location = res[0].PostOffice[0];
            this.merchantForm.patchValue({
              city: location.District,
              state: location.State,
            });
          } else {
            this.showToast('Invalid Pincode', 'danger');
            this.merchantForm.patchValue({ city: '', state: '' });
          } 
        },
        () => {
          this.showToast('Error fetching location', 'danger');
        }
      );
    }
    else{
      this.showToast('Invalid Pincode', 'danger');
    }
  }
  addMerchant() {
    if (this.merchantForm.invalid) {
      this.showToast('Please fill all required fields correctly.', 'danger');
      return;
    }

    this.merchantForm.get('city')?.enable();
    this.merchantForm.get('state')?.enable();
  
    const formData = this.merchantForm.value; // Get form data
  
    // Disable the fields again after retrieving values
    this.merchantForm.get('city')?.disable();
    this.merchantForm.get('state')?.disable();
    this.apiService.post('merchants/addmerchant', formData).subscribe(
      (res:any) => {
        if (res.status) {
          this.showToast('Merchant added successfully!', 'success');

          if(this.isLoggedIn){
          
          this.router.navigate(['/merchant-dashboard']);
          }
          else{
            this.router.navigate(['/login']);
          }
        } else {
          this.showToast(res.msg, 'danger');
        }
      },
      () => {
        this.showToast('Failed to add merchant.', 'danger');
      }
    );
  
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
    });
    toast.present();
  }

  goBack(){
    if(this.isLoggedIn){
          
      this.router.navigate(['/merchant-dashboard']);
      }
      else{
        this.router.navigate(['/login']);
      }
  }
}
