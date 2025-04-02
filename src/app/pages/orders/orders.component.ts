import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController, AlertController, IonicModule, IonModal, LoadingController, ToastController } from '@ionic/angular';
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
 loadingProgress : any;
 isModalOpen = false;
   selectedImage: string | null = null;
   
   @ViewChild('imageModal', { static: false }) imageModal!: IonModal;
 
  constructor(
     private actionSheetCtrl: ActionSheetController,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private sanitizer: DomSanitizer,
        private apiService: ApiService,
            public loadingCtrl: LoadingController,
        
  ) { }

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    this.presentLoading();
    this.apiService.get('merchants/vieworders').subscribe(
      (res: any) => {
        this.loadingProgress.dismiss(); 

        if (res.status && res.orders) {
          this.orders = res.orders.map((order: any) => ({
            ...order,
            statusText: order.status === '1' ? 'Pending' : 'Completed',
          }));
        }
      },
      (error) => {
        this.loadingProgress.dismiss(); 

        console.error('API Error:', error);
      }
    );
  }
  async presentLoading() {
    this.loadingProgress = await this.loadingCtrl.create({
      message: 'Please wait...',
      spinner: 'crescent',
    });
  
    await this.loadingProgress.present(); // Correct way to show loader
  }
  async selectImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
      });

      if (image.webPath) {
        const resizedFile = await this.resizeImage(image.webPath, 2); // Resize to 2MB
      
        if (resizedFile) {
          this.uploadOrder(resizedFile);
        } else {
          this.showToast("Failed to process image.");
        }
      }
    } catch (error) {
      this.showToast('Camera access denied.');
    }
  }
  
  async resizeImage(imageUri: string, maxSizeMB: number): Promise<File | null> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageUri;
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        let width = img.width;
        let height = img.height;
  
        // Resize while keeping aspect ratio
        const scaleFactor = Math.sqrt((maxSizeMB * 1024 * 1024) / (width * height));
        width *= scaleFactor;
        height *= scaleFactor;
  
        canvas.width = width;
        canvas.height = height;
  
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
  
          // Convert to Blob
          canvas.toBlob(async (blob) => {
            if (blob && blob.size <= maxSizeMB * 1024 * 1024) {
              const fileName = `estimate_${new Date().getTime()}.jpg`;
              const file = new File([blob], fileName, { type: "image/jpeg" });
              resolve(file);
            } else {
              resolve(null);
            }
          }, "image/jpeg", 0.8); // Compression quality
        } else {
          reject("Canvas not supported");
        }
      };
  
      img.onerror = () => reject("Image load error");
    });
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
  openImageModal(imageUrl: string) {
    this.selectedImage = imageUrl;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

}
