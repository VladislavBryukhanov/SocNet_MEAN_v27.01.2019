import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AnonGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (this.authService.isAuthenticated) {
      // this.router.navigate(['/user_list']);
      this.router.navigate([this.authService.redirectUrl]);
      return false;
    } else {
      this.authService.autoSignIn()
        .subscribe(_ => {
          // this.router.navigate(['/user_list']);
          this.router.navigate([this.authService.redirectUrl]);
          return false;
        }, err => {
          console.log(err);
          if (err.status === 401) {
            return true;
          }
        });
      // return true;
    }
  }
}
