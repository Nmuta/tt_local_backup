import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService, LogTopic } from '@services/logger';
import { ExportedZafClient, ZafClient, ZafLoc } from '@shared/definitions/zaf-client';
import { pick } from 'lodash';
import { from, Observable, of, ReplaySubject } from 'rxjs';
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
  private static readonly ZAF_SCRIPT_LOCATION = 'https://static.zdassets.com/zendesk_app_framework_sdk/2.0/zaf_sdk.min.js';
  private static readonly ZAF_SESSION_KEY = 'zafClientLoc';

  public client: ZafClient = undefined;

  private readonly clientInternal$ = new ReplaySubject<ZafClient>(1);

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
      const zafText = await this.http.get(ZafClientService.ZAF_SCRIPT_LOCATION, { responseType: 'text' }).toPromise();
      const zafObject = evaluateAndExport<ExportedZafClient>(zafText, 'ZAFClient');
      const maybeClient = zafObject.init();

      if (maybeClient) {
        return this.initFoundClient(maybeClient);
      }

      this.logger.warn([LogTopic.Auth], 'ZAFClient.init() failed, so attempting to restore from session storage.');

      const maybePriorZafLocRaw = sessionStorage.getItem(ZafClientService.ZAF_SESSION_KEY);
      this.logger.debug([LogTopic.ZAF], 'Prior ZAF Loc', maybePriorZafLocRaw);
      if (!maybePriorZafLocRaw) {
        throw new Error(`ZAFClient.init() returned ${maybeClient}, and there was no prior session to restore.`)
      }

      const priorZafLoc: ZafLoc =  JSON.parse(maybePriorZafLocRaw);
      this.logger.debug([LogTopic.ZAF], 'Prior ZAF Loc, parsed', priorZafLoc);
      if (!priorZafLoc) {
        throw new Error(`ZAFClient.init() returned ${maybeClient}, and reconstitution of the prior session failed with '${maybePriorZafLocRaw}'.`);
      }
  
      const maybeReconstitutedClient = zafObject.init(null, priorZafLoc);
      if (maybeReconstitutedClient) {
        this.logger.debug([LogTopic.ZAF], 'ZAFClient.init() succeeded with reconstituted values');
        return this.initFoundClient(maybeReconstitutedClient);
      }

      throw new Error(`ZAFClient.init() returned ${maybeClient}, and the reconstituted ZAFClient.init() returned ${maybeReconstitutedClient}, when restored with ${maybePriorZafLocRaw}.`);
    } catch (e) {
      this.logger.error([LogTopic.ZAF], e);
      this.clientInternal$.error(e);
    }
  }

  private initFoundClient(zafClient: ZafClient): void {
    const zafLoc = pick(window.location, 'hash', 'search');
    const zafLocSerialized = JSON.stringify(zafLoc);
    sessionStorage.setItem(ZafClientService.ZAF_SESSION_KEY, zafLocSerialized);
    this.logger.debug([LogTopic.ZAF], 'ZAFClient.init() succeeded with location', zafLoc);

    this.client = zafClient;
    this.clientInternal$.next(this.client);
  }
}
