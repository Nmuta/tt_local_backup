import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as JSONBig from 'json-bigint';
import _ from 'lodash';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

const JSONAlwaysBig = JSONBig({alwaysParseAsBig: true});

/** Uses JSONBig(alwaysParseAsBig) to handle parse+stringify rather than the defualt JSON, which does not handle BigInts. */
@Injectable()
export class BigintInterceptor implements HttpInterceptor {
  /** The interceptor hook. */
  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const shouldHandle = request.responseType === "json";
    if (!shouldHandle) {
      return next.handle(request);
    }

    const newRequest = request.clone({
      body: JSONAlwaysBig.stringify(request.body),
      responseType: "text",
    });

    return next.handle(newRequest)
      .pipe(
        filter(event => event instanceof HttpResponse),
        map((event: HttpResponse<any>) => {
          const newBody = JSONAlwaysBig.parse(event.body);
          return event.clone({
            body: newBody,
          });
        }),
      );
  }
}
