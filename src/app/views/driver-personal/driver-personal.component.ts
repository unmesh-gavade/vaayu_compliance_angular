import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import * as $ from 'jquery';
import {DriverService} from '../../services/driver.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import {Router, ActivatedRoute} from "@angular/router";
import { AuthService } from '../../auth/auth.service';
import { AppConst } from 'src/app/const/appConst';

@Component({
  selector: 'app-driver-personal',
  templateUrl: './driver-personal.component.html',
  styleUrls: ['./driver-personal.component.sass']
})
export class DriverPersonalComponent implements OnInit {
  zoom: number = 1.0;
  //pdfSrc: string = './assets/images/myfile.pdf';
  pdfs: any[] = [];
  pdfsDocs:any[]=[];
  valueOfButton = "Edit";
  isEditModeOn = false;
  isDropup = true;
  imageURL="./assets/img/Doc.jpg";
  editDriverPersonalForm: FormGroup;
  submitted = false;
  driverDetails : object;
  driverPostData : {};
  driverUpdateData:{};
  resource_id:String;
  resource_type:String;
  userRole:String;
  isDataENtry=false;
  selectedPage = 0;
  approvedDocsList: Array<{ID: number,status: string}> = []; 
  rejectedDocsList:Array<{ID: number,status: string}>=[];
  
  constructor(private formBuilder: FormBuilder, public Driver: DriverService, private toastr:ToastrService, private route: ActivatedRoute, private router: Router,private authService: AuthService) { }

  ngOnInit() {
    //this.authService.checkLogin();
    const currentUser = this.authService.getAuthUser();
    this.userRole= currentUser.role;
    if(this.userRole == 'data_entry'){this.isDataENtry=true}
    else{this.isDataENtry=false};
     this.resource_id = this.route.snapshot.paramMap.get("resource_id");
    this.resource_type = this.route.snapshot.paramMap.get("resource_type");
  //   $(window).ready(function(){
  //     $('.pdf_reject').click(function(){
  //       $('.activepdf > .togglepdf').removeClass('nonstatus').removeClass('approved').addClass('rejected');      
  //     });
  //     $('.pdf_approve').click(function(){
  //        $('.activepdf > .togglepdf').removeClass('nonstatus').removeClass('rejected').addClass('approved');
  //      });
  //      $('.pdf_preview').click(function(){
  //        $('.activepdf > .togglepdf').removeClass('approved').removeClass('rejected').addClass('nonstatus');
  //      });
  //     $('.pdf_nav ul li').click(function() {
  //       var index = $(this).index();
  //       $(this).addClass('activepdf').siblings().removeClass('activepdf');
  //       $('.pdf_box li').eq(index).addClass('activepdf').siblings().removeClass('activepdf');
  //     });
  //     $('.nextpdf').click( function(){
  //       $('.activepdf').next().addClass('activepdf').prev().removeClass('activepdf')
  //     });
  //     $('.prevpdf').click( function(){
  //       $('.activepdf').prev().addClass('activepdf').next().removeClass('activepdf')
  //     });
  // });

  //   this.pdfs = [
  //     {doc_display_name: 'Insurance', doc_url: './assets/images/myfile.pdf', id: '1', status: 'none', registeredby: 'Rushi Indulekar',Dateofre : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
  //     {doc_display_name: 'RC Book', doc_url: './assets/images/pdf.pdf', id: '2', status: 'approved', registeredby: 'Rushi Indulekar',Dateofre : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
  //     {doc_display_name: 'Fitness Certificate', doc_url: './assets/images/PDFTRON_about.pdf', id: '3', status: 'rejected', registeredby: 'Rushi Indulekar',Dateofre : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
  // ];
    
    this.editDriverPersonalForm = this.formBuilder.group({
       driver_name: ['', Validators.required],
       father_spouse_name: ['', Validators.required],
       date_of_birth: ['', Validators.required],
       gender: [''],
       aadhaar_mobile_number:  ['', Validators.required],
       marital_status: [''],
       blood_group: [''],
       qualification: [''],
    });
    var user = {
      "resource_id": + this.resource_id,
      "resource_type":this.resource_type,
      "os_type":'web'
   }
    this.driverPostData = {user};
    this.Driver.getDriverDetails(this.driverPostData).subscribe(details => {
      if (details['success'] == true) {
        this.driverDetails = details['data']['user_detail'];
        this.pdfsDocs = details['data']['doc_list'];
        console.log('pDF without filter');
        console.log(this.pdfsDocs);
        this.pdfs = this.pdfsDocs.filter(item=> item.doc_url != null);  
        console.log('in pdfs');
        console.log('doc count = '+ this.pdfs.length);
        console.log(this.pdfs);
        console.log(this.driverDetails[0]['aadhaar_number']);
        this.editDriverPersonalForm.patchValue({
          driver_name: this.driverDetails[0]['driver_name'],
          father_spouse_name: this.driverDetails[0]['father_spouse_name'],
          date_of_birth: moment(this.driverDetails[0]['date_of_birth']).format("YYYY-MM-DD"),
          gender: this.driverDetails[0]['gender'],
          aadhaar_mobile_number: this.driverDetails[0]['aadhaar_mobile_number'],
          marital_status: this.driverDetails[0]['marital_status'],
          blood_group: this.driverDetails[0]['blood_group'],
          qualification: this.driverDetails[0]['qualification'],
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
  get f() { return this.editDriverPersonalForm.controls; }

    onSubmit() {

      this.submitted = true;
  
      var values = this.editDriverPersonalForm.value;
      // stop here if form is invalid
      if (this.editDriverPersonalForm.invalid) {
      
          return;
      }
      this.editDriverPersonalForm.patchValue({
        driver_name: values.driver_name,
        father_spouse_name: values.father_spouse_name,
        date_of_birth:  moment(values.date_of_birth).format("YYYY-MM-DD"),
        gender: values.gender,
        aadhaar_mobile_number: values.aadhaar_mobile_number,
        marital_status: values.marital_status,
        blood_group: values.blood_group,
        qualification: values.qualification 
      });
      var user = {
        "session_id":3403,
        "resource_id": +this.resource_id,
        "resource_type": this.resource_type,
        "os_type": 'web'
      };
      let approved_doc = this.pdfs.filter(i => i.status === 'approved')
      let rejected_doc= this.pdfs.filter(i => i.status === 'rejected')
      console.log(approved_doc);
      console.log(rejected_doc);
      var document={
        "approved_doc":approved_doc,
        "rejected_doc":rejected_doc,
        "comment":'test'
      };
      var formData={};
      var data={formData:this.editDriverPersonalForm.value,document};
      this.driverUpdateData ={user,data};
      
       // update driver personal details
     this.Driver.updateDriverDetails(this.driverUpdateData).subscribe(res => {
      if (res['success'] == true) {
      console.log(this.isEditModeOn);
      this.isEditModeOn=false;
      if(this.isEditModeOn){this.valueOfButton = "Cancel"}
      else{this.valueOfButton= "Edit"}
      this.toastr.success('Success', 'Driver Personal Details updated successfully')
      }
      else{
        this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG);
      }
   },errorResponse => {
       this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG)
   });  
   
    }
    saveDocsStatus(resource_id)
    {
      console.log(this.pdfs);
      let array = this.pdfs.filter(i => i.status === 'none')
      let docsName = '';
      array.map(i => {
        docsName += i.doc_display_name + ", ";
      })
      if (array.length > 0) {
        this.toastr.error('Error', 'Please approve or reject all documents: '+ docsName);
      }
      this.onSubmit();
      // console.log(resource_id);
      // this.router.navigate(['/driver-business' ,{'resource_id':resource_id,'resource_type':'drivers' }]);      
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
    approveDoc(data){
      this.approvedDocsList.push({ ID: data.name, status: data.status });
    }
    rejectedDoc(data){
      this.rejectedDocsList.push({ ID: data.name, status: data.status });
    }
}
