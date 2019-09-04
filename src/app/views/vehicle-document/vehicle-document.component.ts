import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';

@Component({
  selector: 'app-vehicle-document',
  templateUrl: './vehicle-document.component.html',
  styleUrls: ['./vehicle-document.component.sass']
})
export class VehicleDocumentComponent implements OnInit {

  pdfSrc: string = './assets/images/myfile.pdf';
  pdfs: any[] = [];
  valueOfButton = "Edit";
  isEditModeOn = false;
  isDropup = true;
  imageURL="./assets/img/Doc.jpg";
  editVehicleDocumentForm: FormGroup;
  submitted = false;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    
    $(window).ready(function(){
      $(".pdf_box li").removeClass("activepdf");
      $(".pdf_box li").removeClass("activepdf");
      $('.nextpdf').click( function(){
        $('.activepdf').next().addClass('activepdf').prev().removeClass('activepdf')
      });
      $('.prevpdf').click( function(){
        $('.activepdf').prev().addClass('activepdf').next().removeClass('activepdf')
      });
  });

    this.pdfs = [
      {Name: 'Rajesh Singh', User: './assets/images/myfile.pdf', DLNO: 'AP265HDG236434', Gender: 'Male', registeredby: 'Rushi Indulekar', Status: 'registered',Dateofre : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
      {Name: 'Rajesh Singh', User: './assets/images/sample-file.pdf', DLNO: 'AP265HDG236434', Gender: 'Male', registeredby: 'Rushi Indulekar', Status: 'registered',Dateofre : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
  ];
    this.editVehicleDocumentForm = this.formBuilder.group({
      txtBusinessAssociateName: [''],
      txtBusinessArea: ['',Validators.required],
      txtDriverNameDetail1: [''],
      txtMobileDeviceNumber: [''],
      txtMobileIMEI: [''],
      txtMobileModelVersion:[''],
      txtLastServiceDate:[''],
   });
  }
  onEdit() {
    this.isEditModeOn = ! this.isEditModeOn;
    if(this.isEditModeOn){this.valueOfButton = "Cancel"}
    else{this.valueOfButton= "Edit"}
    console.log(this.isEditModeOn);
        return;
    }
    ShowImage(path){
      this.imageURL= path; 
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
  }
}
