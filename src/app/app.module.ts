import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppRoutingModule } from './app-routing/app-routing.module';
import {NgxPaginationModule} from 'ngx-pagination';
import { AppComponent } from './app.component';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { DriverBusinessComponent } from './views/driver-business/driver-business.component';
import { DriverPersonalComponent } from './views/driver-personal/driver-personal.component';
import { DriverDocumentComponent } from './views/driver-document/driver-document.component';
import { VehiclePersonalComponent } from './views/vehicle-personal/vehicle-personal.component';
import { VehicleDocumentComponent } from './views/vehicle-document/vehicle-document.component';
import { SearchPipe } from './search.pipe';
import { MenuComponent } from './menu/menu.component';
import { HeaderComponent } from './header/header.component';


//Http-Intersepter -- To add header to each http request

import { HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';


import { AuthInterceptor } from './http-interceptors/auth-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    DriverBusinessComponent,
    DriverPersonalComponent,
    DriverDocumentComponent,
    VehiclePersonalComponent,
    VehicleDocumentComponent,
    SearchPipe,
    MenuComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxPaginationModule,
    MalihuScrollbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { 
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor, 
      multi: true 
    }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
