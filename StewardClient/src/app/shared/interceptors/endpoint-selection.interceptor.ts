import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Store } from '@ngxs/store';
import { AppState } from '@shared/state/app-state';
import { keys } from 'lodash';
import { Observable } from 'rxjs';

/** Intercepts requests to Steward and attaches endpoint header based on user's endpoint selection. */
@Injectable()
export class EndpointSelectionInterceptor implements HttpInterceptor {
  private readonly headerName: string = 'endpointKey';

  constructor(private readonly store: Store) {}

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
    /** Allow passthrough if the endpointKey header is already set. */
    if (keys(request.headers).includes(this.headerName)) {
      return next.handle(request);
    }

    const apolloRegex = /^\/?api\/v1\/title\/apollo.*$/i;
    const sunriseRegex = /^\/?api\/v1\/title\/sunrise.*$/i;
    const woodstockRegex = /^\/?api\/v1\/title\/woodstock.*$/i;
    const steelheadRegex = /^\/?api\/v1\/title\/steelhead.*$/i;
    const url = new URL(request.url);
    let requestWithHeader: HttpRequest<unknown> = request.clone();

    if (apolloRegex.test(url.pathname)) {
      const endpointKey = this.store.selectSnapshot<string>(
        (state: AppState) => state.userSettings.apolloEndpointKey,
      );

      requestWithHeader = request.clone({
        headers: request.headers.set(this.headerName, 'Apollo|' + endpointKey),
      });
    }

    if (sunriseRegex.test(url.pathname)) {
      const endpointKey = this.store.selectSnapshot<string>(
        (state: AppState) => state.userSettings.sunriseEndpointKey,
      );

      requestWithHeader = request.clone({
        headers: request.headers.set(this.headerName, 'Sunrise|' + endpointKey),
      });
    }

    if (woodstockRegex.test(url.pathname)) {
      const endpointKey = this.store.selectSnapshot<string>(
        (state: AppState) => state.userSettings.woodstockEndpointKey,
      );

      requestWithHeader = request.clone({
        headers: request.headers.set(this.headerName, 'Woodstock|' + endpointKey),
      });
    }

    if (steelheadRegex.test(url.pathname)) {
      const endpointKey = this.store.selectSnapshot<string>(
        (state: AppState) => state.userSettings.steelheadEndpointKey,
      );

      requestWithHeader = request.clone({
        headers: request.headers.set(this.headerName, 'Steelhead|' + endpointKey),
      });
    }

    return next.handle(requestWithHeader);
  }
}
