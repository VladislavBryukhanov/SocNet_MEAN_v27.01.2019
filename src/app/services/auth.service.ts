import { Injectable } from '@angular/core';
import {Observable, of, throwError} from 'rxjs/index';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user';
import {Router} from '@angular/router';
import {catchError, map} from 'rxjs/internal/operators';
import {Location} from '@angular/common';

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

  constructor (private http: HttpClient, private router: Router, private location: Location) { }

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

  signOut() {
    localStorage.removeItem('AuthToken');
    this.isAuthenticated = false;
    this._myUser = null;
    this.router.navigate(['/']);
  }

  autoSignIn(): Observable<void> {
    if (!this.getAuthToken()) {
      const err = {status: 401};
      return throwError(err);
    }
    this._authToken = this.getAuthToken();
    return this.http.get<User>('/autoSignIn').pipe(
        map(user => {
          this._myUser = user;
          this.isAuthenticated = true;
          this.router.navigate([this.redirectUrl]);
        }),
      catchError((err) => {
          console.log(err.status);
          if (err.status === 401) {
            localStorage.removeItem('AuthToken');
            // signOut();
            return throwError(err);
          }
        })
      );
  }

  authentication(payload: Observable<User>) {
    payload.subscribe(res => {
      this.saveAuthToken(res['token']);
      this._authToken = this.getAuthToken();
      this._myUser = res['user'];
      this.isAuthenticated = true;
      this.router.navigate([this.redirectUrl]);
    });
  }

  saveAuthToken(token: String) {
    localStorage.setItem(
      'AuthToken',
      `Bearer ${token}`
    );
  }

  getAuthToken(): String {
    return localStorage.getItem('AuthToken');
  }


  editProfile(user: FormData) {
    return this.http.put<User>('/users/editProfile', user)
      .subscribe(res => {
        this.saveAuthToken(res['token']);
        this._authToken = this.getAuthToken();
        this._myUser = res['user'];
        this.location.back();
      });
  }
}
