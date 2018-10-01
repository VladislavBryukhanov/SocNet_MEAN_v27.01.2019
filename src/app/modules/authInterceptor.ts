import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/index';
import {AuthService} from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  public static hostUrl = 'http://192.168.0.102:31315';
  // public static hostUrl = 'http://10.1.1.234:31315';

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.authToken;
    // console.log(token);
    if (token) {
      req = req.clone({
        url: AuthInterceptor.hostUrl + req.url,
        headers: new HttpHeaders({
          authorization: `${token}`
        })
      });
    } else {
      req = req.clone({
        url: AuthInterceptor.hostUrl + req.url
      });
    }
    return next.handle(req);
  }
}
