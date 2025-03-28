import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { MerchantDashboardComponent } from './pages/merchant-dashboard/merchant-dashboard.component';
import { AddMerchantComponent } from './pages/add-merchant/add-merchant.component';
import { DocumentListComponent } from './pages/document-list/document-list.component';
import { MerchantProfileComponent } from './pages/merchant-profile/merchant-profile.component';
import { CompanyContactInfoComponent } from './pages/company-contact-info/company-contact-info.component';
import { ForgotPasswordPage } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { EstimateComponent } from './pages/estimate/estimate.component';
import { QueryComponent } from './pages/query/query.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'merchant-dashboard', component: MerchantDashboardComponent},
  { path: 'add-merchant', component: AddMerchantComponent  }, // ✅ New route
  { path: 'docList', component: DocumentListComponent},
  { path: 'companyInfo', component: CompanyContactInfoComponent},
  {path:'forgot-password', component:ForgotPasswordPage},
  {path:'estimate', component:EstimateComponent},
  {path:'orders', component:OrdersComponent},
  {path:'query', component:QueryComponent},
 // {path:'merchant-profile',component:MerchantProfileComponent, canActivate:[AuthGuard]},
 {
  path: 'merchant-profile',
  loadComponent: () => import('./pages/merchant-profile/merchant-profile.component')
    .then(m => m.MerchantProfileComponent)
  // ✅ Ensure AuthGuard allows access
},
{ path: 'reset-password', component: ResetPasswordComponent },

  { path: '**', redirectTo: 'login' },
 

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}