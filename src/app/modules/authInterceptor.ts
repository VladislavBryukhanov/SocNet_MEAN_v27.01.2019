import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/index';
import {AuthService} from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // public static url = 'http://192.168.1.5:31315';
  public static hostUrl = 'http://192.168.1.214:31315';
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = AuthService.getAuthToken();
    if (token) {
      req = req.clone({
        url: AuthInterceptor.hostUrl + req.url,
        headers: new HttpHeaders({
          authorization: token
        })
      });
    } else {
      req = req.clone({
        url: AuthInterceptor.hostUrl + req.url
      });
    }
    console.log(req.url);
    return next.handle(req);
  }
}
