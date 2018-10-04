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

  constructor(private authService: AuthService, private formBuilder: FormBuilder) { }

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
    const newUser: User = new User(
      this.formGroup.get('login').value,
      this.formGroup.get('username').value,
      this.formGroup.get('password').value
    );
    this.authService.signUp(newUser);
    // for (let i = 39; i < 81; i++) {
    //   const user: User = new User(
    //     this.formGroup.get('login').value + i,
    //     this.formGroup.get('username').value + i,
    //     this.formGroup.get('password').value + i
    //   );
    //   this.authService.signUp(user);
    // }
  }

}
