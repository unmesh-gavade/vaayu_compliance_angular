import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { DashboardService } from '../../services/dashboard.service';
import { THIS_EXPR, ThrowStmt } from '@angular/compiler/src/output/output_ast';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { AppConst } from '../../const/appConst';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  serverDateFormat = AppConst.SERVER_DATE_TIME_FORMAT;
  status: boolean = false;
  dashboardList: Object;
  baList: {};
  tatList: [];
  req_status_list: [];
  isDriverSelected = true;
  resource_type: String;
  tat_type: String;

  clickEvent() {
    this.status = !this.status;
  }
  search_res: any = '';
  public search: any = '';
  locked: any[] = [];
  constructor(public commonService: CommonService, public Dashboard: DashboardService, private authService: AuthService, private router: Router, ) { }

  ngOnInit() {
    this.authService.checkLogin();
    this.locked = [
      { ba_legal_name: 'Rajesh Singh', resource_id: 'Satish Tour & Travel', licence_number: 'AP265HDG236434', gender: 'Male', registeredby: 'Rushi Indulekar', induction_status: 'registered', date_of_registration: '07 July 2019 | 08:45 PM ', Action: 'VERIFY' },
      { ba_legal_name: 'Rahul Rao', resource_id: 'Satish Tour & Travel', licence_number: 'AP265HDG236434', gender: 'Male', registeredby: 'Rushi Indulekar', induction_status: 'registered', date_of_registration: '07 July 2019 | 08:45 PM ', Action: 'VERIFY' },
      { ba_legal_name: 'Praveen Kumar ', resource_id: 'Satish Tour & Travel', licence_number: 'AP265HDG236434', gender: 'Male', registeredby: 'Rushi Indulekar', induction_status: 'registered', date_of_registration: '07 July 2019 | 08:45 PM ', Action: 'VERIFY' },
      { ba_legal_name: 'Rupali Ram ', resource_id: 'Satish Tour & Travel', licence_number: 'AP265HDG236434', gender: 'Female', registeredby: 'Rushi Indulekar', induction_status: 'registered', date_of_registration: '07 July 2019 | 08:45 PM ', Action: 'VERIFY' },
      { ba_legal_name: 'Purab Kadam', resource_id: 'Satish Tour & Travel', licence_number: 'AP265HDG236434', gender: 'Male', registeredby: 'Rushi Indulekar', induction_status: 'registered', date_of_registration: '07 July 2019 | 08:45 PM ', Action: 'VERIFY' },
      { ba_legal_name: 'Yagya Das', resource_id: 'Satish Tour & Travel', licence_number: 'AP265HDG236434', gender: 'Male', registeredby: 'Rushi Indulekar', induction_status: 'registered', date_of_registration: '07 July 2019 | 08:45 PM ', Action: 'VERIFY' },
      { ba_legal_name: 'Pramod Achari', resource_id: 'Satish Tour & Travel', licence_number: 'AP265HDG236434', gender: 'Male', registeredby: 'Rushi Indulekar', induction_status: 'registered', date_of_registration: '08 July 2019 | 08:45 PM ', Action: 'VERIFY' },
    ];
    this.Dashboard.getBaList().subscribe(res => {
      this.baList = res['data']['list'];
      console.log(this.baList);
    });
    this.Dashboard.getDashboardTats().subscribe(tats => {
      this.tatList = tats['data']['tat_list'];
      this.req_status_list = this.tatList;

      this.req_status_list = this.tatList.filter(item => item.name === 'new_request'
        || item.name === 'qc_pending'
        || item.name === 'inducted'
        || item.name === 'rejected'
        || item.name === 'ready_for_allocation');

    });

    if (this.isDriverSelected) { this.resource_type = 'drivers' }
    else { this.resource_type = 'vehicles' };
    this.tat_type = 'new_request';
    //   var data = {
    //     "resource_type": this.resource_type,
    //     "search_by_tat":'new_request',
    //     "search_by_name":'',
    //     "start_page_index":0,
    //     "record_per_page":10
    //  }
    //  this.Dashboard.getDashboardList(data).subscribe(res=>{
    //   this.dashboardList = res['data']['filterData'];
    //   console.log(this.dashboardList);
    // })
    this.onsubmit();
  }

  onsubmit() {
    console.log('in sumbit');
    console.log(this.isDriverSelected);
    console.log(this.resource_type);
    var data = {
      "resource_type": this.resource_type,
      "search_by_tat": this.tat_type,
      "search_by_name": '',
      "start_page_index": 0,
      "record_per_page": 10
    }


    this.Dashboard.getDashboardList(data).subscribe(res => {
      console.log('in dash');
      console.log(res);
      this.dashboardList = res['data']['filterData'];
      console.log(this.dashboardList);
    })

  };
  Verify(resource_id, resource_type) {
    console.log(resource_id);
    //alert(resource_type);
    if (resource_type == 'drivers') {
      console.log(resource_type);
      this.router.navigate(['/driver-personal', { 'resource_id': resource_id, 'resource_type': 'drivers' }]);
    }
    else {
      this.router.navigate(['/vehicle-personal', { 'resource_id': resource_id, 'resource_type': 'vehicles' }]);

    }

  };
  onToolbarMenuToggle() {
    console.log('toggle', this.commonService.isMenuOpen);
    this.commonService.toggleMenu();
  }
  private pageSize: number = 5;
  search_bt(query) {
    this.search_res = query;
  }

  selectDriver() {
    this.isDriverSelected = true;
    this.resource_type = 'drivers';
    this.onsubmit();

  }
  selectVehicle() {
    this.isDriverSelected = false;
    this.resource_type = 'vehicles';
    this.onsubmit();

  }
  getTatType(tatType, resource_type) {
    this.tat_type = tatType;
    this.resource_type = resource_type;
    //alert(this.tat_type);
    this.onsubmit();
  }
}


