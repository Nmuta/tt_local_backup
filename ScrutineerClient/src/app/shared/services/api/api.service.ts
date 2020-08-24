import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { retryWhen, share } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private http: HttpClient) {}

    public getRequest<T>(
        url: string,
        params?: HttpParams,
        headers?: HttpHeaders
    ): Observable<T> {
        const apiUrl = `${environment.scrutineerApiUrl}/api/${url}`;
        const get = this.http
            .get<T>(apiUrl, {
                params,
                headers
            });

        return get;
    }

    public postRequest<T>(
        url: string,
        object: any,
        params?: HttpParams,
        headers?: HttpHeaders,
        host?: string
    ): Observable<T> {
        const apiUrl = `${environment.scrutineerApiUrl}/api/${url}`;
        const post = this.http
            .post<T>(apiUrl, object, {
                headers,
                params
            });

        return post;
    }

    public putRequest<T>(
        url: string,
        object: any,
        params?: HttpParams
    ): Observable<T> {
        const apiUrl = `${environment.scrutineerApiUrl}/api/${url}`;
        const headers = new HttpHeaders().set('Content-Type', 'application/json');

        const put = this.http
            .put<T>(apiUrl, object, {
                headers,
                params
            });

        return put;
    }

    public deleteRequest<T>(
        url: string,
        params?: HttpParams
    ): Observable<T> {
        const apiUrl = `${environment.scrutineerApiUrl}/api/${url}`;
        const headers = new HttpHeaders().set('Content-Type', 'application/json');

        const del = this.http
            .delete<T>(apiUrl, {
                headers,
                params
            });

        return del;
    }
}
