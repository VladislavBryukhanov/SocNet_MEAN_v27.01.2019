import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/index';
import {AuthService} from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = 'http://192.168.1.214:31315';
    const token = AuthService.getAuthToken();
    if (token) {
      req = req.clone({
        url: url + req.url,
        headers: new HttpHeaders({
          authorization: token
        })
      });
    } else {
      req = req.clone({
        url: url + req.url
      });
    }
    return next.handle(req);
  }
}
