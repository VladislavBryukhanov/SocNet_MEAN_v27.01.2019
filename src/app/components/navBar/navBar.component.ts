import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './navBar.component.html',
  styleUrls: ['./navBar.component.scss']
})

export class NavBarComponent implements OnInit {

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
  }

  signOut() {
    this.authService.signOut();
  }

}
