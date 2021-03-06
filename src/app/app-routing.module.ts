import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { BookShelfComponent } from './book-shelf/book-shelf.component';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { AuthComponent } from './auth/auth.component';

const appRoutes: Routes = [
     { path: '', redirectTo: '/bookShelf', pathMatch: 'full'},

     { path: 'bookShelf', component: BookShelfComponent, canActivate: [AuthGuard] },
   
    // { path: 'auth', loadChildren: () => import('./auth/auth.component').then(mod => mod.AuthComponent)},
      { path: 'auth', component: AuthComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabledBlocking' })],
    exports: [RouterModule]
})

export class AppRoutingModule {}
