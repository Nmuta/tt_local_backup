import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { JSONBigInt } from '@helpers/json-bigint';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

/** Uses JSONBig(alwaysParseAsBig) to handle parse+stringify rather than the defualt JSON, which does not handle BigInts. */
@Injectable()
export class BigNumberInterceptor implements HttpInterceptor {
  /** The interceptor hook. */
  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const shouldHandle =
      request.responseType === 'json' && request.url.startsWith(environment.stewardApiUrl);
    if (!shouldHandle) {
      return next.handle(request);
    }

    return this.handle(request, next);
  }

  /** Called when we attempt to handle the request. */
  public handle(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const newRequest = request.clone({
      body: JSONBigInt.stringify(request.body),
      responseType: 'text',
    });

    return next.handle(newRequest).pipe(
      filter(event => event instanceof HttpResponse),
      map((event: HttpResponse<string>) => {
        if (!event.body) {
          return event.clone({ body: event.body });
        }
        const newBody = JSONBigInt.parse(event.body);
        return event.clone({
          body: newBody,
        });
      }),
    );
  }
}
