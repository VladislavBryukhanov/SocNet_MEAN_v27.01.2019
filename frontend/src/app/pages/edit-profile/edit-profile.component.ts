import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {ImagePathPipe} from "../../pipes/image-path.pipe";
import {ImageResizerPipe} from "../../pipes/image-resizer.pipe";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  public formGroup: FormGroup;
  private avatar: File;
  private prevAvatar;
  public avatarPreview;

  constructor(private formBuilder: FormBuilder,
              public authService: AuthService) { }

  ngOnInit() {
    this.prevAvatar = new ImageResizerPipe()
      .transform(this.authService.myUser.avatar, 'normal');
    this.avatarPreview = new ImagePathPipe().transform(this.prevAvatar);

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
    this.getFileBlob(this.avatar);
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

  getFileBlob(file: File) {
    const fileReader = new FileReader();
    fileReader.onload = _ => {
      this.avatarPreview = fileReader.result;
    };
    fileReader.readAsDataURL(file);
  }
}
