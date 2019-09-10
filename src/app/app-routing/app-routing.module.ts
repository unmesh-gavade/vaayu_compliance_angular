import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../views/login/login.component';
import { DashboardComponent } from '../views/dashboard/dashboard.component';
import { DriverBusinessComponent } from '../views/driver-business/driver-business.component';
import { DriverPersonalComponent } from '../views/driver-personal/driver-personal.component';
import { DriverDocumentComponent } from '../views/driver-document/driver-document.component';
import { VehiclePersonalComponent } from '../views/vehicle-personal/vehicle-personal.component';
import { VehicleDocumentComponent } from '../views/vehicle-document/vehicle-document.component';
import { AppComponent } from '../app.component';
import { DefaultLayoutComponent } from '../containers/default-layout';


const routes: Routes = [
  { 
    path: 'login', component: LoginComponent,
    data: {
    title: 'Login'
  } },
  {
    path: 'dashboard',
    component: DefaultLayoutComponent,
    data: {
      title: 'Dashboard'
    },
    children: [
      {
        path: '',
        component:  DashboardComponent
      },
    ]
  },
  {
    path: 'driver-personal',
    component: DefaultLayoutComponent,
    data: {
      title: 'driver-personal'
    },
    children: [
      {
        path: '',
        component:  DriverPersonalComponent
      },
    ]
  },
  {
    path: 'driver-business',
    component: DefaultLayoutComponent,
    data: {
      title: 'driver-business'
    },
    children: [
      {
        path: '',
        component:  DriverBusinessComponent
      },
    ]
  },
  {
    path: 'driver-document',
    component: DefaultLayoutComponent,
    data: {
      title: 'driver-document'
    },
    children: [
      {
        path: '',
        component:  DriverDocumentComponent
      },
    ]
  },
  {
    path: 'vehicle-personal',
    component: DefaultLayoutComponent,
    data: {
      title: 'vehicle-personal'
    },
    children: [
      {
        path: '',
        component:  VehiclePersonalComponent
      },
    ]
  },
  {
    path: 'vehicle-document',
    component: DefaultLayoutComponent,
    data: {
      title: 'vehicle-document'
    },
    children: [
      {
        path: '',
        component:  VehicleDocumentComponent
      },
    ]
  },
  { path:'**', component: LoginComponent}
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
