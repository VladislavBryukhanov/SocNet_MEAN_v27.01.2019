import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user';
import {Observable} from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUserList(maxCount: number = 1, currentPage: number = 0): Observable<User[]> {
    return this.http.get<User[]>(`/users/getUsers/${maxCount}&${currentPage}`);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`/users/getUser/${id}`);
  }
}
