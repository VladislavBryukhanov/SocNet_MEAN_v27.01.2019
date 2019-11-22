import { Injectable } from '@angular/core';
import {Observable, of, throwError, BehaviorSubject} from 'rxjs/index';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user';
import {Router} from '@angular/router';
import {catchError, map} from 'rxjs/internal/operators';
import {Location} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  get authToken(): string {
    return this._authToken;
  }

  get myUser(): User {
    return this.myUserSubject.value;
  }

  get redirectUrl(): string {
    return this._redirectUrl;
  }

  set redirectUrl(value: string) {
    this._redirectUrl = value;
  }

  private _redirectUrl = '/user_list';
  private _authToken: string;
  public myUserSubject: BehaviorSubject<User> = new BehaviorSubject(null);

  constructor (private http: HttpClient, private router: Router, private location: Location) { }

  signUp(user: User) {
    this.authentication(
      this.http.post<string>('/signUp', user)
    );
  }

  signIn(user) {
    this.authentication(
      this.http.post<string>('/signIn', user)
    );
  }

  signOut() {
    localStorage.removeItem('AuthToken');
    this.myUserSubject.next(null);
    this.router.navigate(['/']);
  }

  getProfile(): Observable<void> {
    this._authToken = this.getAuthToken();
    if (!this._authToken) {
      const err = {status: 401};
      return throwError(err);
    }
    return this.http.get<User>('/getProfile').pipe(
      map(user => {
        this.myUserSubject.next(user);
        // this.router.navigate([this.redirectUrl]);
      }),
      catchError((err) => {
          console.log(err.status);
          if (err.status === 401) {
            this.signOut();
            return throwError(err);
          }
        })
      );
  }

  authentication(payload: Observable<string>) {
    payload.subscribe((res) => {
      this.saveAuthToken(res['token']);
      this._authToken = this.getAuthToken();
      this.getProfile()
        .subscribe(_ =>
          this.router.navigate([this.redirectUrl])
        );
      // this.router.navigate([this.redirectUrl]);
    });
  }

  saveAuthToken(token: string) {
    localStorage.setItem(
      'AuthToken',
      `Bearer ${token}`
    );
  }

  getAuthToken(): string {
    return localStorage.getItem('AuthToken');
  }


  editProfile(user: FormData) {
    return this.http.put<User>('/editProfile', user)
      .subscribe(user => {
        // this.saveAuthToken(res['token']);
        // this._authToken = this.getAuthToken();
        // this.myUserSubject = res['user'];
        this.myUserSubject.next(user);
        this.location.back();
      });
  }
}
