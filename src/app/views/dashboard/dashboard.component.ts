import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import {DashboardService} from '../../services/dashboard.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  status: boolean = false;
  dashboardList: Object;
  baList:{};
  tatList:{};

  clickEvent(){
      this.status = !this.status;       
  }
    search_res : any = '';
    public search:any = '';
    locked: any[] = [];
    constructor(public commonService:CommonService, public Dashboard:DashboardService, private authService:AuthService) { }

  ngOnInit() {
    //this.authService.checkLogin();
      this.locked = [
        {ba_legal_name: 'Rajesh Singh', resource_id: 'Satish Tour & Travel', licence_number: 'AP265HDG236434', gender: 'Male', registeredby: 'Rushi Indulekar', induction_status: 'registered',date_of_registration : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
        {ba_legal_name: 'Rahul Rao', resource_id: 'Satish Tour & Travel', licence_number: 'AP265HDG236434', gender: 'Male', registeredby: 'Rushi Indulekar', induction_status: 'registered',date_of_registration : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
        {ba_legal_name: 'Praveen Kumar ', resource_id: 'Satish Tour & Travel', licence_number: 'AP265HDG236434', gender: 'Male', registeredby: 'Rushi Indulekar', induction_status: 'registered',date_of_registration : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
        {ba_legal_name: 'Rupali Ram ', resource_id: 'Satish Tour & Travel', licence_number: 'AP265HDG236434', gender: 'Female', registeredby: 'Rushi Indulekar', induction_status: 'registered',date_of_registration : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
        {ba_legal_name: 'Purab Kadam', resource_id: 'Satish Tour & Travel', licence_number: 'AP265HDG236434', gender: 'Male', registeredby: 'Rushi Indulekar', induction_status: 'registered',date_of_registration : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
        {ba_legal_name: 'Yagya Das', resource_id: 'Satish Tour & Travel', licence_number: 'AP265HDG236434', gender: 'Male', registeredby: 'Rushi Indulekar', induction_status: 'registered',date_of_registration : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
        {ba_legal_name: 'Pramod Achari', resource_id: 'Satish Tour & Travel', licence_number: 'AP265HDG236434', gender: 'Male', registeredby: 'Rushi Indulekar', induction_status: 'registered',date_of_registration : '08 July 2019 | 08:45 PM ',Action : 'VERIFY'},
    ];
    this.Dashboard.getBaList().subscribe(res=>{
      this.baList =res['data']['list'] ;
      console.log(this.baList);
    });
    this.Dashboard.getDashboardTats().subscribe(tats=>{
    this.tatList= tats['data']['tat_list'];
    console.log(this.tatList);
    
    });
    var data = {
      "resource_type": 'drivers',
      "search_by_tat":'new_request',
      "search_by_name":'',
      "start_page_index":0,
      "record_per_page":10
   }
   this.Dashboard.getDashboardList(data).subscribe(res=>{
    this.dashboardList = res['data']['filterData'];
    console.log(this.dashboardList);
  })
   this.onsubmit();
  }

  onsubmit(){
    
    var data = {
      "resource_type": 'drivers',
      "search_by_tat":'draft',
      "search_by_name":'',
      "start_page_index":0,
      "record_per_page":100
   }
   this.Dashboard.getDashboardList(data).subscribe(res=>{
    this.dashboardList = res['data']['filterData'];
    console.log(this.dashboardList);
  })
    
  }
 
  
    onToolbarMenuToggle(){
      console.log('toggle', this.commonService.isMenuOpen);
      this.commonService.toggleMenu();
    }
    private pageSize: number = 5;
    search_bt(query){
      this.search_res = query;
    }
  }


