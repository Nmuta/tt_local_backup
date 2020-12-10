import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { chain, isArray, isPlainObject, map } from 'lodash';
import { filter, map as rxMap } from 'rxjs/operators';

type DeepMapPairsFn = ([key, value]) => [string, unknown];
function deepMapPairs(input: unknown, transform: DeepMapPairsFn, seen = new Set<unknown>()): unknown {
  if (seen.has(input)) {
    return input;
  }

  if (isArray(input)) {
    seen.add(input);
    return map(input, (inner, _index) => deepMapPairs(inner, transform, seen));
  }

  if (isPlainObject(input)) {
    seen.add(input);
    return chain(input)
      .toPairs()
      .map(transform)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(([key, inner]) => [key, deepMapPairs(inner, transform, seen)])
      .fromPairs()
      .value();
  }

  return input;
}

/** An interceptor that converts all model fields named *Utc to the appropriate date type. */
@Injectable()
export class UtcInterceptor implements HttpInterceptor {
  /** Interceptor hook. */
  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const shouldHandle =
      request.responseType === 'json' && request.url.startsWith(environment.stewardApiUrl);

    if (!shouldHandle) {
      return next.handle(request);
    }

    return next.handle(request);
  }

  /** Called when we attempt to handle the request. */
  public handle(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      filter(event => event instanceof HttpResponse),
      rxMap((event: HttpResponse<Record<string, unknown>>) => {
        const newBody = deepMapPairs(event.body, ([key, value]) => {
          if (key.endsWith('Utc') && typeof value === 'string') {
            return [key, new Date(value)];
          }

          return [key, value];
        });

        return event.clone({
          body: newBody,
        });
      }),
    );
  }
}
