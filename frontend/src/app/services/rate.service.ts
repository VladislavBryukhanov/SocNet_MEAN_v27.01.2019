import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/index';
import {Rate} from '../models/rate';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class RateService {

  constructor(private http: HttpClient) { }

  getRatedUsers(itemId: string,
                isPositive: boolean,
                maxCount: number = 1,
                currentPage: number = 0): Observable<User[]> {
      return this.http.get<User[]>(
        `/rate/getRatedUsers/${itemId}&${isPositive}&${maxCount}&${currentPage}`);
  }

  getRate(itemId: string, userId: string): Observable<Object> {
    return this.http.get(`/rate/getRateCounter/${itemId}&${userId}`);
  }

  postRate(rate: Rate): Observable<Rate> {
    return this.http.post<Rate>('/rate/postRate', rate);
  }

}
