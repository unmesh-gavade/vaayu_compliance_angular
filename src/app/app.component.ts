import { Component, OnInit } from '@angular/core';
import { CommonService } from './services/common.service';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
 
  title = 'blogger';

  constructor(public commonService:CommonService, private mScrollbarService: MalihuScrollbarService) {}

  ngOnInit() {
    this.mScrollbarService.initScrollbar(document.body, { axis: 'yx', theme: 'minimal-dark' });
  }
  public scrollbarOptions = { axis: 'yx', theme: 'minimal-dark' };
  onToolbarMenuToggle(){
    console.log('toggle', this.commonService.isMenuOpen);
    this.commonService.toggleMenu();
  }

}

