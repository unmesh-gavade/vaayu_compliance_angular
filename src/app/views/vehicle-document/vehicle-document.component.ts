import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import { VehicleService } from '../../services/vehicle.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from "@angular/router";
import { AppConst } from 'src/app/const/appConst';
import { NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-vehicle-document',
  templateUrl: './vehicle-document.component.html',
  styleUrls: ['./vehicle-document.component.sass'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class VehicleDocumentComponent implements OnInit {

  zoom: number = 1.0;
  originalSize: boolean = true;
  pdfSrc: string = './assets/images/myfile.pdf';
  pdfs: any[] = [];
  valueOfButton = "Edit";
  isEditModeOn = false;
  isDropup = true;
  imageURL = "./assets/img/Doc.jpg";
  editVehicleDocumentForm: FormGroup;
  submitted = false;
  vehicleDetails: object;
  vehiclePostData: {};
  vehicleUpdateData: {};
  resource_id: String;
  resource_type: String;
  userRole: String;
  isDataENtry = false;

  selectedPage = 0;
  baList = [];
  siteList = [];
  road_tax_validity_date_model: Date;
  registration_date_model: Date;
  last_service_date_model: Date;
  is_renewal = 0;

  constructor(private formBuilder: FormBuilder, public service: VehicleService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router, private authService: AuthService) { }



  ngOnInit() {
    this.authService.checkLogin();
    this.resource_id = this.route.snapshot.paramMap.get("resource_id");
    this.resource_type = this.route.snapshot.paramMap.get("resource_type");
    const currentUser = this.authService.getAuthUser();
    this.userRole = currentUser.role;
    if (this.userRole == 'data_entry') { this.isDataENtry = true }
    else { this.isDataENtry = false };

    this.is_renewal = <number><unknown>this.route.snapshot.paramMap.get("is_renewal");
    if (!this.is_renewal) {
      this.is_renewal = 0;
    }

    this.editVehicleDocumentForm = this.formBuilder.group({
      business_associate_id: ['', Validators.required],
      business_area_id: ['', Validators.required],
      road_tax_validity_date: ['', Validators.required],
      last_service_date: ['', Validators.required],
      last_service_km: [''],
      km_at_induction: [''],
      permit_type: [''],
      registration_date: ['', Validators.required],
      status: [''],
      device_id: ['', Validators.required],
      gps_provider_id: ['', Validators.required],
      site_id: ['', Validators.required],
      induction_status: [''],
      comment: [null, Validators.required],
    });
    this.fetchVehicleData();
    this.getBAListing();
    this.getSiteList();
  }

  fetchVehicleData () {
    var user = {
      "resource_id": + this.resource_id,
      "resource_type": this.resource_type,
      "os_type": 'web',
      is_renew: Number(this.is_renewal), // renewal - 1 ,  normal - 0
    }
    this.vehiclePostData = { user };

    this.service.getVehicleDetails(this.vehiclePostData).subscribe(details => {
      console.log(JSON.stringify(details));
      if (details['success'] == true) {
        this.vehicleDetails = details['data']['user_detail'];
        let pdfsDocs = details['data']['doc_list'];
        this.pdfs = pdfsDocs.filter(item => item.doc_url != null);

        this.editVehicleDocumentForm.patchValue({
          business_associate_id: this.vehicleDetails[0]['business_associate_id'],
          business_area_id: this.vehicleDetails[0]['business_area_id'],
          road_tax_validity_date: new Date(this.vehicleDetails[0]['road_tax_validity_date']),
          last_service_date: this.vehicleDetails[0]['last_service_date'],
          last_service_km: this.vehicleDetails[0]['last_service_km'],
          km_at_induction: this.vehicleDetails[0]['km_at_induction'],
          permit_type: this.vehicleDetails[0]['permit_type'],
          registration_date: new Date(this.vehicleDetails[0]['registration_date']),
          status: this.vehicleDetails[0]['status'],
          device_id: this.vehicleDetails[0]['device_id'],
          gps_provider_id: this.vehicleDetails[0]['gps_provider_id'],
          site_id: this.vehicleDetails[0]['site_id'],
          induction_status: this.vehicleDetails[0]['induction_status']
        });
      }
      else {
        this.toastr.error('Error', details['message']);
      }
    }, errorResponse => {
      this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG);
    });
  }

  getBAListing() {
    this.service.getBaList().subscribe(res => {
      this.baList = res['data']['list'];
      // console.log('getBaList  = '+ JSON.stringify(this.baList))
    });
  }

  getSiteList() {
    this.service.getSiteList({
      'Content-Type': 'application/json',
    }).subscribe(res => {
      console.log('sitelist'+JSON.stringify(res));
      this.siteList = res['data']['list'];
    });
  }

  incrementZoom(amount: number) {
    this.zoom += amount;
  }
  onEdit() {
    this.isEditModeOn = !this.isEditModeOn;
    if (this.isEditModeOn) { this.valueOfButton = "Cancel" }
    else { this.valueOfButton = "Edit" }
    console.log(this.isEditModeOn);
    return;
  }
  ShowImage(path) {
    this.imageURL = path;
  }
  // convenience getter for easy access to form fields
  get f() { return this.editVehicleDocumentForm.controls; }

  onSubmit() {
    this.submitted = true;

    var values = this.editVehicleDocumentForm.value;
   
    
    // stop here if form is invalid
    if (this.editVehicleDocumentForm.invalid) {
      if (this.editVehicleDocumentForm)
      console.log('form is invalid')
      console.log(this.editVehicleDocumentForm.controls)
      this.toastr.error('Error', AppConst.FILL_MANDATORY_FIELDS);
      return;
    }
    // this.editVehicleDocumentForm.patchValue({
    //   business_associate_id: values.business_associate_id,
    //   business_area_id: values.business_area_id,
    //   road_tax_validity_date: values.road_tax_validity_date,
    //   last_service_date: values.last_service_date,
    //   last_service_km: values.last_service_km,
    //   km_at_induction: values.km_at_induction,
    //   permit_type: values.permit_type,
    //   registration_date: values.registration_date,
    //   status: values.status,
    //   device_id: values.device_id,
    //   gps_provider_id: values.gps_provider_id,
    //   site_id: values.site_id
    // });
    var user = {
      "session_id": 3403,
      "resource_id": +this.resource_id,
      "resource_type": this.resource_type,
      "os_type": 'web',
      is_renew: Number(this.is_renewal), // renewal - 1 ,  normal - 0
    };
    let approvedDocsId = this.pdfs.filter(i => i.status === 'Approved').map(item => item.id).join(",");
    let rejectedDocsId = this.pdfs.filter(i => i.status === 'Rejected').map(item => item.id).join(",");
    console.log('approvedDocsId = ' + JSON.stringify(approvedDocsId));
    console.log('rejectedDocsId = '+JSON.stringify(rejectedDocsId));
    let document = {
      "approvedDoc": approvedDocsId,
      "rejectedDdoc": rejectedDocsId,
      "comment": 'test'
    };
  
    var data = { formData: this.editVehicleDocumentForm.value, document };
    this.vehicleUpdateData = { user, data };
    console.log(JSON.stringify(this.vehicleUpdateData));
    // update vehicle documents details
    this.service.updateVehicleDetails(this.vehicleUpdateData).subscribe(res => {
      console.log(JSON.stringify(res));
      if (res['success'] == true) {
        console.log(this.isEditModeOn);
        this.isEditModeOn = false;
        if (this.isEditModeOn) { this.valueOfButton = "Cancel" }
        else { this.valueOfButton = "Edit" }
        this.toastr.success('Success', 'Vehicle Details submitted successfully');
        this.router.navigate(['/dashboard']);      
      }
      else {
        this.toastr.error('Error', res['message']);
      }
    }, errorResponse => {
      this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG)
    });


  }
  pageNumberButtonClicked(index) {
    console.log('page number = ' + index);
    this.selectedPage = index;
  }

  onPreviousButtonClick() {
    if (this.selectedPage > 0) {
      this.selectedPage = this.selectedPage - 1;
    }
    console.log('page number = ' + this.selectedPage);
  }

  onNextButtonClick($event) {
    if (this.selectedPage < this.pdfs.length - 1) {
      this.selectedPage = this.selectedPage + 1;
    }
    console.log('page number = ' + this.selectedPage);
    
  }
  sumbitVehicle() {
    if (this.validateDocuments()) {
      this.onSubmit();
      this.router.navigate(['/dashboard']);
    }
  }
  validateDocuments() {
    
    let array = this.pdfs.filter(i => i.status === 'none')
    let rejected = this.pdfs.filter(i => i.status === 'Rejected')
    if (array.length > 0) {
      this.toastr.error('Error', 'Please approve or reject all documents: ');
      return false;
    } else if (rejected.length > 0 && this.editVehicleDocumentForm.controls.comment.invalid) {
      this.toastr.error('Error', 'Select Rejection Reason');
      this.editVehicleDocumentForm.patchValue({
        induction_status: 'Rejected'
      });
      return false;
    } else {
      this.editVehicleDocumentForm.patchValue({
        induction_status: 'Approved'
      });
    }
    return true;
  }
  backToPersonal(resource_id) {
    console.log(resource_id);
    this.router.navigate(['/vehicle-personal', { 'resource_id': resource_id, 'resource_type': 'vehicles',
    'is_renewal': this.is_renewal }]);
  }

  getFormattedDate(date) {
    if (date === null || date === 0 || date === '0000-00-00') {
      return null;
    }
    return date;
  }
}
