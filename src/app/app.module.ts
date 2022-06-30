import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from './pipes/filter.pipe';
import { PaginationDirective } from './directives/pagination.directive';
import { BasicAuthHtppInterceptorService } from './auth-interceptor.service';
import { AuthenticationService } from './authentication.service';


@NgModule({
  declarations: [
    AppComponent,
    FilterPipe,
    PaginationDirective,
   
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
  AuthenticationService,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: BasicAuthHtppInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
