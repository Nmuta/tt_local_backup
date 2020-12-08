import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService, LogTopic } from '@services/logger';
import { ExportedZafClient, ZafClient } from '@shared/definitions/zaf-client';
import { from, Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

type SwitchMapperImmediate<T> = (client: ZafClient) => T;
type SwitchMapperObervable<T> = (client: ZafClient) => Observable<T>;
type SwitchMapperPromise<T> = (client: ZafClient) => Promise<T>;
export type SwitchMapper<T> =
  | SwitchMapperObervable<T>
  | SwitchMapperPromise<T>
  | SwitchMapperImmediate<T>;

/** Evaluates the given code in a function context and returns the named variable as the result. */
function evaluateAndExport<T>(code: string, exportedValue: string): T {
  return Function(`${code};\n\n;return ${exportedValue};`)();
}

/** Acquires a ZAF Client using dependency injection rather than ambient globals. */
@Injectable({ providedIn: 'root' })
export class ZafClientService {
  public client: ZafClient = undefined;

  private readonly clientInternal$ = new Subject<ZafClient>();

  /** The latest client, as an observable. */
  public get client$(): Observable<ZafClient> {
    return this.clientInternal$;
  }

  constructor(private readonly http: HttpClient, private readonly logger: LoggerService) {
    this.init();
  }

  /** Runs a given command with the client, when it shows up. */
  public runWithClient$<T>(switchMapper: SwitchMapper<T>): Observable<T> {
    return this.client$.pipe(
      switchMap(client => {
        const result = switchMapper(client);
        if (result instanceof Promise) {
          return from(result);
        } else if (result instanceof Observable) {
          return result;
        } else {
          // non-observable, non-promise
          return of(result);
        }
      }),
    );
  }

  /** Initializes the object. */
  protected async init(): Promise<void> {
    try {
      const zafUrl = 'https://static.zdassets.com/zendesk_app_framework_sdk/2.0/zaf_sdk.js';
      const zafText = await this.http.get(zafUrl, { responseType: 'text' }).toPromise();
      const zafObject = evaluateAndExport<ExportedZafClient>(zafText, 'ZAFClient');
      const maybeClient = zafObject.init();
      if (!maybeClient) {
        throw new Error(`ZAFClient.init() returned ${maybeClient}`);
      }

      this.client = maybeClient;
      this.clientInternal$.next(this.client);
    } catch (e) {
      this.logger.error([LogTopic.ZAF], e);
      this.clientInternal$.error(e);
    }
  }
}
