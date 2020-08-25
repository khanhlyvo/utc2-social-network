import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authenticate.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // add authorization header with jwt token if available
    const currentUtc2User = this.authenticationService.currentUtc2UserValue;
    if (currentUtc2User && currentUtc2User['token']) {
      request = request.clone({
          setHeaders: {
              token: currentUtc2User['token']
          }
      });
    }

    return next.handle(request);
  }
}
