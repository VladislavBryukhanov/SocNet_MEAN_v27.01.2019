import { Component, OnInit } from '@angular/core';
import {FormGroup} from "@angular/forms";
import {User} from "../../models/user";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  public login: String;
  public password: String;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onSignIn() {
    const authData = {
      login: this.login,
      password: this.password
    };
    this.authService.signIn(authData)
      .subscribe(res => {
        console.log(res);
        this.authService.setAuthToken(res['token']);
        const redirectUrl = this.authService.redirectUrl ? this.authService.redirectUrl : '/user_list';
        this.router.navigate([redirectUrl]);
      });
  }

}
