import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
  
export class AuthService {
    constructor(public jwtHelper: JwtHelperService) { }  
  
  public isAuthenticated(): boolean {
    const tokenFromStorage = sessionStorage.getItem('token');
    const token = tokenFromStorage?.slice(7);
    
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }}