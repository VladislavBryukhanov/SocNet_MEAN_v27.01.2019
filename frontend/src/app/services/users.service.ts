import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user';
import {Observable} from 'rxjs/index';
import {PaginatedUsers} from "../models/paginatedUsers";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUserList(limit: number = 1, currentPage: number = 0): Observable<PaginatedUsers> {
    return this.http.get<PaginatedUsers>(`/users/getUsers/${limit}&${currentPage * limit}`);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`/users/getUser/${id}`);
  }
}
