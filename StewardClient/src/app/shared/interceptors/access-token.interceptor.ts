import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Store } from '@ngxs/store';
import { LoggerService, LogTopic } from '@services/logger';
import { RecheckAuth } from '@shared/state/user/user.actions';
import { UserState } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

/** Defines the access token interceptor. */
@Injectable()
export class AccessTokenInterceptor implements HttpInterceptor {
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

    let accessToken = this.store.selectSnapshot<string | null | undefined>(UserState.accessToken);
    accessToken = !!accessToken ? accessToken : '';
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return next.handle(request).pipe(
      catchError((error, caught) => {
        if (error.status === 401) {
          this.logger.warn([LogTopic.Auth], 'Received 401; attempting silent reauth and retry');
          return this.store.dispatch(new RecheckAuth()).pipe(switchMap(() => caught));
        }

        return caught;
      }),
    );
  }
}
