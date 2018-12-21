import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/index';
import {Rate} from '../models/rate';
import {PaginatedUsers} from "../models/paginatedUsers";
import {FullRateInfo} from "../models/fullRateInfo";

@Injectable({
  providedIn: 'root'
})
export class RateService {

  constructor(private http: HttpClient) { }

  getRatedUsers(itemId: string,
                isPositive: boolean,
                limit: number = 1,
                currentPage: number = 0): Observable<PaginatedUsers> {
      return this.http.get<PaginatedUsers>(
        `/rate/getRatedUsers/${itemId}&${isPositive}&${limit}&${currentPage * limit}`);
  }

  getRate(itemId: string, userId: string): Observable<FullRateInfo> {
    return this.http.get(`/rate/getRateCounter/${itemId}&${userId}`);
  }

  postRate(rate: Rate): Observable<Rate> {
    return this.http.post<Rate>('/rate/postRate', rate);
  }

}
