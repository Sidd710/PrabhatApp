import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController, AlertController, IonicModule, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  standalone: true,
   imports: [CommonModule, IonicModule,FormsModule,IonicModule ],
})
export class OrdersComponent  implements OnInit {
 images: { url: SafeUrl; path: string }[] = []; // Stores multiple images
 orders: any[] = [];

  constructor(
     private actionSheetCtrl: ActionSheetController,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private sanitizer: DomSanitizer,
        private apiService: ApiService
  ) { }

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    this.apiService.get('merchants/vieworders').subscribe(
      (res: any) => {
        if (res.status && res.orders) {
          this.orders = res.orders.map((order: any) => ({
            ...order,
            statusText: order.status === '1' ? 'Pending' : 'Completed',
          }));
        }
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Add Image',
      buttons: [
        { text: 'Capture Photo', icon: 'camera', handler: () => this.capturePhoto() },
        { text: 'Upload from Gallery', icon: 'image', handler: () => this.pickImage() },
        { text: 'Cancel', role: 'cancel' },
      ],
    });

    await actionSheet.present();
  }

  async capturePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });
      const blob = await fetch(image.webPath!).then((r) => r.blob());

      // Extract filename from URL (if available), otherwise default to 'order.jpg'
      const fileName = image.path?.split('/').pop() || 'order.jpg';
    
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      this.uploadOrder(file);

      // if (image.dataUrl) {
      //   this.uploadImage(image.dataUrl);
      // }
    } catch (error) {
      this.showToast('Camera access denied.');
    }
  }

  async pickImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });

      // if (image.dataUrl) {
      //   this.uploadImage(image.dataUrl);
      // }
      const blob = await fetch(image.webPath!).then((r) => r.blob());

      // Extract filename from URL (if available), otherwise default to 'order.jpg'
      const fileName = image.path?.split('/').pop() || 'order.jpg';
    
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      this.uploadOrder(file);
    } catch (error) {
      this.showToast('Failed to pick image.');
    }
  }

  uploadOrder(file: File) {
    debugger;
    const formData = new FormData();
    formData.append('order', file,file.name); // Append file under 'order' key
    console.log(`File Size: ${(file.size / 1024).toFixed(2)} KB`); // Convert to KB for readability

    this.apiService.postPhoto('merchants/addorder', formData).subscribe(
      (response: any) => {
        console.log('Upload successful:', response);
        // this.toastCtrl.create()
        this.showToast('Order  uploaded successfully!');
        this.loadImages();
      },
      (error) => {
        console.error('Upload failed:', error);
      }
    );
  }
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      
    });
    toast.present();
  }

  async confirmDelete(imagePath: string, index: number) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Image?',
      message: 'Are you sure you want to delete this image?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', handler: () => this.deleteImage(imagePath, index) },
      ],
    });

    await alert.present();
  }

  deleteImage(imagePath: string, index: number) {
    this.apiService.post('files/delete', { path: imagePath }).subscribe(
      (res: any) => {
        if (res.status) {
          this.images.splice(index, 1);
          this.showToast('Image deleted successfully.');
        } else {
          this.showToast('Delete failed.');
        }
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }

}
