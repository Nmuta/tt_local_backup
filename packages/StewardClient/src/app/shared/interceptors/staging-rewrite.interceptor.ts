import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Store } from '@ngxs/store';
import { UserSettingsState } from '@shared/state/user-settings/user-settings.state';
import { WindowService } from '@services/window';

/** An interceptor that sends API requests to Steward staging slot. */
@Injectable()
export class StagingRewriteInterceptor implements HttpInterceptor {
  constructor(private readonly store: Store, private readonly windowService: WindowService) {}

  /** Interceptor hook. */
  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const fakeApiEnabled = this.store.selectSnapshot<boolean>(UserSettingsState.enableFakeApi);
    const location = this.windowService.location();

    const shouldHandle =
      request.responseType === 'json' &&
      request.url.startsWith(environment.stewardApiUrl) &&
      environment.production &&
      !fakeApiEnabled && // Fake API will override this interceptor
      location?.origin === environment.stewardUiStagingUrl; // Only allowed on ui staging slot

    if (!shouldHandle) {
      return next.handle(request);
    }

    return this.handle(request, next);
  }

  /** Called when we attempt to handle the request. */
  public handle(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const url = new URL(request.url);
    const stagingRequest = `${environment.stewardApiStagingUrl}${url.pathname}?${url.search}`;
    request = request.clone({
      url: stagingRequest,
    });

    return next.handle(request);
  }
}
