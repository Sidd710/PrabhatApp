import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { MerchantDashboardComponent } from './pages/merchant-dashboard/merchant-dashboard.component';
import { AddMerchantComponent } from './pages/pages/add-merchant/add-merchant.component';
import { DocumentListComponent } from './pages/pages/document-list/document-list.component';
import { MerchantProfileComponent } from './pages/merchant-profile/merchant-profile.component';
import { CompanyContactInfoComponent } from './pages/company-contact-info/company-contact-info.component';
import { ForgotPasswordPage } from './pages/forgot-password/forgot-password.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'merchant-dashboard', component: MerchantDashboardComponent},
  { path: 'add-merchant', component: AddMerchantComponent  }, // ✅ New route
  { path: 'docList', component: DocumentListComponent},
  { path: 'companyInfo', component: CompanyContactInfoComponent},
  {path:'forgot-password', component:ForgotPasswordPage}
 // {path:'merchant-profile',component:MerchantProfileComponent, canActivate:[AuthGuard]},
 {
  path: 'merchant-profile',
  loadComponent: () => import('./pages/merchant-profile/merchant-profile.component')
    .then(m => m.MerchantProfileComponent)
  // ✅ Ensure AuthGuard allows access
},
  { path: '**', redirectTo: 'login' },
 

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}