import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated) {
      return true;
    } else {
      this.authService.autoSignIn()
        .subscribe(_ => {
          return true;
        }, err => {
          console.log(err);
          if (err.status === 401) {
            this.authService.redirectUrl = state.url;
            this.router.navigate(['/']);
            return false;
          }
        });
      return false;
    }
  }
}
