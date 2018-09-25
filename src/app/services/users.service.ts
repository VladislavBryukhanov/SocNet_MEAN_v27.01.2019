import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user';
import {Observable} from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUserList(): Observable<User[]> {
    return this.http.get<User[]>('/users/getUsers');
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`/users/getUser/${id}`);
  }
}
