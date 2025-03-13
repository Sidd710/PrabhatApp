import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { SalesDashboardComponent } from './pages/sales-dashboard/sales-dashboard.component';
import { MerchantDashboardComponent } from './pages/merchant-dashboard/merchant-dashboard.component';
import { AddMerchantComponent } from './pages/pages/add-merchant/add-merchant.component';
import { DocumentListComponent } from './pages/pages/document-list/document-list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'sales-dashboard', component: SalesDashboardComponent, canActivate: [AuthGuard] },
  { path: 'merchant-dashboard', component: MerchantDashboardComponent, canActivate: [AuthGuard] },
  { path: 'add-merchant', component: AddMerchantComponent,canActivate: [AuthGuard]  }, // ✅ New route
  { path: 'docList', component: DocumentListComponent,canActivate: [AuthGuard]  },
  { path: '**', redirectTo: 'login' },
 

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}