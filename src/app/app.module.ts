import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular'; // ✅ Import IonicModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppComponent],
  
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    IonicModule.forRoot(), // ✅ Initialize IonicModule
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
   
    LoginComponent,
   
    
    HttpClientModule,
     // ✅ Required for ngModel in login form
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  bootstrap: [AppComponent]
})
export class AppModule {}
