import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import { VehicleService } from '../../services/vehicle.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from "@angular/router";
import { AppConst } from 'src/app/const/appConst';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-vehicle-business',
  templateUrl: './vehicle-personal.component.html',
  styleUrls: ['./vehicle-personal.component.sass']
})
export class VehiclePersonalComponent implements OnInit {
  zoom: number = 1.0;
  pdfSrc: string = './assets/images/myfile.pdf';
  pdfs: any[] = [];
  valueOfButton = "Edit";
  isEditModeOn = false;
  isDropup = true;
  imageURL = "./assets/img/Doc.jpg";
  editVehiclePersonalForm: FormGroup;
  submitted = false;
  vehicleDetails: object;
  vehiclePostData: {};
  vehicleUpdateData: {};
  resource_id: String;
  resource_type: String;
  userRole:String;
  isDataENtry=false;
  selectedPage = 0;
  pdfsDocs:any[]=[];

  constructor(private formBuilder: FormBuilder, public Vehicle: VehicleService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.authService.checkLogin();
    const currentUser = this.authService.getAuthUser();
    this.userRole= currentUser.role;
    if(this.userRole == 'data_entry'){this.isDataENtry=true}
    else{this.isDataENtry=false};
    this.resource_id = this.route.snapshot.paramMap.get("resource_id");
    this.resource_type = this.route.snapshot.paramMap.get("resource_type");
    this.editVehiclePersonalForm = this.formBuilder.group({
      plate_number: ['',Validators.required],
category: ['',Validators.required],
model: ['',Validators.required],
seats: ['',Validators.required],
colour: ['',Validators.required],
make_year: ['',Validators.required],
registration_date: ['',Validators.required],
insurance_date: ['',Validators.required],
puc_validity_date: ['',Validators.required],
fitness_validity_date: ['',Validators.required],
permit_validity_date: ['',Validators.required],
ac: ['',Validators.required],
fuel_type: ['',Validators.required],
induction_status:['', ''],   

    });
    var user = {
      "resource_id": + this.resource_id,
      "resource_type": this.resource_type, 
      "os_type":'web'
    }
    this.vehiclePostData = { user };

    this.Vehicle.getVehicleDetails(this.vehiclePostData).subscribe(details => {
      
      if (details['success'] == true) {
        console.log(details);
        this.vehicleDetails = details['data']['user_detail'];
        this.pdfsDocs = details['data']['doc_list'];        
        this.pdfs = this.pdfsDocs.filter(item=> item.doc_url != null && item.doc_type ==='business');  
        this.editVehiclePersonalForm.patchValue({
          plate_number:  this.vehicleDetails[0]['plate_number'],
category:  this.vehicleDetails[0]['category'],
model:  this.vehicleDetails[0]['model'],
seats:  this.vehicleDetails[0]['seats'],
colour:  this.vehicleDetails[0]['colour'],
make_year:  this.vehicleDetails[0]['make_year'],
registration_date:  this.vehicleDetails[0]['registration_date'],
insurance_date:  this.vehicleDetails[0]['insurance_date'],
puc_validity_date:  this.vehicleDetails[0]['puc_validity_date'],
fitness_validity_date:  this.vehicleDetails[0]['fitness_validity_date'],
permit_validity_date:  this.vehicleDetails[0]['permit_validity_date'],
ac:  this.vehicleDetails[0]['ac'],
fuel_type:  this.vehicleDetails[0]['fuel_type'],
induction_status: this.vehicleDetails[0]['induction_status']
        });
      }
      else {
        this.toastr.error('Error', 'Something Went Wrong.');
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
  get f() { return this.editVehiclePersonalForm.controls; }

  onSubmit() {
    this.submitted = true;

    var values = this.editVehiclePersonalForm.value;
    // stop here if form is invalid
    if (this.editVehiclePersonalForm.invalid) {

      return;
    }

    this.editVehiclePersonalForm.patchValue({
      plate_number:  values.plate_number,
category:  values.category,
model:  values.model,
seats:  values.seats,
colour:  values.colour,
make_year:  values.make_year,
registration_date:  values.registration_date,
insurance_date:  values.insurance_date,
puc_validity_date:  values.puc_validity_date,
fitness_validity_date:  values.fitness_validity_date,
permit_validity_date: values.permit_validity_date,
ac:  values.ac,
fuel_type:  values.fuel_type,
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
    var document={
      "approvedDoc":ApprovedDocsId,
      "rejectedDdoc":RejectedDocsId,
      "comment":'test'
    };
    var formData = {};
    var data = { formData: this.editVehiclePersonalForm.value };
    this.vehicleUpdateData = { user, data, document };
    console.log(this.vehicleUpdateData);
    // update vehicle personal details
    this.Vehicle.updateVehicleDetails(this.vehicleUpdateData).subscribe(res => {
      console.log(res);
      if (res['success'] === true) {
        this.isEditModeOn = false;
        if (this.isEditModeOn) { this.valueOfButton = "Cancel" }
        else { this.valueOfButton = "Edit" }
        this.toastr.success('Success', 'Vehicle Personal Details updated successfully');
      }
      else {
        
      }
    }, errorResponse => {
      this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG);
    });

  }
  saveDocsStatus(resource_id) {
    this.validateDocuments();
    this.onSubmit();
     this.router.navigate(['/vehicle-document', { 'resource_id': resource_id, 'resource_type': 'vehicles' }]);
  }


  pageNumberButtonClicked(index) {
    console.log('page number = '+ index);
    this.selectedPage = index; 
  }

  onPreviousButtonClick () { 
    if (this.selectedPage > 0) {
      this.selectedPage = this.selectedPage-1;
    } 
    console.log('page number = '+ this.selectedPage);
  }

  onNextButtonClick () { 
    if (this.selectedPage < this.pdfs.length-1) {
      this.selectedPage = this.selectedPage+1;
    } 
    console.log('page number = '+ this.selectedPage);
  }

  check_if_doc_is_pdf (docUrl) {
    if (docUrl.includes('.pdf')) {
      return true;
    } else {
      return false;
    }
  }

  validateDocuments()
  {
   let array = this.pdfs.filter(i => i.status === 'none')
   console.log(array);
   let docsName = '';
   array.map(i => {
     docsName += i.doc_display_name + "- ";
   })
   if (array.length > 0) {
     this.toastr.error('Error', 'Please approve or reject all documents: '+ docsName);
     return false;
   }
   return true;
  }
}
