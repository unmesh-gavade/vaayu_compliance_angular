import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import {DashboardService} from '../../services/dashboard.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AuthService } from '../../auth/auth.service';
<<<<<<< HEAD
import * as $ from 'jquery';

=======
import { Router } from '@angular/router';
>>>>>>> 903a06c51ede4cbbd2b8d12e3874202170262e0f
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
    constructor(public commonService:CommonService, public Dashboard:DashboardService, private authService:AuthService,private router: Router,) { }

  ngOnInit() {
<<<<<<< HEAD
    $(window).ready(function(){
    $(function(){
      var btn = $('.show_act'),
      info = $('.info');
   
    btn.click(function(e) {
        e.preventDefault();
        var index = $(this).index();
        info.hide();
        info.eq(index).show();
        $('.show_act').removeClass('current');
        $(this).addClass('current');
      
    });  
    
    
    $(".Vehicle").click(function () { 
                 
                $("#option2").attr("checked", true).click(); 
                $(".show_act1").removeClass("act_p");
                $(this).addClass("act_p");
            }); 
            $(".Driver").click(function () { 
                 
                 $("#option1").attr("checked", true).click(); 
                 $(".show_act1").removeClass("act_p");
                $(this).addClass("act_p");
             });   
             $(".tg_select .btn-group-toggle .btn-secondary:nth-child(1)").click(function () { 
              $(".show_act1").removeClass("act_p");
              $(".show_act1.Driver").addClass("act_p");
              
             }); 
             $(".tg_select .btn-group-toggle .btn-secondary:nth-child(2)").click(function () { 
              $(".show_act1").removeClass("act_p");
              $(".show_act1.Vehicle").addClass("act_p");
                
             }); 
            });  

});
    //this.authService.checkLogin();
=======
    this.authService.checkLogin();
>>>>>>> 903a06c51ede4cbbd2b8d12e3874202170262e0f
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
      "record_per_page":10
   }

   
   this.Dashboard.getDashboardList(data).subscribe(res=>{
    this.dashboardList = res['data']['filterData'];
    console.log(this.dashboardList);
  })
    
<<<<<<< HEAD
  }
  myClickFunction(){
    alert("asdf");
    var data1 = {
      "resource_type": 'drivers',
      "search_by_tat":'draft',
      "search_by_name":'',
      "start_page_index":0,
      "record_per_page":100
   }
   this.Dashboard.getDashboardList(data1).subscribe(res=>{
    this.dashboardList = res['data1']['filterData'];
    console.log(this.dashboardList);
  })
  }
 
  
=======
  };
  Verify(resource_id){
    console.log(resource_id);
    this.router.navigate(['/driver-personal' +  resource_id]);      
    var user = {
      "resource_id": resource_id,
      "resource_type":'drivers',
      "os_type":'web'
   };
   console.log(user);
  };
>>>>>>> 903a06c51ede4cbbd2b8d12e3874202170262e0f
    onToolbarMenuToggle(){
      console.log('toggle', this.commonService.isMenuOpen);
      this.commonService.toggleMenu();
    }
    private pageSize: number = 5;
    search_bt(query){
      this.search_res = query;
    }
  }


