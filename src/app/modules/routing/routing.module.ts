import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SignInComponent} from '../../pages/sign-in/sign-in.component';
import {SignUpComponent} from '../../pages/sign-up/sign-up.component';
import {UserListComponent} from '../../pages/user-list/user-list.component';
import {AuthGuardService} from '../../services/auth-guard.service';
import {AnonGuardService} from '../../services/anon-guard.service';
import {ProfileComponent} from '../../pages/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: SignInComponent,
    canActivate: [AnonGuardService],
    pathMatch: 'full'
  },
  {
    path: 'sign_up',
    component: SignUpComponent,
    canActivate: [AnonGuardService]
  },
  {
    path: 'user_list',
    component: UserListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule { }
