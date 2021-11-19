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
import { toDateTime, toDuration } from '@helpers/luxon';

type DeepMapPairsFn = ([key, value]) => [string, unknown];
function deepMapPairs(
  input: unknown,
  transform: DeepMapPairsFn,
  seen = new Map<unknown, unknown>(),
) {
  if (seen.has(input)) {
    return seen.get(input);
  }

  if (isArray(input)) {
    const result = map(input, (inner, _index) => deepMapPairs(inner, transform, seen));
    seen.set(input, result);
    return result;
  }

  if (isPlainObject(input)) {
    const result = chain(input)
      .toPairs()
      .map(transform)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(([key, inner]) => [key, deepMapPairs(inner, transform, seen)])
      .fromPairs()
      .value();
    seen.set(input, result);
    return result;
  }

  return input;
}

/** An interceptor that converts all model fields that match one of these rules to the corresponding luxon type:
 * - *Utc to DateTime
 * - *Duration to Duration
 */
@Injectable()
export class UtcInterceptor implements HttpInterceptor {
  /** Interceptor hook. */
  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const shouldHandle =
      request.responseType === 'json' &&
      (request.url.startsWith(environment.stewardApiUrl) ||
        request.url.startsWith(environment.stewardApiStagingUrl));

    if (!shouldHandle) {
      return next.handle(request);
    }

    return this.handle(request, next);
  }

  /** Called when we attempt to handle the request. */
  public handle(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      filter(event => event instanceof HttpResponse),
      rxMap((event: HttpResponse<Record<string, unknown>>) => {
        const newBody = deepMapPairs(event.body, ([key, value]) => {
          if (key.endsWith('Utc') && typeof value === 'string') {
            return [key, toDateTime(value)];
          }

          if (key.toUpperCase().endsWith('DURATION') && typeof value === 'string') {
            return [key, toDuration(value)];
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
