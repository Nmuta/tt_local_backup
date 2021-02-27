import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { UserModel } from '@models/user.model';
import { Select, Store } from '@ngxs/store';
import { LoggerService, LogTopic } from '@services/logger';
import { RecheckAuth } from '@shared/state/user/user.actions';
import { UserState } from '@shared/state/user/user.state';
import { concat, defer, Observable, throwError } from 'rxjs';
import { catchError, switchMap, delay, tap, first } from 'rxjs/operators';

let requestCounter = 0;
/** Defines the access token interceptor. */
@Injectable()
export class AccessTokenInterceptor implements HttpInterceptor {
  @Select(UserState.profile) public profile$: Observable<UserModel>;
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
    const requestId = requestCounter++;

    this.logger.log([LogTopic.AuthInterception], `[${requestId}] [starting request]`, request.url);
    request = this.setAccessTokenHeader(request);
    return next.handle(request)
    .pipe(
      tap(() => this.logger.log([LogTopic.AuthInterception], `[${requestId}] [request successful]`, request.url)),
      catchError((error, _source) => {
        if (this.isAuthError(error)) {
          this.logger.log([LogTopic.AuthInterception], `[${requestId}] [rechecking auth]`, request.url);
          this.logger.warn([LogTopic.Auth], 'Authentication error encountered. Retrying.');

          this.store.dispatch(new RecheckAuth());
          return UserState.latestValidProfile$(this.profile$).pipe(
            first(),
            tap(() => this.logger.log([LogTopic.AuthInterception], `[${requestId}] [rechecked auth]`, request.url)),
            tap(() => this.logger.log([LogTopic.AuthInterception], `[${requestId}] [retrying request]`, request.url)),
            switchMap(_profile => {
              request = this.setAccessTokenHeader(request);
              return next.handle(request).pipe(
                tap(() => this.logger.log([LogTopic.AuthInterception], `[${requestId}] [retry successful]`, request.url)),
                catchError(error2 => {
                  this.logger.log([LogTopic.AuthInterception], `[${requestId}] [retry failed]`, request.url);
                  return throwError(error2);
                }));
            })
          );
        }

        this.logger.log([LogTopic.AuthInterception], `[${requestId}] [request failed]`, request.url);
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
