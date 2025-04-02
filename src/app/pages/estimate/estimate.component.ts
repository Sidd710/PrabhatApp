import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ActionSheetController, AlertController, ToastController, LoadingController, IonLoading, IonModal } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ApiService } from 'src/app/services/api.service';
import { FormsModule } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-estimate',
  standalone: true,
  imports: [CommonModule, IonicModule,FormsModule,IonicModule ],
  templateUrl: './estimate.component.html',
  styleUrls: ['./estimate.component.scss'],
})
export class EstimateComponent implements OnInit {
  images: { url: SafeUrl; path: string }[] = []; // Stores multiple images
  estimates: any[] = [];
  isUploading: boolean = false;
  uploadProgress: number = 0;
  loadingProgress : any
  isModalOpen = false;
  selectedImage: string | null = null;
  
  @ViewChild('imageModal', { static: false }) imageModal!: IonModal;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private sanitizer: DomSanitizer,
    public loadingCtrl: LoadingController,

    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    this.presentLoading();

    this.apiService.get('merchants/viewestimates').subscribe(
      (res: any) => {
        this.loadingProgress.dismiss(); 

        if (res.status && res.estimates) {
          this.estimates = res.estimates.map((estimate: any) => ({
            ...estimate,
            statusText: estimate.status === '1' ? 'Pending' : 'Completed',
          }));
        }
      },
      (error) => {
        this.loadingProgress.dismiss(); 

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

      // Extract filename from URL (if available), otherwise default to 'estimate.jpg'
      const fileName = image.path?.split('/').pop() || 'estimate.jpg';
    
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      this.uploadEstimate(file);

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

      // Extract filename from URL (if available), otherwise default to 'estimate.jpg'
      const fileName = image.path?.split('/').pop() || 'estimate.jpg';
    
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      this.uploadEstimate(file);
    } catch (error) {
      this.showToast('Failed to pick image.');
    }
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
          this.uploadEstimate(resizedFile);
        } else {
          this.showToast("Failed to process image.");
        }
      }
    } catch (error) {
      this.showToast('Camera access denied.');
    }
  }
  async presentLoading() {
    this.loadingProgress = await this.loadingCtrl.create({
      message: 'Please wait...',
      spinner: 'crescent',
    });
  
    await this.loadingProgress.present(); // Correct way to show loader
  }
  uploadEstimate(file: File) {
    debugger;
    const formData = new FormData();
   this.presentLoading();


    formData.append('estimate', file,file.name); // Append file under 'estimate' key
    console.log(`File Size: ${(file.size / 1024).toFixed(2)} KB`); // Convert to KB for readability

    this.apiService.postPhoto('merchants/addestimate', formData).subscribe(
      (event: any) => {
        debugger;
        this.loadingProgress.dismiss(); 

          this.showToast('Upload successful');
          this.loadImages(); // Reload images
       
      },
      (error) => {
        this.loadingProgress.dismiss(); 

        console.error('Upload failed:', error);
       

      }
    );
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
