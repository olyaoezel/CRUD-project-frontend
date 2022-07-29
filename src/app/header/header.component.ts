import { Component} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  styles: [".currentUser {text-align: end; }"],
  template: `
  <div class="container" *ngIf="currentUser">
    <p class="currentUser">Logged in as {{currentUser | json}}</p>
    <button class="btn btn-primary menuBtn" (click)="logOut()" type="button">Log Out</button>
</div>`
  
})
export class HeaderComponent  {

  constructor( public router: Router) { }
 
  currentUser: any = null;

  ngAfterContentChecked () {
   
    this.currentUser = sessionStorage.getItem("username");

  }

   logOut() {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("token");
    this.currentUser = null;

    this.router.navigate(['auth']);
   }
  
}
