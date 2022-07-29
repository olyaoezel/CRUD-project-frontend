import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})


export class AppComponent implements OnInit {

  constructor(private authService: AuthService, public router: Router) { }

  currentUser: any;

  ngOnInit(): void {
     if (this.authService.isAuthenticated()) {
      
      this.currentUser = sessionStorage.getItem("username");
    }
  }

   logOut() {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("token");

    this.router.navigate(['auth']);
  }

}
