import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

type SwitchMapperImmediate<T> = (client: ZAFClient.ZafClientActual) => T;
type SwitchMapperObervable<T> = (client: ZAFClient.ZafClientActual) => Observable<T>;
type SwitchMapperPromise<T> = (client: ZAFClient.ZafClientActual) => Promise<T>;
export type SwitchMapper<T> = SwitchMapperObervable<T> | SwitchMapperPromise<T> | SwitchMapperImmediate<T>;

function evaluateAndExport<T>(code: string, exportedValue: string): T {
  return Function(`${code};\n\n;return ${exportedValue};`)();
}

/** Acquires a ZAF Client using dependency injection rather than ambient globals. */
@Injectable({providedIn: 'root'})
export class ZafClientService {
  public client: ZAFClient.ZafClientActual = undefined;

  private readonly clientInternal$ = new Subject<ZAFClient.ZafClientActual>();

  /** The latest client, as an observable. */
  public get client$(): Observable<ZAFClient.ZafClientActual> { return this.clientInternal$; };

  constructor(private readonly http: HttpClient) {
    this.init()
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

  /** Initializes the object. */
  protected async init(): Promise<void> {
    const zafUrl = 'https://static.zdassets.com/zendesk_app_framework_sdk/2.0/zaf_sdk.js'
    const zafText = await this.http.get(zafUrl, { responseType: 'text' }).toPromise();
    const zafObject = evaluateAndExport<ZAFClient.ZAFClient>(zafText, 'ZAFClient');
    window.ZAFClient = zafObject;
    const maybeClient = zafObject.init();
    if (!maybeClient) {
      this.clientInternal$.error(new Error(`ZAFClient.init() returned ${maybeClient}`));
      return;
    }

    this.client = maybeClient;
    this.clientInternal$.next(this.client);
  }
}
