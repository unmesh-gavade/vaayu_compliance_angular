import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { DriverBusinessComponent } from './views/driver-business/driver-business.component';
import { DriverPersonalComponent } from './views/driver-personal/driver-personal.component';
import { DriverDocumentComponent } from './views/driver-document/driver-document.component';
import { VehicleBusinessComponent } from './views/vehicle-business/vehicle-business.component';
import { VehicleDocumentComponent } from './views/vehicle-document/vehicle-document.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    DriverBusinessComponent,
    DriverPersonalComponent,
    DriverDocumentComponent,
    VehicleBusinessComponent,
    VehicleDocumentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
