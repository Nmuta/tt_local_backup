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
  private static readonly ZAF_SCRIPT_LOCATION =
    'https://static.zdassets.com/zendesk_app_framework_sdk/2.0/zaf_sdk.min.js';
  private static readonly ZAF_SESSION_KEY = 'zafClientLoc';

  public client: ZafClient = undefined;

  private readonly clientInternal$ = new ReplaySubject<ZafClient>(1);
  private get clientSessionKey(): string {
    // gets /ticket-app/ from /ticket-app/title/sunrise
    const appLevelRoute = window.location.pathname.match(/\/.*?\//);
    return `${ZafClientService.ZAF_SESSION_KEY}${appLevelRoute}`;
  }

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
      const zafText = await this.http
        .get(ZafClientService.ZAF_SCRIPT_LOCATION, { responseType: 'text' })
        .toPromise();
      const zafObject = evaluateAndExport<ExportedZafClient>(zafText, 'ZAFClient');
      const maybeClient = zafObject.init();

      if (maybeClient) {
        return this.initFoundClient(maybeClient);
      }

      this.logger.warn(
        [LogTopic.Auth],
        'ZAFClient.init() failed, so attempting to restore from session storage =',
        this.clientSessionKey,
      );

      const priorZafLocRaw: string | null = sessionStorage.getItem(this.clientSessionKey);
      if (!priorZafLocRaw) {
        throw new Error(
          `ZAFClient.init() returned ${maybeClient}, and there was no prior session to restore.`,
        );
      }

      const priorZafLoc: ZafLoc | null = JSON.parse(priorZafLocRaw);
      if (!priorZafLoc) {
        throw new Error(
          `ZAFClient.init() returned ${maybeClient}, and reconstitution of the prior session failed with '${priorZafLocRaw}'.`,
        );
      }

      const maybeReconstitutedClient = zafObject.init(null, priorZafLoc);
      if (maybeReconstitutedClient) {
        return this.initReconstitutedClient(maybeReconstitutedClient, priorZafLoc);
      }

      throw new Error(
        `ZAFClient.init() returned ${maybeClient}, and the reconstituted ZAFClient.init() returned ${maybeReconstitutedClient}, when restored with ${priorZafLocRaw}.`,
      );
    } catch (e) {
      this.logger.error([LogTopic.ZAF], e);
      this.clientInternal$.error(e);
    }
  }

  private initFoundClient(zafClient: ZafClient): void {
    const zafLoc = pick(window.location, 'hash', 'search');
    const zafLocSerialized = JSON.stringify(zafLoc);
    sessionStorage.setItem(this.clientSessionKey, zafLocSerialized);
    this.logger.debug(
      [LogTopic.ZAF],
      'ZAFClient.init() succeeded with key =',
      this.clientSessionKey,
      zafLoc,
    );

    this.setClient(zafClient);
  }

  private initReconstitutedClient(zafClient: ZafClient, zafLoc: ZafLoc): void {
    this.logger.warn(
      [LogTopic.ZAF],
      'ZAFClient.init() reconstituted with with key =',
      this.clientSessionKey,
      zafLoc,
    );

    this.setClient(zafClient);
  }

  private setClient(zafClient: ZafClient): void {
    this.client = zafClient;
    this.clientInternal$.next(this.client);
  }
}
