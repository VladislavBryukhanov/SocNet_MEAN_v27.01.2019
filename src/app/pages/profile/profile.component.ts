import { Component, OnInit } from '@angular/core';
import {UsersService} from '../../services/users.service';
import {User} from '../../models/user';
import {ActivatedRoute, NavigationEnd, Route, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public profile: User;

  constructor(private userService: UsersService,
              private router: ActivatedRoute,
              public authService: AuthService,
              private _router: Router) {

    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this._router.navigated = false;
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnInit() {
    this.router.url.subscribe(_ => {
      this.userService.getUserById(this.router.snapshot.params['id'])
        .subscribe(res => {
          this.profile = res;
        });
    });
  }

}