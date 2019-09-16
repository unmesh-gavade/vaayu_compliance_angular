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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DefaultLayoutComponent } from './containers/default-layout';
import { ToastrModule } from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';



//Http-Intersepter -- To add header to each http request

import { HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';


import { AuthInterceptor } from './http-interceptors/auth-interceptor';
import { LoginComponent } from './views/login/login.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
const APP_CONTAINERS = [
  DefaultLayoutComponent
];

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
    HeaderComponent,
    LoginComponent,
    DefaultLayoutComponent,
    DateFormatPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxPaginationModule,
    NgbModule,
    PdfViewerModule,
    MalihuScrollbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
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