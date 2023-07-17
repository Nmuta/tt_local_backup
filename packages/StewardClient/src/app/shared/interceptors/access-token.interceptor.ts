import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { UserModel } from '@models/user.model';
import { Select, Store } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { ReauthService } from '@shared/state/utilities/reauth.service';
import { Observable } from 'rxjs';

/** Defines the access token interceptor. */
@Injectable()
export class AccessTokenInterceptor implements HttpInterceptor {
  @Select(UserState.profile) public profile$: Observable<UserModel>;
  public tokenRetryParam: string = 'tokenRetry';

  constructor(private readonly store: Store, private readonly reauthService: ReauthService) {}

  /** Intercept logic that adds bearer token to request header. */
  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const shouldHandle =
      request.url.startsWith(environment.stewardApiUrl) ||
      request.url.startsWith(environment.stewardApiStagingUrl);
    if (!shouldHandle) {
      return next.handle(request);
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    function doRequest$() {
      request = self.setAccessTokenHeader(request);
      return next.handle(request);
    }

    return doRequest$().pipe(this.reauthService.reauthOnFailure(request.url, () => doRequest$()));
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
