import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private httpClient: HttpClient, private authService: AuthenticationService, public router: Router) { }

  // isUserLoggedIn: boolean = false;
  isLoginMode = true;
  loginStatusCode: number = 0;
  authForm!: FormGroup;
  userExists: boolean = false;
   loading: boolean = false; 

   ngOnInit() {
    this.loading = true;
    this.resetAuthForm();
  }

  //  userStatus() {
  //   let user = sessionStorage.getItem("username");
  //   this.isUserLoggedIn = !(user === null);
  // }

   onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
   }
  
   login(username: string, password: string) {
    
    this.authService.login(username, password).subscribe((response: any) => {

      sessionStorage.setItem("username", username);
      // this.currentUser = username;
      let tokenStr = response.headers.get('Authorization');
      sessionStorage.setItem("token", tokenStr);
    
      // this.userStatus();
      this.resetAuthForm();
      this.router.navigate(['bookShelf']);
      // this.getAllBooks();
      // this.getAllGenres();
          
    }, error => {
      this.loginStatusCode = error.status; 
     
    });
  }
  

  onAuthSubmit() {
    const { username, password } = this.authForm.value;
    
    if (this.isLoginMode) {
      this.login(username, password);
    } else {
      const body = { username: username, password: password };
      this.httpClient.post("http://localhost:8080/users/signup", body, {  observe: 'response' })
          .subscribe(response => {
            this.login(username, password);
           
          }, error => {
           
            this.userExists = true;
          } ); 
    
     this.userExists = false;
    }
   
  }

   hideAuthErrorMessage() {
    this.loginStatusCode = 0;
    this.userExists = false;
   }
  
  resetAuthForm() {
    this.authForm = new FormGroup({
      'username': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required])
    })
  }

}
