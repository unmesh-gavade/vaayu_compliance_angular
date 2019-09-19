import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import { VehicleService } from '../../services/vehicle.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from "@angular/router";
import { AppConst } from 'src/app/const/appConst';

@Component({
  selector: 'app-vehicle-document',
  templateUrl: './vehicle-document.component.html',
  styleUrls: ['./vehicle-document.component.sass']
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
  pdfDocs: {};
  vehicleUpdateData: {};
  resource_id: String;
  resource_type: String;
  userRole: String;
  isDataENtry = false;
  pdfsDocs: any[] = [];
  selectedPage = 0;

  constructor(private formBuilder: FormBuilder, public Vehicle: VehicleService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router, private authService: AuthService) { }



  ngOnInit() {
    this.authService.checkLogin();
    this.resource_id = this.route.snapshot.paramMap.get("resource_id");
    this.resource_type = this.route.snapshot.paramMap.get("resource_type");
    const currentUser = this.authService.getAuthUser();
    this.userRole = currentUser.role;
    if (this.userRole == 'data_entry') { this.isDataENtry = true }
    else { this.isDataENtry = false };

    this.editVehicleDocumentForm = this.formBuilder.group({
      business_associate_id: ['', Validators.required],
      business_area_id: ['', Validators.required],
      road_tax_validity_date: ['', Validators.required],
      last_service_date: ['', Validators.required],
      last_service_km: ['', Validators.required],
      km_at_induction: ['', Validators.required],
      permit_type: ['', Validators.required],
      date_of_registration: ['', Validators.required],
      status: ['', Validators.required],
      device_id: ['', Validators.required],
      gps_provider_id: ['', Validators.required],
      site_name: ['', Validators.required],
      induction_status:['', ''],
    });
    var user = {
      "resource_id": + this.resource_id,
      "resource_type": this.resource_type,
      "os_type": 'web'
    }
    this.vehiclePostData = { user };
    console.log(this.vehiclePostData);
    this.Vehicle.getVehicleDetails(this.vehiclePostData).subscribe(details => {
      if (details['success'] == true) {
        this.vehicleDetails = details['data']['user_detail'];
        this.pdfsDocs = details['data']['doc_list'];
        console.log('pDF without filter');
        console.log(this.pdfsDocs);
        this.pdfs = this.pdfsDocs.filter(item => item.doc_url != null);
        console.log('in pdfs');
        console.log('doc count = ' + this.pdfs.length);
        console.log(this.pdfs);
        this.editVehicleDocumentForm.patchValue({
          business_associate_id: this.vehicleDetails[0]['business_associate_id'],
          business_area_id: this.vehicleDetails[0]['business_area_id'],
          road_tax_validity_date: this.vehicleDetails[0]['road_tax_validity_date'],
          last_service_date: this.vehicleDetails[0]['last_service_date'],
          last_service_km: this.vehicleDetails[0]['last_service_km'],
          km_at_induction: this.vehicleDetails[0]['km_at_induction'],
          permit_type: this.vehicleDetails[0]['permit_type'],
          date_of_registration: this.vehicleDetails[0]['date_of_registration'],
          status: this.vehicleDetails[0]['status'],
          device_id: this.vehicleDetails[0]['device_id'],
          gps_provider_id: this.vehicleDetails[0]['gps_provider_id'],
          site_name: this.vehicleDetails[0]['site_name'],
          induction_status: this.vehicleDetails[0]['induction_status']
        });
      }
      else {
        this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG);
      }
    }, errorResponse => {
      this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG);
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

      return;
    }
    this.editVehicleDocumentForm.patchValue({
      business_associate_id: values.business_associate_id,
      business_area_id: values.business_area_id,
      road_tax_validity_date: values.road_tax_validity_date,
      last_service_date: values.last_service_date,
      last_service_km: values.last_service_km,
      km_at_induction: values.km_at_induction,
      permit_type: values.permit_type,
      date_of_registration: values.date_of_registration,
      status: values.status,
      device_id: values.device_id,
      gps_provider_id: values.gps_provider_id,
      site_name: values.site_name,
      induction_status:values.induction_status 


    });
    var user = {
      "session_id": 3403,
      "resource_id": +this.resource_id,
      "resource_type": this.resource_type,
      "os_type": 'web'
    };
    let ApprovedDocsId = '';
    let RejectedDocsId='';
     let approvedDocsList= this.pdfs.filter(i => i.status === 'approved').map(item=>item.id);
     ApprovedDocsId = approvedDocsList.join(",");
   console.log(ApprovedDocsId);
    let rejectedDocsList= this.pdfs.filter(i => i.status === 'rejected').map(item=>item.id);
      RejectedDocsId = rejectedDocsList.join(",");
   console.log(RejectedDocsId);
    var document = {
      "approvedDoc":ApprovedDocsId,
      "rejectedDdoc":RejectedDocsId,
      "comment": 'test'
    };
    var formData = {};
    var data = { formData: this.editVehicleDocumentForm.value,document };
    this.vehicleUpdateData = { user, data };
    console.log(this.vehicleUpdateData);
    // update vehicle documents details
    this.Vehicle.updateVehicleDetails(this.vehicleUpdateData).subscribe(res => {
      console.log(res);

      if (res['success'] == true) {
        console.log(this.isEditModeOn);
        this.isEditModeOn = false;
        if (this.isEditModeOn) { this.valueOfButton = "Cancel" }
        else { this.valueOfButton = "Edit" }
        this.toastr.success('Success', 'Vehicle Documents Details updated successfully');
      }
      else {
        this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG);
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

  onNextButtonClick() {
    if (this.selectedPage < this.pdfs.length - 1) {
      this.selectedPage = this.selectedPage + 1;
    }
    console.log('page number = ' + this.selectedPage);
  }
  sumbitVehicle() {
    if (this.validateDocuments()) {
      this.onSubmit();
    }
    else {

    }
  }
  validateDocuments() {
    let array = this.pdfs.filter(i => i.status === 'none')
    console.log(array);
    let docsName = '';
    array.map(i => {
      docsName += i.doc_display_name + "- ";
    })
    if (array.length > 0) {
      this.toastr.error('Error', 'Please approve or reject all documents: ' + docsName);
      return false;
    }
    return true;
  }
  backToPersonal(resource_id) {
    console.log(resource_id);
    this.router.navigate(['/vehicle-personal', { 'resource_id': resource_id, 'resource_type': 'vehicles' }]);
  }
}
