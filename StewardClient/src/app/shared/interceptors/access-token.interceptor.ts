import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { Observable } from 'rxjs';

/** Defines the access token interceptor. */
@Injectable()
export class AccessTokenInterceptor implements HttpInterceptor {
  constructor(protected store: Store) {}

  /** Intercept logic that adds bearer token to request header. */
  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    let accessToken = this.store.selectSnapshot<string | null | undefined>(UserState.accessToken);
    accessToken = !!accessToken ? accessToken : '';
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return next.handle(request);
  }
}
