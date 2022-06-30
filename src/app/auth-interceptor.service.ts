import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BasicAuthHtppInterceptorService implements HttpInterceptor {

  constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
      
    //     const headers = new HttpHeaders({
    //   'Authorization': `${sessionStorage.getItem('token')}`,
  
    // });

    if (sessionStorage.getItem('username') && sessionStorage.getItem('token')) {
        req = req.clone({
            setHeaders: {
                Authorization: `${sessionStorage.getItem('token')}`
            }
      
        })
        // req = req.clone({headers});

    }

    return next.handle(req);

  }
}
