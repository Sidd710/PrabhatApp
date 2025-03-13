import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
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
  constructor(private apiService: ApiService, private toastCtrl: ToastController,private router:Router,) { }

  ngOnInit() {}
  ionViewWillEnter() {
    this.loadFiles();
  }

  loadFiles() {
    this.apiService.get('files/fileslist').subscribe(
      (res:any) => {
        if (res.status && res.fileslist) {
          this.files = res.fileslist; // Extracting 'fileslist' from response
        } else {
          this.files = [];
          console.error('Failed to fetch files:', res.msg);
        }
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }
  openFile(url: string) {
    window.open(url, '_blank'); // Open file in a new tab
  }
}
