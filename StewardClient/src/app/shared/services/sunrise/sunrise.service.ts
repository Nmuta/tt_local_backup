import { Injectable } from '@angular/core';
import {
  IdentityQueryAlphaBatch,
  IdentityResultAlphaBatch,
  IdentityQueryAlpha,
  IdentityResultAlpha,
} from '@models/identity-query.model';
import { LspGroups } from '@models/lsp-group';
import {
  SunriseBanRequest,
  SunriseBanResult,
  SunriseBanSummary,
  SunrisePlayerDetails,
  SunrisePlayerInventory,
  SunrisePlayerNotifications,
  SunriseUserFlags,
} from '@models/sunrise';
import { LiveOpsBanDescriptions } from '@models/sunrise/sunrise-ban-history.model';
import { SunriseConsoleDetails } from '@models/sunrise/sunrise-console-details.model';
import { SunriseCreditHistory } from '@models/sunrise/sunrise-credit-history.model';
import { SunriseMasterInventory } from '@models/sunrise/sunrise-master-inventory.model';
import { SunriseProfileSummary } from '@models/sunrise/sunrise-profile-summary.model';
import { SunriseSharedConsoleUsers } from '@models/sunrise/sunrise-shared-console-users.model';
import { ApiService } from '@services/api';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
    return this.apiService.postRequest<IdentityResultAlphaBatch>(
      `${this.basePath}/players/identities`,
      identityQueries,
    );
  }

  /** Gets the sunrise lsp groups. */
  public getLspGroups(): Observable<LspGroups> {
    return this.apiService.getRequest<LspGroups>(`${this.basePath}/groups`);
  }

  /** Gets the sunrise master inventory. */
  public getMasterInventory(): Observable<SunriseMasterInventory> {
    return this.apiService.getRequest<SunriseMasterInventory>(`${this.basePath}/masterInventory`);
  }

  /** Gets sunrise player details with a gamertag. This can be used to retrieve a XUID. */
  public getPlayerDetailsByGamertag(gamertag: string): Observable<SunrisePlayerDetails> {
    return this.apiService.getRequest<SunrisePlayerDetails>(
      `${this.basePath}/player/gamertag(${gamertag})/details`,
    );
  }

  /** Gets user flags by a XUID. */
  public getFlagsByXuid(xuid: BigInt): Observable<SunriseUserFlags> {
    return this.apiService.getRequest<SunriseUserFlags>(
      `${this.basePath}/player/xuid(${xuid})/userFlags`,
    );
  }

  /** Gets user flags by a XUID. */
  public putFlagsByXuid(xuid: BigInt, flags: SunriseUserFlags): Observable<SunriseUserFlags> {
    return this.apiService.putRequest<SunriseUserFlags>(
      `${this.basePath}/player/xuid(${xuid})/userFlags`,
      flags,
    );
  }

  /** Gets user flags by a XUID. */
  public getBanHistoryByXuid(xuid: BigInt): Observable<LiveOpsBanDescriptions> {
    return this.apiService.getRequest<LiveOpsBanDescriptions>(
      `${this.basePath}/player/xuid(${xuid})/banHistory`,
    );
  }

  /** Gets ban summaries by a list of XUIDs. */
  public getBanSummariesByXuids(xuids: BigInt[]): Observable<SunriseBanSummary[]> {
    return this.apiService.postRequest<SunriseBanSummary[]>(
      `${this.basePath}/players/banSummaries`,
      xuids,
    );
  }

  /** Bans players by a list of XUIDs. */
  public postBanPlayers(bans: SunriseBanRequest[]): Observable<SunriseBanResult[]> {
    return this.apiService.postRequest<SunriseBanResult[]>(`${this.basePath}/players/ban`, bans);
  }

  /** Gets shared console users by XUID. */
  public getSharedConsoleUsersByXuid(xuid: BigInt): Observable<SunriseSharedConsoleUsers> {
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
  public getProfileSummaryByXuid(xuid: BigInt): Observable<SunriseProfileSummary> {
    return this.apiService.getRequest<SunriseProfileSummary>(
      `${this.basePath}/player/xuid(${xuid})/profileSummary`,
    );
  }

  /** Gets a player's Profile Summary by XUID. */
  public getCreditHistoryByXuid(xuid: BigInt): Observable<SunriseCreditHistory> {
    return this.apiService.getRequest<SunriseCreditHistory>(
      `${this.basePath}/player/xuid(${xuid})/creditUpdates`,
    );
  }

  /** Gets the player's inventory */
  public getPlayerInventoryByXuid(xuid: BigInt): Observable<SunrisePlayerInventory> {
    return this.apiService.getRequest<SunrisePlayerInventory>(`${this.basePath}/player/xuid(${xuid})/inventory`);
  }
}
