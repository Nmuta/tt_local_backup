import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

type SwitchMapperImmediate<T> = (client: ZAFClient.ZafClientActual) => T;
type SwitchMapperObervable<T> = (client: ZAFClient.ZafClientActual) => Observable<T>;
type SwitchMapperPromise<T> = (client: ZAFClient.ZafClientActual) => Promise<T>;
export type SwitchMapper<T> = SwitchMapperObervable<T> | SwitchMapperPromise<T> | SwitchMapperImmediate<T>;

/** Acquires a ZAF Client. */
@Injectable({providedIn: 'root'})
export class ZafClientService {
  public readonly client$ = new Subject<ZAFClient.ZafClientActual>();
  public client: ZAFClient.ZafClientActual = undefined;

  /** True when we have acquired a client. */
  public get hasClient(): boolean { return !!this.client; }

  constructor(private readonly http: HttpClient) {
    this.init()
  }

  /** Initializes the object. */
  public async init(): Promise<void> {
    const zafUrl = 'https://static.zdassets.com/zendesk_app_framework_sdk/2.0/zaf_sdk.js'
    debugger;
    try {
      const zafText = await this.http.get<string>(zafUrl).toPromise();
      const result = eval(zafText);
      debugger;
      const maybeClient = ZAFClient.init();
      if (!maybeClient) {
        this.client$.error(new Error(`ZAFClient.init() returned ${maybeClient}`));
        return;
      }

      this.client = maybeClient;
      this.client$.next(this.client);
    } catch (e) {
      debugger;
    }
  }

  /** Runs a given command with the client, when it shows up. */
  public runWithClient<T>(switchMapper: SwitchMapper<T>): Observable<T> {
    return this.client$.pipe(switchMap(client => {
      const result = switchMapper(client);
      if (result instanceof Promise) {
        return from(result);
      } else if (result instanceof Observable) {
        return result;
      } else {
        // non-observable, non-promise
        return of(result);
      }
    }));
  }
}
