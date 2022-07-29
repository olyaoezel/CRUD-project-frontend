import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { BookShelfComponent } from './book-shelf/book-shelf.component';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { AuthComponent } from './auth/auth.component';
import { LibraryPageComponent } from './library-page/library-page.component';

const appRoutes: Routes = [
     { path: '', redirectTo: '/bookShelf', pathMatch: 'full'},

     { path: 'bookShelf', component: BookShelfComponent, canActivate: [AuthGuard] },
     { path: 'library', component: LibraryPageComponent, canActivate: [AuthGuard] },
   
    
      { path: 'auth', component: AuthComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}
