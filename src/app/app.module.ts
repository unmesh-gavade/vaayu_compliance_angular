import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { DriverBusinessComponent } from './views/driver-business/driver-business.component';
import { DriverPersonalComponent } from './views/driver-personal/driver-personal.component';
import { DriverDocumentComponent } from './views/driver-document/driver-document.component';
import { VehiclePersonalComponent } from './views/vehicle-personal/vehicle-personal.component';
import { VehicleDocumentComponent } from './views/vehicle-document/vehicle-document.component';
import { HeaderComponent } from './views/header/header.component';
import { MenuComponent } from './views/menu/menu.component';
import { SearchPipe } from './search.pipe';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    DriverBusinessComponent,
    DriverPersonalComponent,
    DriverDocumentComponent,
    VehiclePersonalComponent,
    VehicleDocumentComponent,
    HeaderComponent,
    MenuComponent,
    SearchPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),
    FormsModule,ReactiveFormsModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
