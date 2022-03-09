import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseInterceptor } from '@components/base-component/base.interceptor';
import { environment } from '@environments/environment';
import { Select, Store } from '@ngxs/store';
import {
  UserSettingsState,
  UserSettingsStateModel,
} from '@shared/state/user-settings/user-settings.state';
import { filter, map, Observable, ReplaySubject, switchMap } from 'rxjs';

/** Intercepts requests to Steward and attaches endpoint header based on user's endpoint selection. */
@Injectable()
export class EndpointSelectionInterceptor extends BaseInterceptor implements HttpInterceptor {
  @Select(UserSettingsState) public settings$: Observable<UserSettingsStateModel>;

  private readonly validSettings$ = new ReplaySubject<UserSettingsStateModel>(1);
  private readonly headerName: string = 'endpointKey';

  constructor(private readonly store: Store) {
    super();

    this.settings$
      .pipe(
        map(v => {
          const containsAllEndpointKeys =
            v.apolloEndpointKey &&
            v.sunriseEndpointKey &&
            v.steelheadEndpointKey &&
            v.woodstockEndpointKey;
          if (containsAllEndpointKeys) {
            return v;
          } else {
            return null;
          }
        }),
      )
      .subscribe(v => this.validSettings$.next(v));

    this.onDestroy$.subscribe(() => this.validSettings$.complete());
  }

  /** Interception hook. */
  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (!request.url.startsWith(environment.stewardApiUrl)) {
      return next.handle(request);
    }

    return this.handle(request, next);
  }

  /** Called when we attempt to handle the request. */
  public handle(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const titleRegex = /^\/?api\/v1\/title\/.*$/i;
    const url = new URL(request.url);
    const alreadyHasHeader = request.headers.has(this.headerName);
    const isTitleUrl = titleRegex.test(url.pathname);

    if (alreadyHasHeader || !isTitleUrl) {
      return next.handle(request);
    }

    return this.validSettings$.pipe(
      filter(v => !!v),
      switchMap(latestValidUserSettings =>
        this.handleRequest(latestValidUserSettings, request, next),
      ),
    );
  }

  /** Handles the given request. */
  private handleRequest(
    latestValidUserSettings: UserSettingsStateModel,
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const apolloRegex = /^\/?api\/v1\/title\/apollo.*$/i;
    const sunriseRegex = /^\/?api\/v1\/title\/sunrise.*$/i;
    const woodstockRegex = /^\/?api\/v1\/title\/woodstock.*$/i;
    const steelheadRegex = /^\/?api\/v1\/title\/steelhead.*$/i;
    const url = new URL(request.url);
    let requestWithHeader: HttpRequest<unknown> = request.clone();

    if (apolloRegex.test(url.pathname)) {
      const endpointKey = latestValidUserSettings.apolloEndpointKey;

      requestWithHeader = request.clone({
        headers: request.headers.set(this.headerName, 'Apollo|' + endpointKey),
      });
    }

    if (sunriseRegex.test(url.pathname)) {
      const endpointKey = latestValidUserSettings.sunriseEndpointKey;

      requestWithHeader = request.clone({
        headers: request.headers.set(this.headerName, 'Sunrise|' + endpointKey),
      });
    }

    if (woodstockRegex.test(url.pathname)) {
      const endpointKey = latestValidUserSettings.woodstockEndpointKey;

      requestWithHeader = request.clone({
        headers: request.headers.set(this.headerName, 'Woodstock|' + endpointKey),
      });
    }

    if (steelheadRegex.test(url.pathname)) {
      const endpointKey = latestValidUserSettings.steelheadEndpointKey;

      requestWithHeader = request.clone({
        headers: request.headers.set(this.headerName, 'Steelhead|' + endpointKey),
      });
    }

    return next.handle(requestWithHeader);
  }
}
