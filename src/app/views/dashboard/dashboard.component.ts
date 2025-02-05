import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { DashboardService } from '../../services/dashboard.service';
import { THIS_EXPR, ThrowStmt } from '@angular/compiler/src/output/output_ast';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { AppConst } from '../../const/appConst';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  serverDateFormat = AppConst.SERVER_DATE_TIME_FORMAT;
  status: boolean = false
  dashboardList = []
  baList = []
  tatList = []
  req_status_list = []
  resource_type: String
  tat_type: String

  clickEvent() {
    this.status = !this.status
  }
  search_res: any = ''
  public search: any = ''
  nonCompliant_Renew_Draft = []
  toHide_verify_button = false;

  search_text = '';
  pageSize = 5;
  currentPage = 1;

  constructor(private toastr: ToastrService, public commonService: CommonService, public dashboardService: DashboardService, private authService: AuthService, private router: Router, ) { }

  ngOnInit() {
    this.authService.checkLogin();

    
    this.getBAListing()
    this.getDashboardTats()
    this.fetchListing();
  }

  getBAListing() {
    this.dashboardService.getBaList().subscribe(res => {
      this.baList = res['data']['list'];
    });
  }

  getDashboardTats() {
    this.dashboardService.getDashboardTats().subscribe(tats => {
      this.tatList = <[]>tats['data']['tat_list'];
      this.req_status_list = this.tatList.filter((item:{name:String}) => 
                          item.name === 'new_request'
                            || item.name === 'qc_pending'
                            || item.name === 'inducted'
                            || item.name === 'rejected');

      this.nonCompliant_Renew_Draft = this.tatList.filter((i:{name:String}) => 
          i.name === 'non_complient' 
          || i.name === 'renewal_document' 
          // || i.name === 'draft'
          );

    });
  }

  fetchListing() {

    this.resource_type = this.dashboardService.resource_type;
    this.tat_type = this.dashboardService.tat_type;
    this.toHide_verify_button = this.dashboardService.toHide_verify_button;
    this.dashboardService.is_renewal = 0;
    // if (this.dashboardService.is_renewal == 1) {
    //   this.getDashboardRenewalList(true);
    //   return;
    // }

    var data = {
      "resource_type": this.resource_type,
      "search_by_tat": this.tat_type,
      "search_by_name": '',
      "start_page_index": 0,
      "record_per_page": 100
    }


    this.dashboardService.getDashboardList(data).subscribe(res => {
      this.dashboardList = res['data']['filterData'];
      console.log(this.dashboardList);
    })

  };

  onVerifyClick(resource_id, resource_type) {
    if (resource_type == 'drivers') {
      this.router.navigate(['/driver-personal', { 'resource_id': resource_id, 'resource_type': resource_type, 
      'is_renewal': this.dashboardService.is_renewal }]);
    } else {
      this.router.navigate(['/vehicle-personal', { 'resource_id': resource_id, 'resource_type': resource_type,
      'is_renewal': this.dashboardService.is_renewal }]);
    }
  };
  onToolbarMenuToggle() {
    this.commonService.toggleMenu();
  }
  search_bt(query) {
    this.search_res = query;
  }

  selectDriver() {
    this.dashboardService.isDriverSelected = true;
    this.dashboardService.resource_type = 'drivers';
    if (this.dashboardService.is_renewal == 1) {
      this.getDashboardRenewalList(true);
    } else {
      this.fetchListing();
    }

  }
  selectVehicle() {
    this.dashboardService.isDriverSelected = false;
    this.dashboardService.resource_type = 'vehicles';
    if (this.dashboardService.is_renewal == 1) {
      this.getDashboardRenewalList(true);
    } else {
      this.fetchListing();
    }
  }
  
  getTatType(tatType, resource_type) {
    this.dashboardService.tat_type = tatType;
    this.dashboardService.resource_type = resource_type;
    let smallTatType = tatType.toLowerCase();
    if (smallTatType === 'new_request' || smallTatType === 'qc_pending') {
      this.dashboardService.toHide_verify_button = false;
    } else {
      this.dashboardService.toHide_verify_button = true;
    }
    //alert(this.tat_type);
    console.log(this.dashboardService.is_renewal );
    
    this.fetchListing();
    
  }

  getDashboardRenewalList (isRenewalBlock) {
    this.dashboardService.toHide_verify_button = false;
    this.resource_type = this.dashboardService.resource_type;
    this.tat_type = this.dashboardService.tat_type;
    this.tat_type = 'renewal_document'
    this.toHide_verify_button = this.dashboardService.toHide_verify_button;
    if (isRenewalBlock) {
      this.dashboardService.is_renewal = 1;
      this.dashboardService.getDashboardRenewalList({
        "resourcetype": this.resource_type,
        "search_by_tat": this.tat_type,
        'docstatus' : 'renewal',
        "search_by_name": '',
        "start_page_index": 0,
        "record_per_page": 10
      }).subscribe(res => {
        console.log('getDashboardRenewalList', res);
        this.dashboardList = res['data']['listitems'];
      }, error => {
        this.toastr.error('Error', AppConst.SOMETHING_WENT_WRONG);
      })
    }
  }

  toShowExpiry () {
    if (this.dashboardList.length > 0) {
      if (this.dashboardList[0].expiry_date) {
        return true
      }
    }
    return false;
  }

  getFormatterDate(date) {
    if (date === 0 || date === '0000-00-00' || date === '0000-00-00 00:00:00') {
      return null;
    }
    return date;
  }
}


