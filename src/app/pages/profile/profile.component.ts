import { Component, OnInit } from '@angular/core';
import {UsersService} from '../../services/users.service';
import {User} from '../../models/user';
import {ActivatedRoute, Route} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public profile: User;

  constructor(private userService: UsersService, private router: ActivatedRoute) { }

  ngOnInit() {
    this.router.url.subscribe(_ => {
      this.userService.getUserById(this.router.snapshot.params['id'])
        .subscribe(res => {
          this.profile = res;
        });
    });
  }

}
