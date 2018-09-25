import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/index';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor (private http: HttpClient) { }

  static getAuthToken() {
    const cookieName = 'AuthToken';
    const matches = document.cookie.match(new RegExp(
      `(?:^|; )${cookieName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`
    ));
    return matches ? decodeURIComponent(`Bearer ${matches[1]}`) : undefined;
  }

  signUp(user: User): Observable<User> {
    return this.http.post<User>('/signUp', user);
  }

  signIn(user): Observable<User> {
    return this.http.post<User>('/signIn', user);
  }


  // TODO replace setAuth to signIn/up method

  setAuthToken(token: String) {
    const maxAge: String = `Max-Age=${365 * 24 * 60 * 60};`;
    document.cookie = `AuthToken=${token}; ${maxAge}`;
    console.log(AuthService.getAuthToken());
  }

  getProfile(): Observable<User> {
    return this.http.get<User>('/autoSignIn');
  }
}
