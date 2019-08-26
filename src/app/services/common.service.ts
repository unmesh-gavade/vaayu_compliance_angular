import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

 

  isMenuOpen = true;
  constructor() { }
 
  toggleMenu(){
    this.isMenuOpen = !this.isMenuOpen;
  }
}