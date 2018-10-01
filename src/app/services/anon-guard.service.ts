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
      this.router.navigate(['/user_list']);
    } else {
      this.authService.autoSignIn()
        .subscribe(_ => {
          this.router.navigate(['/user_list']);
        }, err => {
          if (err.status === 401) {
            console.log('Unauthorized');
          }
        });
      return true;
    }
  }
}
