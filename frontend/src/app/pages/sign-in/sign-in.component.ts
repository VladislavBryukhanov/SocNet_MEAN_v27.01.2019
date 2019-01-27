import { Component } from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {

  public login: string;
  public password: string;

  constructor(private authService: AuthService) { }

  onSignIn() {
    const authData = {
      login: this.login,
      password: this.password
    };
    this.authService.signIn(authData);
  }

}
