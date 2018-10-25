import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/index';
import {Rate} from '../models/rate';

@Injectable({
  providedIn: 'root'
})
export class RateService {

  constructor(private http: HttpClient) { }

  getRate(itemId: string, userId: string): Observable<Object> {
    return this.http.get(`/rate/getRateCounter/${itemId}&${userId}`);
  }

  postRate(rate: Rate): Observable<Rate> {
    return this.http.post<Rate>('/rate/postRate', rate);
  }

}
