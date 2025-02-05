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
  CurentDateTime =new Date().toISOString();
  serverDateFormat = AppConst.SERVER_DATE_FORMAT;
  nevigateToDash = false;
  is_back= false;
  timeStart = {hour: 13, minute: 30};
  timeEnd = {hour: 13, minute: 30};

  constructor(private formBuilder: FormBuilder, public service: VehicleService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router, private authService: AuthService) { }



  ngOnInit() {
    this.authService.checkLogin();
    this.resource_id = this.route.snapshot.paramMap.get("resource_id");
    this.resource_type = this.route.snapshot.paramMap.get("resource_type");
    const currentUser = this.authService.getAuthUser();
    this.userRole = currentUser.role;
    if (this.userRole == 'qc_data_entry') { this.isDataENtry = true }
    else { this.isDataENtry = false };

    this.is_renewal = <number><unknown>this.route.snapshot.paramMap.get("is_renewal");
    if (!this.is_renewal) {
      this.is_renewal = 0;
    }

    this.editVehicleDocumentForm = this.formBuilder.group({
      business_associate_id: ['', Validators.required],
      business_area_id: ['', Validators.required],
      road_tax_validity_date: ['', Validators.required],
      last_service_date: ['', ''],
      last_service_km: [''],
      km_at_induction: [''],
      permit_type: [''],
      registration_date: ['', Validators.required],
      status: [''],
      device_id: ['', Validators.required],
      gps_provider_id: ['', Validators.required],
      site_id: ['', Validators.required],
      induction_status: [''],
      comment: ['', ''],
      shift_start_time:['',Validators.required],
      shift_end_time:['',Validators.required],
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
      if (details['success'] == true) {
        console.log(details);
        this.vehicleDetails = details['data']['user_detail'];
        let pdfsDocs = details['data']['doc_list'];
        this.pdfs = pdfsDocs.filter(item => item.doc_url != null);
        console.log(this.pdfs);
        let road_tax_validity_date = this.vehicleDetails[0]['road_tax_validity_date'];
        let last_service_date = this.vehicleDetails[0]['last_service_date'];
        let registration_date = this.vehicleDetails[0]['registration_date'];
        let shift_start_time= this.vehicleDetails[0]['shift_start_time']  ;
        let shift_end_time = this.vehicleDetails[0]['shift_end_time'];
        console.log(shift_start_time);
        console.log(shift_end_time);
        let splitStartTime= shift_start_time == null ? null: shift_start_time.split(':').map(parseFloat);
        let splitEndTime= shift_end_time== null ? null : shift_end_time.split(':').map(parseFloat);

        console.log(road_tax_validity_date);
        console.log(last_service_date);
        console.log(registration_date);
        
        this.editVehicleDocumentForm.patchValue({
          business_associate_id: this.vehicleDetails[0]['business_associate_id'],
          business_area_id: this.vehicleDetails[0]['business_area_id'],
          road_tax_validity_date:road_tax_validity_date == null ? null :  new Date(road_tax_validity_date),
          last_service_date: last_service_date == null ? null :  new Date(last_service_date),
          last_service_km: this.vehicleDetails[0]['last_service_km'],
          km_at_induction: this.vehicleDetails[0]['km_at_induction'],
          permit_type: this.vehicleDetails[0]['permit_type'],
          registration_date: registration_date == null ? null :  new Date(registration_date),
          status: this.vehicleDetails[0]['status'],
          device_id: this.vehicleDetails[0]['device_id'],
          gps_provider_id: this.vehicleDetails[0]['gps_provider_id'],
          site_id: this.vehicleDetails[0]['site_id'],
          induction_status: this.vehicleDetails[0]['induction_status'],
          comment: this.vehicleDetails[0]['comment'],
          shift_start_time: shift_start_time == null ? this.timeStart : { hour:splitStartTime[0] , minute : splitStartTime[1] } ,
          shift_end_time: shift_end_time == null ? this.timeEnd : { hour:splitEndTime[0] , minute : splitEndTime[1] } , 
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
    });
  }

  getSiteList() {
    this.service.getSiteList().subscribe(res => {
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
    let rejected = this.pdfs.filter(i => i.status === 'Rejected')
    if(rejected.length > 0){
     this.saveDetails();
    }
   else{
    if (this.editVehicleDocumentForm.invalid) {
      this.toastr.error('Error', AppConst.FILL_MANDATORY_FIELDS);
      return;
    }
    else
    {
       this.saveDetails() ;
    }
   } 
    
   
  }
  pageNumberButtonClicked(index) {
    this.selectedPage = index;
  }

  onPreviousButtonClick(e) {
    if (this.selectedPage > 0) {
      this.selectedPage = this.selectedPage - 1;
    }
  }

  onNextButtonClick(e) {
    if (this.selectedPage < this.pdfs.length - 1) {
      this.selectedPage = this.selectedPage + 1;
    }
    
  }
  check_if_doc_is_pdf() {
    if (this.pdfs.length > this.selectedPage) {
      let docUrl = this.pdfs[this.selectedPage].doc_url
      if (docUrl && docUrl.includes('.pdf')) {
        return true;
      } else {
        return false;
      }
    }
  }
  sumbitVehicle() {
    if(this.isDataENtry){
      console.log(this.isDataENtry);
      let rejected = this.pdfs.filter(i => i.status === 'Rejected')
      if(rejected.length > 0){
        if (this.editVehicleDocumentForm.controls.comment.value == 'null') {
          this.toastr.error('Error', 'Select Rejection Reason');
          return;
        }
        else
        {
          this.editVehicleDocumentForm.patchValue({
            induction_status: 'Rejected'
          });
          this.nevigateToDash = true;
          this.onSubmit();
        }
      }
      else
      {
        this.nevigateToDash = true;
        this.onSubmit();
      }

    }
    else if (this.validateDocuments()) {
      this.nevigateToDash = true;
      this.onSubmit();
      
    }
  }
  validateDocuments() {
    let array = this.pdfs.filter(i => i.status === 'none')
    let rejected = this.pdfs.filter(i => i.status === 'Rejected')
    if (array.length > 0) {
      this.toastr.error('Error', 'Please approve or reject all documents: ');
      return false;
    } 
     if (rejected.length > 0) {
      this.editVehicleDocumentForm.patchValue({
        induction_status: 'Rejected'
      });
      if (this.editVehicleDocumentForm.controls.comment.value == 'null') {
        this.toastr.error('Error', 'Select Rejection Reason');
        return false;
      }
      return true;
    }
    else {
      this.editVehicleDocumentForm.patchValue({
        induction_status: 'Inducted'
      });
    }
    return true;
  }
  backToPersonal(resource_id) {
    this.is_back = true;
    this.saveDetails();
    
  }

  getFormattedDate(date) {
    //if (Object.prototype.toString.call(date) === "[object Date]") {
    if (date === null || date === 0 || date === '0000-00-00') {
      return null;
    }
    return date;
  }
  saveDetails(){
    
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
    let shift_start_time = this.editVehicleDocumentForm.controls.shift_start_time.value ;
    let shift_end_time = this.editVehicleDocumentForm.controls.shift_end_time.value;
    
    this.editVehicleDocumentForm.controls.shift_start_time.setValue((moment(shift_start_time).format('HH:mm')) == 'Invalid date' ? '00:00': (moment(shift_start_time).format('HH:mm')) );
    this.editVehicleDocumentForm.controls.shift_end_time.setValue((moment(shift_end_time).format('HH:mm'))== 'Invalid date' ? '00:00': (moment(shift_end_time).format('HH:mm')) );
    var user = {
      "session_id": 3403,
      "resource_id": +this.resource_id,
      "resource_type": this.resource_type,
      "os_type": 'web',
      is_renew: Number(this.is_renewal), // renewal - 1 ,  normal - 0
      is_final:true
    };
    let approvedDocsId = this.pdfs.filter(i => i.status === 'Approved').map(item => item.id).join(",");
    let rejectedDocsId = this.pdfs.filter(i => i.status === 'Rejected').map(item => item.id).join(",");
    let document = {
      "approvedDoc": approvedDocsId,
      "rejectedDdoc": rejectedDocsId,
      "comment": this.editVehicleDocumentForm.controls.comment.value
    };
  
    var data = { formData: this.editVehicleDocumentForm.value, document };
    this.vehicleUpdateData = { user, data };
    console.log(this.vehicleUpdateData);
    // update vehicle documents details
    this.service.updateVehicleDetails(this.vehicleUpdateData).subscribe(res => {
      console.log(res);
      if (res['success'] == true) {
        console.log('saved data');
        this.isEditModeOn = false;
        if (this.isEditModeOn) { this.valueOfButton = "Cancel" }
        else { this.valueOfButton = "Edit" }
        
        if(this.nevigateToDash){
        this.router.navigate(['/dashboard']);
        }
        else if(this.is_back)
        {
          this.router.navigate(['/vehicle-personal', { 'resource_id': this.resource_id, 'resource_type': 'vehicles',
          'is_renewal': this.is_renewal }]);
        }
        else
        {
          this.toastr.success('Success', 'Vehicle details submitted successfully');
          this.fetchVehicleData();
        }
      }
      else {
        this.toastr.error('Error', res['message']);
      }
    }, errorResponse => {
      this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG)
    });
  }
}
