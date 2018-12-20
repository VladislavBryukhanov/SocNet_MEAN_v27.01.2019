import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AnonGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (this.authService.myUser) {
      this.router.navigate([this.authService.redirectUrl]);
    } else {
      this.authService.getProfile()
        .subscribe(_ => {
          this.router.navigate([this.authService.redirectUrl]);
        }, err => {
          if (err.status === 401) {
            console.log('Unauthorized');
          }
        });
      return true;
    }
  }
}
