import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from './pipes/filter.pipe';
import { PaginationDirective } from './directives/pagination.directive';
import { BasicAuthHtppInterceptorService } from './auth-interceptor.service';
import { AppRoutingModule } from './app-routing.module';
import { AuthComponent } from './auth/auth.component';
import { BookShelfComponent } from './book-shelf/book-shelf.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { AuthService } from './auth/auth.service';
import { JwtHelperService, JWT_OPTIONS  } from '@auth0/angular-jwt';
import { SvgHeartComponent } from './svg/heart/heart.component';
import { LibraryPageComponent } from './library-page/library-page.component';
import { HeaderComponent } from './header/header.component';


@NgModule({
  declarations: [
    AppComponent,
    FilterPipe,
    PaginationDirective,
    AuthComponent,
    BookShelfComponent,
    SvgHeartComponent,
    LibraryPageComponent,
    HeaderComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  providers: [
    AuthGuardService,
    AuthService,
    JwtHelperService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BasicAuthHtppInterceptorService,
      multi: true
    },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
