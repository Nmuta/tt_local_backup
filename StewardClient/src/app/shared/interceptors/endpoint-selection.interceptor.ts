import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseInterceptor } from '@components/base-component/base.interceptor';
import { environment } from '@environments/environment';
import { Select, Store } from '@ngxs/store';
import {
  UserSettingsState,
  UserSettingsStateModel,
} from '@shared/state/user-settings/user-settings.state';
import { filter, map, Observable, ReplaySubject, switchMap, take, throwError, timeout } from 'rxjs';

type CustomHandler = (
  latestValidUserSettings: UserSettingsStateModel,
  request: HttpRequest<unknown>,
  next: HttpHandler,
) => Observable<HttpEvent<unknown>>;

/** Intercepts requests to Steward and attaches endpoint header based on user's endpoint selection. */
@Injectable()
export class EndpointSelectionInterceptor extends BaseInterceptor implements HttpInterceptor {
  @Select(UserSettingsState) public settings$: Observable<UserSettingsStateModel>;

  private readonly validSettings$ = new ReplaySubject<UserSettingsStateModel>(1);
  private readonly headerName: string = 'endpointKey';
  private readonly validSettingsTimeoutMs = 120_000; // 2 minutes

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
    const v1Regex = /^\/?api\/v1\/title\/.*$/i;
    const v2Regex = /^\/?api\/v2\/.*$/i;
    const url = new URL(request.url);
    const isV1TitleUrl = v1Regex.test(url.pathname);
    const isV2Url = v2Regex.test(url.pathname);

    if (isV1TitleUrl) {
      const alreadyHasHeader = request.headers.has(this.headerName);
      if (alreadyHasHeader) {
        return next.handle(request);
      }

      return this.handleRequest(request, next, this.handleV1Request$.bind(this));
    } else if (isV2Url) {
      return this.handleRequest(request, next, this.handleV2Request$.bind(this));
    } else {
      return next.handle(request);
    }
  }

  private handleRequest(
    request: HttpRequest<unknown>,
    next: HttpHandler,
    customHandler$: CustomHandler,
  ): Observable<HttpEvent<unknown>> {
    return this.validSettings$.pipe(
      filter(v => !!v),
      timeout({
        first: this.validSettingsTimeoutMs,
        with: () => throwError(() => new Error('Waiting for valid endpoint settings timed out.')),
      }),
      take(1),
      switchMap(latestValidUserSettings => customHandler$(latestValidUserSettings, request, next)),
    );
  }

  /** Handles the given request. */
  private handleV1Request$(
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

  /** Handles the given request. */
  private handleV2Request$(
    latestValidUserSettings: UserSettingsStateModel,
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    let headers = request.headers;
    if (!headers.has('Endpoint-Apollo')) {
      headers = headers.set('Endpoint-Apollo', latestValidUserSettings.apolloEndpointKey);
    }

    if (!headers.has('Endpoint-Sunrise')) {
      headers = headers.set('Endpoint-Sunrise', latestValidUserSettings.sunriseEndpointKey);
    }

    if (!headers.has('Endpoint-Woodstock')) {
      headers = headers.set('Endpoint-Woodstock', latestValidUserSettings.woodstockEndpointKey);
    }

    if (!headers.has('Endpoint-Steelhead')) {
      headers = headers.set('Endpoint-Steelhead', latestValidUserSettings.steelheadEndpointKey);
    }

    const updatedRequest = request.clone({ headers });
    return next.handle(updatedRequest);
  }
}
