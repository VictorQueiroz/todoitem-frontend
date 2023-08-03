import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const url = new URL(request.urlWithParams, environment.azure.baseUrl);
    return next.handle(
      request.clone({
        url: url.href,
        headers: new HttpHeaders({
          'x-functions-key': environment.azure.systemKey,
        }),
      })
    );
  }
}
