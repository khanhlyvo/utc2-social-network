import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let tokenRequest = request;
    if (!request.headers.get('Content-Type')) {
      tokenRequest = request.clone({
        headers: request.headers.set('Content-Type', 'application/json; charset=utf-8')
      });
    }

    return next.handle(tokenRequest);
  }
}
