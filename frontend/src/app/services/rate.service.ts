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
                targetModel: string,
                isPositive: boolean,
                limit: number = 1,
                currentPage: number = 0): Observable<PaginatedUsers> {
      return this.http.get<PaginatedUsers>(
        `/rate/getRatedUsers/${itemId}&${targetModel}&${isPositive}&${limit}&${currentPage * limit}`);
  }

  getRate(itemId: string, targetModel: string, userId: string): Observable<FullRateInfo> {
    return this.http.get<FullRateInfo>(`/rate/getRateCounter/${itemId}&${targetModel}&${userId}`);
  }

  postRate(rate: Rate, targetModel: string, itemId: string): Observable<Rate> {
    return this.http.post<Rate>('/rate/postRate', {rate, targetModel, itemId});
  }

}
