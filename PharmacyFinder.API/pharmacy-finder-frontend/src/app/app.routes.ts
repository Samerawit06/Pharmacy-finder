import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { CustomerDashboard } from './components/dashboard/customer-dashboard/customer-dashboard';
import { AdminDashboard } from './components/dashboard/admin-dashboard/admin-dashboard';
import { OwnerDashboard } from './components/dashboard/owner-dashboard/owner-dashboard';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { PrescriptionUpload } from './components/prescription-upload/prescription-upload';
import { PharmacySearch } from './components/pharmacy-search/pharmacy-search';
import { MedicineCompare } from './components/medicine-compare/medicine-compare';
import { AdminPharmacies } from './components/admin-pharmacies/admin-pharmacies';
import { ApprovalQueue } from './components/approval-queue/approval-queue';
//import { SystemOverview } from './components/system-overview/system-overview';
import { AuthGuard } from './guards/auth-guard';
import { RoleGuard } from './guards/role-guard';
//import { ApprovedPharmacies } from './components/approved-pharmacies/approved-pharmacies';
import { MyPharmacy } from './components/my-pharmacy/my-pharmacy';
import { MedicineInventory } from './components/medicine-inventory/medicine-inventory';
import { AddMedicine } from './components/add-medicine/add-medicine';
//import { Orders } from './components/orders/orders';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'admin',
        component: AdminDashboard,
        canActivate: [RoleGuard],
        data: { roles: ['Admin'] }
      },
      {
        path: 'owner',
        component: OwnerDashboard,
        canActivate: [RoleGuard],
        data: { roles: ['Owner'] }
      },
      {
        path: 'customer',
        component: CustomerDashboard,
        canActivate: [RoleGuard],
        data: { roles: ['Customer'] }
      },
      { path: '', redirectTo: 'customer', pathMatch: 'full' }
    ]
  },


  { path: 'prescription-upload', component: PrescriptionUpload, canActivate: [AuthGuard] },
  { path: 'pharmacy-search', component: PharmacySearch, canActivate: [AuthGuard] },
  { path: 'medicine-compare', component: MedicineCompare, canActivate: [AuthGuard] },


  {
    path: 'admin-pharmacies',
    loadComponent: () => import('./components/admin-pharmacies/admin-pharmacies')
      .then(m => m.AdminPharmacies),
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'approval-queue',
    loadComponent: () => import('./components/approval-queue/approval-queue')
      .then(m => m.ApprovalQueue),
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] }
  },
  //{
  //  path: 'approved-pharmacies',
  //  loadComponent: () => import('./components/approved-pharmacies/approved-pharmacies')
  //    .then(m => m.ApprovedPharmacies),
  //  canActivate: [RoleGuard],
  //  data: { roles: ['Admin'] }
  //},
  {
    path: 'add-pharmacy',
    loadComponent: () => import('./components/add-pharmacy/add-pharmacy')
      .then(m => m.AddPharmacy),
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'get-medicines',
    loadComponent: () => import('./components/get-medicines/get-medicines')
      .then(m => m.GetMedicines),
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] }
  },
  { path: 'my-pharmacy', component: MyPharmacy },
  { path: 'medicine-inventory', component: MedicineInventory },
  { path: 'add-medicine', component: AddMedicine },
  


  
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  
  { path: '**', redirectTo: 'dashboard' }
];
