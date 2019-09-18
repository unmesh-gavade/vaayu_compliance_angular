import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import {DriverService} from '../../services/driver.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';
import {Router, ActivatedRoute} from "@angular/router";
import { AppConst } from 'src/app/const/appConst';

@Component({
  selector: 'app-driver-document',
  templateUrl: './driver-document.component.html',
  styleUrls: ['./driver-document.component.sass']
})
export class DriverDocumentComponent implements OnInit {
  zoom: number = 1.0;
  pdfSrc: string = './assets/images/myfile.pdf';
  pdfs: any[] = [];
  valueOfButton = "Edit";
  isEditModeOn = false;
  isDropup = true;
  imageURL="./assets/img/Doc.jpg";
  editDriverDocumentForm: FormGroup;
  submitted = false;
  driverDetails : object;
  driverPostData : {};
  driverUpdateData:{};
  resource_id:String;
  resource_type:String;
  userRole:String;
  isDataENtry=false;
  selectedPage = 0
  pdfsDocs:any[]=[];
  
  constructor(private formBuilder: FormBuilder, public Driver: DriverService, private toastr:ToastrService, private route: ActivatedRoute, private router: Router,private authService: AuthService) { }

  ngOnInit() {
    this.authService.checkLogin();
    this.resource_id = this.route.snapshot.paramMap.get("resource_id");
    this.resource_type = this.route.snapshot.paramMap.get("resource_type");
    const currentUser = this.authService.getAuthUser();
    this.userRole= currentUser.role;
    if(this.userRole == 'data_entry'){this.isDataENtry=true}
    else{this.isDataENtry=false};
    
    this.editDriverDocumentForm = this.formBuilder.group({
      txtPoliceVerification: [''],
      police_verification_vailidty: [''],
      date_of_police_verification: [''],
      criminal_offence: [''],
      bgc_date:[''],
      bgc_agency_id:[''],
      medically_certified_date:[''],
      sexual_policy: ['', Validators.required],
   });
   var user = {
    "resource_id": + this.resource_id,
    "resource_type":this.resource_type,
    "os_type":'web'
 }
  this.driverPostData = {user};
  this.Driver.getDriverDetails(this.driverPostData).subscribe(details=>{
    if (details['success'] == true) {
    this.driverDetails = details['data']['user_detail'];
    this.pdfsDocs = details['data']['doc_list'];
    this.pdfs = this.pdfsDocs.filter(item=> item.doc_url != null);  
    console.log(this.driverDetails);
    console.log(this.driverDetails[0]['aadhaar_number']);
    this.editDriverDocumentForm.patchValue({
      txtPoliceVerification: this.driverDetails[0]['txtPoliceVerification'],
      police_verification_vailidty: this.driverDetails[0]['police_verification_vailidty'],
      date_of_police_verification:  this.driverDetails[0]['date_of_police_verification'],
      criminal_offence: this.driverDetails[0]['criminal_offence'],
      bgc_date:  moment(this.driverDetails[0]['bgc_date']).format("YYYY-MM-DD"),
      bgc_agency_id: this.driverDetails[0]['bgc_agency_id'],
      medically_certified_date:  moment(this.driverDetails[0]['medically_certified_date']).format("YYYY-MM-DD"),
      sexual_policy:  this.driverDetails[0]['sexual_policy'],
   });
  }
  else{
    this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG);
  }
   }, errorResponse => {
    this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG);
  });
  }
  
incrementZoom(amount: number) {
  this.zoom += amount;   }
  onEdit() {
    this.isEditModeOn = ! this.isEditModeOn;
    if(this.isEditModeOn){this.valueOfButton = "Cancel"}
    else{this.valueOfButton= "Edit"}
        return;
    }
    ShowImage(path){
     this.imageURL= path; 
    }
    // convenience getter for easy access to form fields
   get f() { return this.editDriverDocumentForm.controls; }

  onSubmit() {

    this.submitted = true;

    var values = this.editDriverDocumentForm.value;
    // stop here if form is invalid
    if (this.editDriverDocumentForm.invalid) {
    
        return;
    }
    this.editDriverDocumentForm.patchValue({
      txtPoliceVerification: values.txtPoliceVerification,
      police_verification_vailidty: values.police_verification_vailidty,
      date_of_police_verification:  values.date_of_police_verification,
      criminal_offence: values.criminal_offence,
      bgc_date:   moment(values.bgc_date).format("YYYY-MM-DD"),
      bgc_agency_id:values.bgc_agency_id,
      medically_certified_date:   moment(values.medically_certified_date).format("YYYY-MM-DD"),
      sexual_policy:  values.sexual_policy,
    });
    var user = {
      "session_id":3403,
      "resource_id": +this.resource_id,
      "resource_type": this.resource_type,
      "os_type": 'web'
    };
    let approvedDocsList = this.pdfs.filter(i => i.status === 'approved').map(item=>item.id);
    let rejectedDocsList= this.pdfs.filter(i => i.status === 'rejected').map(item=>item.id);
      var document={
        "approved_doc":approvedDocsList,
        "rejected_doc":rejectedDocsList,
        "comment":'test'
      };
    var formData={};
    var data={formData:this.editDriverDocumentForm.value,document};
    this.driverUpdateData ={user,data};
    console.log(this.driverUpdateData);
    // update driver Documents details
    this.Driver.updateDriverDetails(this.driverUpdateData).subscribe(res => {
      if (res['success'] == true) {
      console.log(this.isEditModeOn);
      this.isEditModeOn=false;
      if(this.isEditModeOn){this.valueOfButton = "Cancel"}
      else{this.valueOfButton= "Edit"}
      this.toastr.success('Success', 'Driver Documents Details updated successfully');
      }
      else{
        this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG);
      }
    }, errorResponse => {
      this.toastr.error('Error',AppConst.SOMETHING_WENT_WRONG);
    });
  }
  backToPersonal(resource_id)
    {
      console.log(resource_id);
      this.router.navigate(['/driver-business' ,{'resource_id':resource_id,'resource_type':'drivers' }]);  
    }
    // saveDocsStatus(resource_id)
    // {
    //   this.validateDocuments();
    //   this.onSubmit();
    //   this.router.navigate(['/driver-document' ,{'resource_id':resource_id,'resource_type':'drivers' }]);      
    // }
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
  sumbitDriver()
  {
   if(this.validateDocuments()) 
   {
    this.onSubmit();
   }
   else
   {

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
