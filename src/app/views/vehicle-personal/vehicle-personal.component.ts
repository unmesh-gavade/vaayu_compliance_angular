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
  selectedPage = 0;

  constructor(private formBuilder: FormBuilder, public Vehicle: VehicleService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.authService.checkLogin();
    this.resource_id = this.route.snapshot.paramMap.get("resource_id");
    this.resource_type = this.route.snapshot.paramMap.get("resource_type");
    // $(window).ready(function () {
    //   $('.pdf_reject').click(function () {
    //     $('.activepdf > .togglepdf').removeClass('nonstatus').removeClass('approved').addClass('rejected');
    //   });
    //   $('.pdf_approve').click(function () {
    //     $('.activepdf > .togglepdf').removeClass('nonstatus').removeClass('rejected').addClass('approved');
    //   });
    //   $('.pdf_preview').click(function () {
    //     $('.activepdf > .togglepdf').removeClass('approved').removeClass('rejected').addClass('nonstatus');
    //   });
    //   $('.pdf_nav ul li').click(function () {
    //     var index = $(this).index();
    //     $(this).addClass('activepdf').siblings().removeClass('activepdf');
    //     $('.pdf_box li').eq(index).addClass('activepdf').siblings().removeClass('activepdf');
    //   });
    //   $('.nextpdf').click(function () {
    //     $('.activepdf').next().addClass('activepdf').prev().removeClass('activepdf')
    //   });
    //   $('.prevpdf').click(function () {
    //     $('.activepdf').prev().addClass('activepdf').next().removeClass('activepdf')
    //   });
    // });

    // this.pdfs = [
    //   { doc_display_name: 'Insurance', doc_url: './assets/images/myfile.pdf', id: '1', status: 'none', registeredby: 'Rushi Indulekar', Dateofre: '07 July 2019 | 08:45 PM ', Action: 'VERIFY' },
    //   { doc_display_name: 'RC Book', doc_url: './assets/images/pdf.pdf', id: '2', status: 'approved', registeredby: 'Rushi Indulekar', Dateofre: '07 July 2019 | 08:45 PM ', Action: 'VERIFY' },
    //   { doc_display_name: 'Fitness Certificate', doc_url: './assets/images/PDFTRON_about.pdf', id: '3', status: 'rejected', registeredby: 'Rushi Indulekar', Dateofre: '07 July 2019 | 08:45 PM ', Action: 'VERIFY' },
    // ];
    this.editVehiclePersonalForm = this.formBuilder.group({
      plate_number: ['', Validators.required],
      category: ['', Validators.required],
      model: ['', Validators.required],
      // txtSeatingCapacity: ['',Validators.required],
      colour: [''],
      fuel_type: [''],
      ac: [''],
      gps_provider_id: ['']
    });
    var user = {
      "resource_id": + this.resource_id,
      "resource_type": this.resource_type, 
      "os_type":'web'
    }
    this.vehiclePostData = { user };

    this.Vehicle.getVehicleDetails(this.vehiclePostData).subscribe(details => {
      
      console.log('personal doc response '+ JSON.stringify(details));
      if (details['success'] == true) {
        this.vehicleDetails = details['data']['user_detail'];
        this.pdfs = details['data']['doc_list'];
        console.log('doc count = '+ this.pdfs.length);
        this.editVehiclePersonalForm.patchValue({
          plate_number: this.vehicleDetails[0]['plate_number'],
          category: this.vehicleDetails[0]['category'],
          model: this.vehicleDetails[0]['model'],
          // txtSeatingCapacity: this.vehicleDetails[0]['gender'],
          colour: this.vehicleDetails[0]['colour'],
          fuel_type: this.vehicleDetails[0]['fuel_type'],
          ac: this.vehicleDetails[0]['ac'],
          gps_provider_id: this.vehicleDetails[0]['gps_provider_id'],
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
      plate_number: values.plate_number,
      category: values.category,
      model: values.model,
      // txtSeatingCapacity: values.txtSeatingCapacity,
      colour: values.colour,
      fuel_type: values.fuel_type,
      ac: values.ac,
      gps_provider_id: values.gps_provider_id,
    });
    var user = {
      "session_id": 3403,
      "resource_id": +this.resource_id,
      "resource_type": this.resource_type,
      "os_type": 'web'
    };
    var document = {
      "approved_doc": '1,2',
      "rejected_doc": '3,4',
      "comment": 'test'
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
    let array = this.pdfs.filter(i => i.status === 'none')
    let docsName = '';
    array.map(i => {
      docsName += i.doc_display_name + ", ";
    })
    if (array.length > 0) {
      this.toastr.error('Error', 'Please approve or reject all documents: '+ docsName);
    }
    // this.router.navigate(['/vehicle-document', { 'resource_id': resource_id, 'resource_type': 'vehicles' }]);
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

}
