import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss'],
  standalone:true,
  imports: [CommonModule, IonicModule,FormsModule,IonicModule ],
  
})
export class QueryComponent implements OnInit {
  queryText: string = '';
  queries: any[] = [];

  constructor(private apiService: ApiService, private toastCtrl: ToastController) {}

  ngOnInit() {
    this.loadQueries();
  }

  // Submit Query
  submitQuery() {
    if (!this.queryText.trim()) {
      this.showToast('Please enter a query');
      return;
    }

    const requestData = { query: this.queryText };

    this.apiService.post('merchants/addquery', requestData).subscribe(
      (response: any) => {
        if (response.status) {
          this.showToast('Query submitted successfully');
          this.queryText = '';
          this.loadQueries(); // Reload query list
        } else {
          this.showToast('Failed to submit query');
        }
      },
      (error) => {
        console.error('API Error:', error);
        this.showToast('Error submitting query');
      }
    );
  }

  // Load Queries
  loadQueries() {
    this.apiService.get('merchants/viewqueries').subscribe(
      (response: any) => {
        if (response.status && response.queries) {
          this.queries = response.queries;
        } else {
          this.queries = [];
        }
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }

  // Show Toast Message
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top',
      color: 'primary',
    });
    toast.present();
  }
}
