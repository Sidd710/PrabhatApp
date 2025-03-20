import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  standalone: true, // ✅ Keep this since it's a standalone component
  imports: [CommonModule, FormsModule, IonicModule],
   schemas: [CUSTOM_ELEMENTS_SCHEMA], // ✅ Import required modules
  templateUrl: './company-contact-info.component.html',
  styleUrls: ['./company-contact-info.component.scss']
})
export class CompanyContactInfoComponent implements OnInit {
  companyDetails: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getCompanyDetails();
  }

  getCompanyDetails() {
    this.http.get('https://techwise-apps.com/otdygp/prabhat/api/files/details').subscribe(
      (response: any) => {
        if (response.status) {

          this.companyDetails = response.info; // Assuming API returns a `details` object
        } else {
          console.error('Failed to fetch company details');
        }
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }
}
