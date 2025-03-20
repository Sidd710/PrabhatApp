import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { IonicModule, Platform, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
@Component({
  selector: 'app-merchant-dashboard',
   standalone: true, // ✅ Keep this since it's a standalone component
    imports: [CommonModule, FormsModule, IonicModule],
     schemas: [CUSTOM_ELEMENTS_SCHEMA], // ✅ Import required modules
  templateUrl: './merchant-dashboard.component.html',
  styleUrls: ['./merchant-dashboard.component.scss'],
})
export class MerchantDashboardComponent  implements OnInit {
  merchants: any[] = [];
  searchText: string = '';

  constructor(private platform: Platform,private apiService: ApiService, private toastController: ToastController,private router:Router) {
      this.platform.backButton.subscribeWithPriority(10, () => {
        if (this.router.url === '/merchant-dashboard') {
         App.exitApp(); // Exit app (for mobile) or do nothing (for web)
        }
      });
   }

  ionViewWillEnter() {
    this.loadMerchants();
  }
  ngOnInit() {
    this.loadMerchants();
  }
  loadMerchants() {
    this.apiService.get('merchants/merchantslistbyuser').subscribe(
      (response: any) => {
        if (response.status) {
          this.merchants = response['merchantlist']; // Assuming merchants list is in `data` key
        } else {
          this.showToast('Failed to load merchants.', 'danger');
        }
      },
      (error) => {
        this.showToast('Server error! Please try again later.', 'danger');
      }
    );
  }

  filteredMerchants() {
    return this.merchants.filter((m) =>
      m.firmname.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color
    });
    await toast.present();
  }
  activateMerchant(merchantId: string) {
    this.apiService.post('merchants/approvemerchant', { merchant_id: merchantId }).subscribe(
      (res:any) => {
        if (res.status) {
          this.showToast('Merchant activated successfully!', 'success');
          this.loadMerchants(); // Reload data
        } else {
          this.showToast(res.msg, 'danger');
        }
      }
      
    );
  }
  viewMerchant(merchant: any) {
    console.log('Viewing merchant:', merchant);
  }

  deleteMerchant(id: number) {
    console.log('Deleting merchant ID:', id);
    this.showToast('Merchant deleted successfully!', 'success');
  }
  goToAddMerchant() {
    this.router.navigate(['/add-merchant']); // ✅ Redirect to Add Merchant page
  }
}
