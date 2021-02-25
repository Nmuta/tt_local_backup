// TODO: disabling these since it's a passthru to API Service but I think there's a test harness for HTTP requests in general?
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Store } from '@ngxs/store';
import { LoggerService, LogTopic } from '@services/logger';
import { RecheckAuth } from '@shared/state/user/user.actions';
import { Logger } from 'msal';
import { Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

/** Defines the api service. */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: Store,
    private readonly logger: LoggerService,
  ) {}

  /** Sends a GET request. */
  public getRequest<T>(url: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    const apiUrl = `${environment.stewardApiUrl}/api/${url}`;
    const get = this.http
      .get<T>(apiUrl, {
        params,
        headers,
      })
      .pipe(
        catchError((error, caught) => {
          if (error.status === 401) {
            this.logger.warn([LogTopic.Auth], 'Received 401; attempting silent reauth and retry');
            return this.store.dispatch(new RecheckAuth()).pipe(switchMap(() => caught));
          }

          return caught;
        }),
      );

    return get;
  }

  /** Sends a POST request. */
  public postRequest<T>(url: string, object: any, params?: HttpParams): Observable<T> {
    const apiUrl = `${environment.stewardApiUrl}/api/${url}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const post = this.http
      .post<T>(apiUrl, object, {
        headers,
        params,
      })
      .pipe(
        catchError((error, caught) => {
          if (error.status === 401) {
            this.logger.warn([LogTopic.Auth], 'Received 401; attempting silent reauth and retry');
            return this.store.dispatch(new RecheckAuth()).pipe(switchMap(() => caught));
          }

          return caught;
        }),
      );

    return post;
  }

  /** Sends a PUT request. */
  public putRequest<T>(url: string, object: any, params?: HttpParams): Observable<T> {
    const apiUrl = `${environment.stewardApiUrl}/api/${url}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const put = this.http
      .put<T>(apiUrl, object, {
        headers,
        params,
      })
      .pipe(
        catchError((error, caught) => {
          if (error.status === 401) {
            this.logger.warn([LogTopic.Auth], 'Received 401; attempting silent reauth and retry');
            return this.store.dispatch(new RecheckAuth()).pipe(switchMap(() => caught));
          }

          return caught;
        }),
      );

    return put;
  }

  /** Sends a DELETE request. */
  public deleteRequest<T>(url: string, params?: HttpParams): Observable<T> {
    const apiUrl = `${environment.stewardApiUrl}/api/${url}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const del = this.http
      .delete<T>(apiUrl, {
        headers,
        params,
      })
      .pipe(
        catchError((error, caught) => {
          if (error.status === 401) {
            this.logger.warn([LogTopic.Auth], 'Received 401; attempting silent reauth and retry');
            return this.store.dispatch(new RecheckAuth()).pipe(switchMap(() => caught));
          }

          return caught;
        }),
      );

    return del;
  }
}
