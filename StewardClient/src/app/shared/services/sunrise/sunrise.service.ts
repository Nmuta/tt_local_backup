import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IdentityQueryAlphaBatch,
  IdentityResultAlphaBatch,
  IdentityQueryAlpha,
  IdentityResultAlpha,
} from '@models/identity-query.model';
import { LspGroups } from '@models/lsp-group';
import {
  SunrisePlayerDetails,
  SunrisePlayerNotifications,
  SunriseUserFlags,
} from '@models/sunrise';
import { LiveOpsBanDescriptions } from '@models/sunrise/sunrise-ban-history.model';
import { SunriseConsoleDetails } from '@models/sunrise/sunrise-console-details.model';
import { SunriseCreditHistory } from '@models/sunrise/sunrise-credit-history.model';
import { SunriseProfileSummary } from '@models/sunrise/sunrise-profile-summary.model';
import { SunriseSharedConsoleUsers } from '@models/sunrise/sunrise-shared-console-users.model';
import { ApiService } from '@services/api';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

/** Handles calls to Sunrise API routes. */
@Injectable({
  providedIn: 'root',
})
export class SunriseService {
  public basePath: string = 'v1/title/sunrise';

  constructor(private readonly apiService: ApiService) {}

  /** Gets the status of a player's notifications. */
  public getPlayerNotificationsByXuid(xuid: BigInt): Observable<SunrisePlayerNotifications> {
    return this.apiService.getRequest(`${this.basePath}/player/xuid(${xuid})/notifications`);
  }

  /** Gets a single identity within this service. */
  public getPlayerIdentity(identityQuery: IdentityQueryAlpha): Observable<IdentityResultAlpha> {
    const queryBatch: IdentityQueryAlphaBatch = [identityQuery];
    return this.getPlayerIdentities(queryBatch).pipe(
      switchMap((data: IdentityResultAlphaBatch) => {
        const result = data[0];
        return of(result);
      }),
    );
  }

  /** Gets identities within this service. */
  public getPlayerIdentities(
    identityQueries: IdentityQueryAlphaBatch,
  ): Observable<IdentityResultAlphaBatch> {
    return this.apiService
      .postRequest<IdentityResultAlphaBatch>(`${this.basePath}/players/identities`, identityQueries)
      .pipe(
        tap(_v => {
          debugger;
        }),
      );
  }

  /** Gets the sunrise lsp groups. */
  public getLspGroups(): Observable<LspGroups> {
    return this.apiService.getRequest<LspGroups>(`${this.basePath}/groups`);
  }

  /** Gets sunrise player details with a gamertag. This can be used to retrieve a XUID. */
  public getPlayerDetailsByGamertag(gamertag: string): Observable<SunrisePlayerDetails> {
    return this.apiService.getRequest<SunrisePlayerDetails>(
      `${this.basePath}/player/gamertag(${gamertag})/details`,
    );
  }

  /** Gets user flags by a XUID. */
  public getFlagsByXuid(xuid: number): Observable<SunriseUserFlags> {
    return this.apiService.getRequest<SunriseUserFlags>(
      `${this.basePath}/player/xuid(${xuid})/userFlags`,
    );
  }

  /** Gets user flags by a XUID. */
  public putFlagsByXuid(xuid: number, flags: SunriseUserFlags): Observable<SunriseUserFlags> {
    return this.apiService.putRequest<SunriseUserFlags>(
      `${this.basePath}/player/xuid(${xuid})/userFlags`,
      flags,
    );
  }

  /** Gets user flags by a XUID. */
  public getBanHistoryByXuid(xuid: number): Observable<LiveOpsBanDescriptions> {
    return this.apiService
      .getRequest<LiveOpsBanDescriptions>(`${this.basePath}/player/xuid(${xuid})/banHistory`)
      .pipe(
        map(banHistory => {
          // these come in stringly-typed and must be converted
          for (const ban of banHistory) {
            ban.startTimeUtc = new Date(ban.startTimeUtc);
            ban.expireTimeUtc = new Date(ban.expireTimeUtc);
          }

          return banHistory;
        }),
      );
  }

  /** Gets shared console users by XUID. */
  public getSharedConsoleUsersByXuid(xuid: number): Observable<SunriseSharedConsoleUsers> {
    return this.apiService.getRequest<SunriseSharedConsoleUsers>(
      `${this.basePath}/player/xuid(${xuid})/sharedConsoleUsers`,
    );
  }
  /** Gets console details by XUID. */
  public getConsoleDetailsByXuid(xuid: BigInt): Observable<SunriseConsoleDetails> {
    return this.apiService.getRequest<SunriseConsoleDetails>(
      `${this.basePath}/player/xuid(${xuid})/consoleDetails`,
    );
  }

  /** Updates a console's ban status by the Console's ID. */
  public putBanStatusByConsoleId(consoleId: string, isBanned: boolean): Observable<void> {
    return this.apiService.putRequest<void>(
      `${this.basePath}/console/consoleId(${consoleId})/isBanned(${isBanned})`,
      null,
    );
  }

  /** Gets a player's Profile Summary by XUID. */
  public getProfileSummaryByXuid(xuid: number): Observable<SunriseProfileSummary> {
    return this.apiService.getRequest<SunriseProfileSummary>(
      `${this.basePath}/player/xuid(${xuid})/profileSummary`,
    );
  }

  /** Gets a player's Profile Summary by XUID. */
  public getCreditHistoryByXuid(xuid: number): Observable<SunriseCreditHistory> {
    return this.apiService.getRequest<SunriseCreditHistory>(
      `${this.basePath}/player/xuid(${xuid})/creditUpdates`,
    );
  }
}
