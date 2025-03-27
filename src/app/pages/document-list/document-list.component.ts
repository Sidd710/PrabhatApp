import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { IonicModule, Platform, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
  
 
})
export class DocumentListComponent  implements OnInit {
  files: any[] = [];
  noFiles=false;
  selectedFileUrl: SafeResourceUrl | null = null;

  constructor(private apiService: ApiService, private toastCtrl: ToastController,private router:Router,private platform: Platform, private sanitizer: DomSanitizer) { 
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.router.url === '/docList') {
       App.exitApp(); // Exit app (for mobile) or do nothing (for web)
      }
    });
  }

  ngOnInit() {}
  ionViewWillEnter() {
    this.loadFiles();
  }

  goToProfile() {
    this.router.navigate(['/merchant-profile']).then(success => {
      if (!success) {
        console.error('Navigation failed');
      }
    });
  }
  loadFiles() {
    this.apiService.get('files/fileslist').subscribe(
      (res:any) => {
        if (res.status && res.fileslist &&res.fileslist.length>0) {
          this.files = res.fileslist; // Extracting 'fileslist' from response
        } else {this.noFiles=true;
          this.files = [];
          //console.error('Failed to fetch files:', res.msg);
        }
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }
  openFile(url: string) {
    window.open(url, '_blank'); // Open file in a new tab
   //this.selectedFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);


  }
}
