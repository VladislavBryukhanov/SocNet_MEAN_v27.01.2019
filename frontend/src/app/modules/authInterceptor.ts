import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/index';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.authToken;
    // console.log(token);
    if (token) {
      req = req.clone({
        url: environment.hostUrl + req.url,
        headers: new HttpHeaders({
          authorization: `${token}`
        })
      });
    } else {
      req = req.clone({
        url: environment.hostUrl + req.url
      });
    }
    return next.handle(req);
  }
}
