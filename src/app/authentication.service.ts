import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, tap } from "rxjs/operators";

export class User {
  constructor(public status: string) {}
}

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  constructor(private httpClient: HttpClient) { }
  
  // Provide username and password for authentication, and once authentication is successful,
  //store JWT token in session
    
  login(username: string, password: string) {
    const body = { username: username, password: password };
    return this.httpClient
      .post<any>("http://localhost:8080/users/login", body, {  observe: "response" })
      .pipe(); 
    
  }

}
