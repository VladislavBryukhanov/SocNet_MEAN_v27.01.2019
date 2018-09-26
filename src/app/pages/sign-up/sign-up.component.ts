import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../models/user';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  public formGroup: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(2)
      ]),
      login: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ])
    });
  }

  onSignUp() {
    // const newUser = new FormData();
    // newUser.append('username', this.formGroup.get('username').value);
    // newUser.append('login', this.formGroup.get('login').value);
    // newUser.append('password', this.formGroup.get('password').value);
    const newUser: User = new User(
      this.formGroup.get('login').value,
      this.formGroup.get('username').value,
      this.formGroup.get('password').value
    );
    this.authService.signUp(newUser)
      .subscribe(res => {
        console.log(res);
        this.authService.setAuthToken(res['token']);
        const redirectUrl = this.authService.redirectUrl ? this.authService.redirectUrl : '/user_list';
        this.router.navigate([redirectUrl]);
      });
  }

}
