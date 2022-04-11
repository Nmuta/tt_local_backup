// TODO: disabling these since it's a passthru to API Service but I think there's a test harness for HTTP requests in general?
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

// TODO: Feels like we probably don't need this service.
//
// It is not really doing anything except
// - Setting content type on a couple request formats, which we can do in interceptors
// - Currying in a custom URL base (which we can do with a function like toSteward(path) that uses environment settings)
// - proxying the API in a marginally different way
//
// WRT to the proxying the API,
// - doesn't seem to save much (if anything?) in the common scenarios
// - in uncommon scenarios, causes you to have to choose between
//   - modify the ApiService to support the new scenario; which requires design work and I think breaks an OOP principal?
//   - use HttpClient directly, which means there are now 2+ ways in which we might make a request
// - I think most features you could implement this way would probably be nicer as interceptors?
//
// Perhaps it has some utility for test hooks?
// Though I believe Angular has an entire suite of tools specifically around that
// (not that I've usually bothered to test such things, they seem like generally "last pass" sort of tests. Useful, but not as useful as other things).
// If we do keep it for that reason, it should probably be made to more directly resemble the upstream APIs and just modify the passed thru values a bit.

/** Defines the api service. */
@Injectable({
  providedIn: 'root',
})
export class ApiV2Service {
  private readonly baseUrl = `${environment.stewardApiUrl}/api/v2`;
  constructor(private readonly http: HttpClient) {}

  /** Sends a GET request. */
  public getRequest$<T>(url: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    const apiUrl = `${this.baseUrl}/${url}`;
    const get = this.http.get<T>(apiUrl, {
      params,
      headers,
    });

    return get;
  }

  /** Sends a GET request. More directly mirrors upstream API. */
  public getRequest2$<T>(
    url: string,
    options?: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      context?: HttpContext;
      observe?: 'body';
      params?:
        | HttpParams
        | {
            [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
          };
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<T> {
    const apiUrl = `${this.baseUrl}/${url}`;
    const get$ = this.http.get<T>(apiUrl, options);

    return get$;
  }

  /** Sends a POST request. */
  public postRequest$<T>(
    url: string,
    object: any,
    params?: HttpParams,
    headers?: HttpHeaders,
  ): Observable<T> {
    const apiUrl = `${this.baseUrl}/${url}`;
    headers = headers || new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');

    const post = this.http.post<T>(apiUrl, object, {
      headers,
      params,
    });

    return post;
  }

  /** Sends a PUT request. */
  public putRequest$<T>(url: string, object: any, params?: HttpParams): Observable<T> {
    const apiUrl = `${this.baseUrl}/${url}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const put = this.http.put<T>(apiUrl, object, {
      headers,
      params,
    });

    return put;
  }

  /** Sends a DELETE request. */
  public deleteRequest$<T>(url: string, params?: HttpParams): Observable<T> {
    const apiUrl = `${this.baseUrl}/${url}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const del = this.http.delete<T>(apiUrl, {
      headers,
      params,
    });

    return del;
  }
}
