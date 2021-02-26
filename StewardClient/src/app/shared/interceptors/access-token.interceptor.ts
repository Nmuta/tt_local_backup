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
import { Observable } from 'rxjs';
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

    return next.handle(request).pipe(
      catchError(error => {
        if (this.isAuthError(error) && !this.hasAlreadyRetried(request)) {
          return this.store.dispatch(new RecheckAuth()).pipe(
            timeout(3_000),
            switchMap(() => {
              request = this.setAccessTokenHeader(request);
              request = request.clone({
                setParams: {
                  [this.tokenRetryParam]: 'true',
                },
              });
              return next.handle(request);
            }),
          );
        }

        throw error;
      }),
    );
  }

  private isAuthError(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === 401;
  }

  private hasAlreadyRetried(request: HttpRequest<unknown>): boolean {
    const retried = request.params.get(this.tokenRetryParam);
    return !!retried;
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
