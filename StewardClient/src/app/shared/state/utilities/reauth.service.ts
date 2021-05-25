import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpError } from '@microsoft/signalr';
import { UserModel } from '@models/user.model';
import { Select, Store } from '@ngxs/store';
import { LoggerService, LogTopic } from '@services/logger';
import { RecheckAuth } from '@shared/state/user/user.actions';
import { UserState } from '@shared/state/user/user.state';
import { EMPTY, MonoTypeOperatorFunction, Observable, throwError } from 'rxjs';
import { catchError, first, switchMap, tap } from 'rxjs/operators';

/** The current number of requests intercepted by auth service. */
let requestCounter = 0;

/** Provides utilities for re-authing the current user in a safe and well-logged fashion. */
@Injectable({
  providedIn: 'root',
})
export class ReauthService {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  constructor(private readonly logger: LoggerService, private readonly store: Store) {}

  /** Re-performs auth once on 401 failure. Restarts with the passed observable. */
  public reauthOnFailure<T>(
    url: string,
    restartWith$: () => Observable<T>,
  ): MonoTypeOperatorFunction<T> {
    const requestId = requestCounter++;

    this.logger.log([LogTopic.AuthInterception], `[${requestId}] [starting request]`, url);

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    return function (source$: Observable<T>): Observable<T> {
      return source$.pipe(
        tap(() =>
          self.logger.log([LogTopic.AuthInterception], `[${requestId}] [request successful]`, url),
        ),
        catchError((error, _source) => {
          if (self.isAuthError(error)) {
            self.logger.log([LogTopic.AuthInterception], `[${requestId}] [rechecking auth]`, url);
            self.logger.warn([LogTopic.Auth], 'Authentication error encountered. Retrying.');

            self.store.dispatch(new RecheckAuth()).subscribe();
            return UserState.latestValidProfile$(self.profile$).pipe(
              first(),
              tap(() =>
                self.logger.log(
                  [LogTopic.AuthInterception],
                  `[${requestId}] [rechecked auth]`,
                  url,
                ),
              ),
              catchError(error2 => {
                self.logger.log(
                  [LogTopic.AuthInterception],
                  `[${requestId}] [reauth error]`,
                  url,
                  error2,
                );
                return EMPTY as Observable<T>;
              }),
              tap(() =>
                self.logger.log(
                  [LogTopic.AuthInterception],
                  `[${requestId}] [retrying request]`,
                  url,
                ),
              ),
              switchMap(_profile => {
                return restartWith$().pipe(
                  tap(() =>
                    self.logger.log(
                      [LogTopic.AuthInterception],
                      `[${requestId}] [retry successful]`,
                      url,
                    ),
                  ),
                  catchError(error3 => {
                    self.logger.log(
                      [LogTopic.AuthInterception],
                      `[${requestId}] [retry failed]`,
                      url,
                    );
                    return throwError(error3);
                  }),
                );
              }),
            );
          }

          self.logger.log([LogTopic.AuthInterception], `[${requestId}] [request failed]`, url);

          return throwError(error);
        }),
      );
    };
  }

  private isAuthError(error: unknown): boolean {
    const angularAuthError = error instanceof HttpErrorResponse && error.status === 401;
    const signalrAuthError = error instanceof HttpError && error.statusCode === 401;
    return angularAuthError || signalrAuthError;
  }
}
