import { Injectable } from '@angular/core';
import {Observable, of, throwError} from 'rxjs/index';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user';
import {Router} from '@angular/router';
import { map} from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  get authToken(): String {
    return this._authToken;
  }

  set authToken(value: String) {
    this._authToken = value;
  }

  get myUser(): User {
    return this._myUser;
  }

  set myUser(value: User) {
    this._myUser = value;
  }

  get redirectUrl(): String {
    return this._redirectUrl;
  }

  set redirectUrl(value: String) {
    this._redirectUrl = value;
  }

  private _redirectUrl: String = '/user_list';
  private _myUser: User;
  public _authToken: String;
  public isAuthenticated = false;

  constructor (private http: HttpClient, private router: Router) { }

  signUp(user: User) {
    this.authentication(
      this.http.post<User>('/signUp', user)
    );
  }

  signIn(user) {
    this.authentication(
      this.http.post<User>('/signIn', user)
    );
  }

  autoSignIn(): Observable<void> {
    if (!this.getAuthToken()) {
      const err = {status: 401};
      return throwError(err);
    }
    this._authToken = this.getAuthToken();
    return this.http.get<User>('/autoSignIn').pipe(
        map(res => {
          this._myUser = res['user'];
          this.isAuthenticated = true;
          this.router.navigate([this.redirectUrl]);
        })
      );
  }

  authentication(payload: Observable<User>) {
    payload.subscribe(res => {
      this.saveAuthToken(res['token']);
      this._authToken = this.getAuthToken();
// this._authToken = res['token'];
      this._myUser = res['user'];
      this.isAuthenticated = true;
      this.router.navigate([this.redirectUrl]);
    });
  }

  // TODO replace setAuth to signIn/up method

  saveAuthToken(token: String) {
    const maxAge: String = `Max-Age=${365 * 24 * 60 * 60};`;
    document.cookie = `AuthToken=${token}; ${maxAge}`;
  }

  getAuthToken(): String {
    const cookieName = 'AuthToken';
    const matches = document.cookie.match(new RegExp(
      `(?:^|; )${cookieName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`
    ));
    return matches ? decodeURIComponent(`Bearer ${matches[1]}`) : undefined;
  }


}
