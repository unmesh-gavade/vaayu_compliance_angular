import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import {DashboardService} from '../../services/dashboard.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  status: boolean = false;
  dashboardList: Object;
  baList:{};

  clickEvent(){
      this.status = !this.status;       
  }
    search_res : any = '';
    public search:any = '';
    locked: any[] = [];
    constructor(public commonService:CommonService, public Dashboard:DashboardService) { }

  ngOnInit() {
      this.locked = [
        {Name: 'Rajesh Singh', User: 'Satish Tour & Travel', DLNO: 'AP265HDG236434', Gender: 'Male', registeredby: 'Rushi Indulekar', Status: 'registered',Dateofre : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
        {Name: 'Rahul Rao', User: 'Satish Tour & Travel', DLNO: 'AP265HDG236434', Gender: 'Male', registeredby: 'Rushi Indulekar', Status: 'registered',Dateofre : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
        {Name: 'Praveen Kumar ', User: 'Satish Tour & Travel', DLNO: 'AP265HDG236434', Gender: 'Male', registeredby: 'Rushi Indulekar', Status: 'registered',Dateofre : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
        {Name: 'Rupali Ram ', User: 'Satish Tour & Travel', DLNO: 'AP265HDG236434', Gender: 'Female', registeredby: 'Rushi Indulekar', Status: 'registered',Dateofre : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
        {Name: 'Purab Kadam', User: 'Satish Tour & Travel', DLNO: 'AP265HDG236434', Gender: 'Male', registeredby: 'Rushi Indulekar', Status: 'registered',Dateofre : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
        {Name: 'Yagya Das', User: 'Satish Tour & Travel', DLNO: 'AP265HDG236434', Gender: 'Male', registeredby: 'Rushi Indulekar', Status: 'registered',Dateofre : '07 July 2019 | 08:45 PM ',Action : 'VERIFY'},
        {Name: 'Pramod Achari', User: 'Satish Tour & Travel', DLNO: 'AP265HDG236434', Gender: 'Male', registeredby: 'Rushi Indulekar', Status: 'registered',Dateofre : '08 July 2019 | 08:45 PM ',Action : 'VERIFY'},
    ];
    this.Dashboard.getBaList().subscribe(data=>{
      this.baList = data;
      console.log(data);
    })

   this.onsubmit();
  }

  onsubmit(){
    var data = {
      "resource_type": 'drivers',
      "search_by_tat":'Registered',
      "search_by_name":'',
      "start_page_index":0,
      "record_per_page":10
   }
    
    this.Dashboard.getDashboardList(data).subscribe(data=>{
      this.dashboardList = data;
      console.log(data);
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


