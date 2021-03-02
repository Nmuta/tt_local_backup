import { Injectable } from '@angular/core';
import {
  IdentityQueryAlphaBatch,
  IdentityResultAlphaBatch,
  IdentityQueryAlpha,
  IdentityResultAlpha,
} from '@models/identity-query.model';
import { LspGroup, LspGroups } from '@models/lsp-group';
import {
  LiveOpsBanDescriptions,
  SunriseBanRequest,
  SunriseBanResult,
  SunriseBanSummary,
  SunriseConsoleDetails,
  SunriseCreditHistory,
  SunriseGift,
  SunriseGiftHistory,
  SunriseGroupGift,
  SunriseMasterInventory,
  SunrisePlayerDetails,
  SunrisePlayerInventoryProfile,
  SunrisePlayerNotifications,
  SunriseProfileSummary,
  SunriseSharedConsoleUsers,
  SunriseUserFlags,
} from '@models/sunrise';
import { ApiService } from '@services/api';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { chain } from 'lodash';
import { GiftResponse } from '@models/gift-response';
import { BackgroundJob } from '@models/background-job';
import { HttpParams } from '@angular/common/http';

/** Handles calls to Sunrise API routes. */
@Injectable({
  providedIn: 'root',
})
export class SunriseService {
  public basePath: string = 'v1/title/sunrise';

  constructor(private readonly apiService: ApiService) {}

  /** Gets the status of a player's notifications. */
  public getPlayerNotificationsByXuid(xuid: bigint): Observable<SunrisePlayerNotifications> {
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

  /** Gets sunrise player details with a XUID. */
  public getPlayerDetailsByXuid(xuid: BigInt): Observable<SunrisePlayerDetails> {
    return this.apiService.getRequest<SunrisePlayerDetails>(
      `${this.basePath}/player/xuid(${xuid})/details`,
    );
  }

  /** Gets user flags by a XUID. */
  public getFlagsByXuid(xuid: bigint): Observable<SunriseUserFlags> {
    return this.apiService.getRequest<SunriseUserFlags>(
      `${this.basePath}/player/xuid(${xuid})/userFlags`,
    );
  }

  /** Gets user flags by a XUID. */
  public putFlagsByXuid(xuid: bigint, flags: SunriseUserFlags): Observable<SunriseUserFlags> {
    return this.apiService.putRequest<SunriseUserFlags>(
      `${this.basePath}/player/xuid(${xuid})/userFlags`,
      flags,
    );
  }

  /** Gets user flags by a XUID. */
  public getBanHistoryByXuid(xuid: bigint): Observable<LiveOpsBanDescriptions> {
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

  /** Bans players by a list of XUIDs using background processing. */
  public postBanPlayersWithBackgroundProcessing(
    bans: SunriseBanRequest[],
  ): Observable<BackgroundJob<void>> {
    return this.apiService.postRequest<BackgroundJob<void>>(
      `${this.basePath}/players/ban/useBackgroundProcessing`,
      bans,
    );
  }

  /** Gets Gift history by a XUID. */
  public getGiftHistoryByXuid(xuid: BigInt): Observable<SunriseGiftHistory[]> {
    return this.apiService.getRequest<SunriseGiftHistory[]>(
      `${this.basePath}/player/xuid(${xuid})/giftHistory`,
    );
  }

  /** Gets Gift history by a LSP group ID. */
  public getGiftHistoryByLspGroup(lspGroupId: BigInt): Observable<SunriseGiftHistory[]> {
    return this.apiService.getRequest<SunriseGiftHistory[]>(
      `${this.basePath}/group/groupId(${lspGroupId})/giftHistory`,
    );
  }

  /** Gets shared console users by XUID. */
  public getSharedConsoleUsersByXuid(xuid: bigint): Observable<SunriseSharedConsoleUsers> {
    return this.apiService.getRequest<SunriseSharedConsoleUsers>(
      `${this.basePath}/player/xuid(${xuid})/sharedConsoleUsers`,
    );
  }
  /** Gets console details by XUID. */
  public getConsoleDetailsByXuid(xuid: bigint): Observable<SunriseConsoleDetails> {
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
  public getProfileSummaryByXuid(xuid: bigint): Observable<SunriseProfileSummary> {
    return this.apiService.getRequest<SunriseProfileSummary>(
      `${this.basePath}/player/xuid(${xuid})/profileSummary`,
    );
  }

  /** Gets a player's Profile Summary by XUID. */
  public getCreditHistoryByXuid(
    xuid: bigint,
    startIndex: number = 0,
    maxResults: number = 100,
  ): Observable<SunriseCreditHistory> {
    const httpParams = new HttpParams()
      .set('startIndex', startIndex.toString())
      .set('maxResults', maxResults.toString());
    return this.apiService.getRequest<SunriseCreditHistory>(
      `${this.basePath}/player/xuid(${xuid})/creditUpdates`,
      httpParams,
    );
  }

  /** Gets a player's profile list  by XUID. */
  public getPlayerInventoryProfilesByXuid(
    xuid: bigint,
  ): Observable<SunrisePlayerInventoryProfile[]> {
    return this.apiService
      .getRequest<SunrisePlayerInventoryProfile[]>(
        `${this.basePath}/player/xuid(${xuid})/inventoryProfiles`,
      )
      .pipe(
        map(v =>
          chain(v)
            .sortBy(v => v.profileId)
            .reverse()
            .value(),
        ),
      );
  }

  /** Gets the latest version of a player's inventory */
  public getPlayerInventoryByXuid(xuid: bigint): Observable<SunriseMasterInventory> {
    return this.apiService.getRequest<SunriseMasterInventory>(
      `${this.basePath}/player/xuid(${xuid})/inventory`,
    );
  }

  /** Gets a specific version of a player's inventory */
  public getPlayerInventoryByProfileId(profileId: bigint): Observable<SunriseMasterInventory> {
    return this.apiService.getRequest<SunriseMasterInventory>(
      `${this.basePath}/player/profileId(${profileId})/inventory`,
    );
  }

  /** Gift players inventory items. */
  public postGiftPlayers(gift: SunriseGroupGift): Observable<GiftResponse<bigint>[]> {
    return this.apiService.postRequest<GiftResponse<bigint>[]>(
      `${this.basePath}/gifting/players`,
      gift,
    );
  }

  /** Gift players inventory items using a background task. */
  public postGiftPlayersUsingBackgroundTask(
    gift: SunriseGroupGift,
  ): Observable<BackgroundJob<void>> {
    return this.apiService.postRequest<BackgroundJob<void>>(
      `${this.basePath}/gifting/players/useBackgroundProcessing`,
      gift,
    );
  }

  /** Gift lsp group inventory items. */
  public postGiftLspGroup(lspGroup: LspGroup, gift: SunriseGift): Observable<GiftResponse<bigint>> {
    return this.apiService.postRequest<GiftResponse<bigint>>(
      `${this.basePath}/gifting/groupId(${lspGroup.id})`,
      gift,
    );
  }
}
