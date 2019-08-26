import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../views/dashboard/dashboard.component';
import { DriverBusinessComponent } from '../views/driver-business/driver-business.component';
import { DriverPersonalComponent } from '../views/driver-personal/driver-personal.component';
import { DriverDocumentComponent } from '../views/driver-document/driver-document.component';
import { VehiclePersonalComponent } from '../views/vehicle-personal/vehicle-personal.component';
import { VehicleDocumentComponent } from '../views/vehicle-document/vehicle-document.component';

const routes: Routes = [
  { path: 'driver-personal', component: DriverPersonalComponent },
  { path: 'driver-business', component: DriverBusinessComponent },
  { path: 'driver-document', component: DriverDocumentComponent },
  { path: 'vehicle-personal', component: VehiclePersonalComponent },
  { path: 'vehicle-document', component: VehicleDocumentComponent },
  {
    path: 'Dashbord',
    component: DashboardComponent,
    data: {
      title: 'Dashbord'
    }
  },
  { path:'**', component: DashboardComponent}
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
