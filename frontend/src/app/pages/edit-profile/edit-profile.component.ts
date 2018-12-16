import { Component, OnInit } from '@angular/core';
import {UsersService} from '../../services/users.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  public formGroup: FormGroup;
  private avatar: File;

  constructor(private formBuilder: FormBuilder,
              public authService: AuthService) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      avatar: null,
      username: new FormControl(this.authService.myUser.username, [
        Validators.required,
        Validators.minLength(2)
      ]),
      login: new FormControl(this.authService.myUser.login, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ])
    });
  }

  onAvatarChanged(e) {
    this.avatar = e.target.files[0];
  }

  onSaveChanges() {
    const profile = new FormData();
    if (this.avatar) {
      profile.append('avatar', this.avatar);
    }
    const password = this.formGroup.get('password').value;
    if (password) {
      profile.append('password', password);
    }
    profile.append('username', this.formGroup.get('username').value);
    profile.append('login', this.formGroup.get('login').value);
    this.authService.editProfile(profile);
  }

}
