import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Store } from '@ngxs/store';
import { LoggerService } from '@services/logger';
import { RecheckAuth } from '@shared/state/user/user.actions';
import { UserState } from '@shared/state/user/user.state';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, timeout } from 'rxjs/operators';

/** Defines the access token interceptor. */
@Injectable()
export class AccessTokenInterceptor implements HttpInterceptor {
  public tokenRetryParam: string = 'tokenRetry';

  constructor(private readonly store: Store, private readonly logger: LoggerService) {}

  /** Intercept logic that adds bearer token to request header. */
  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const shouldHandle = request.url.startsWith(environment.stewardApiUrl);
    if (!shouldHandle) {
      return next.handle(request);
    }

    request = this.setAccessTokenHeader(request);
    let retryCount = 0;
    return next.handle(request).pipe(
      catchError(error => {
        if (this.isAuthError(error) && retryCount <= 3) {
          const retryDuration = 500 * (retryCount*retryCount);
          retryCount++;
          return this.store.dispatch(new RecheckAuth()).pipe(
            timeout(retryDuration),
            switchMap(() => {
              request = this.setAccessTokenHeader(request);
              return next.handle(request);
            }),
          );
        }

        return throwError(error);
      }),
    );
  }

  private isAuthError(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === 401;
  }

  private setAccessTokenHeader(request: HttpRequest<unknown>): HttpRequest<unknown> {
    let accessToken = this.store.selectSnapshot<string | null | undefined>(UserState.accessToken);
    accessToken = !!accessToken ? accessToken : '';

    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
}
