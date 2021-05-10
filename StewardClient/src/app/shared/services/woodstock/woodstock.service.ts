import BigNumber from 'bignumber.js';
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
  WoodstockBanRequest,
  WoodstockBanResult,
  WoodstockBanSummary,
  WoodstockConsoleDetailsEntry,
  WoodstockCreditDetailsEntry,
  WoodstockGift,
  WoodstockGiftHistory,
  WoodstockGroupGift,
  WoodstockMasterInventory,
  WoodstockPlayerDetails,
  WoodstockPlayerInventoryProfile,
  WoodstockPlayerNotifications,
  WoodstockProfileRollback,
  WoodstockProfileSummary,
  WoodstockSharedConsoleUser,
  WoodstockUserFlags,
} from '@models/woodstock';
import { ApiService } from '@services/api';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { chain } from 'lodash';
import { GiftResponse } from '@models/gift-response';
import { BackgroundJob } from '@models/background-job';
import { HttpParams } from '@angular/common/http';
import {
  BulkCommunityMessage,
  CommunityMessage,
  CommunityMessageResult,
} from '@models/community-message';

/** Handles calls to Woodstock API routes. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockService {
  public basePath: string = 'v1/title/woodstock';

  constructor(private readonly apiService: ApiService) {}

  /** Gets the status of a player's notifications. */
  public getPlayerNotificationsByXuid(xuid: BigNumber): Observable<WoodstockPlayerNotifications> {
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

  /** Gets the woodstock lsp groups. */
  public getLspGroups(): Observable<LspGroups> {
    return this.apiService.getRequest<LspGroups>(`${this.basePath}/groups`);
  }

  /** Gets the woodstock master inventory. */
  public getMasterInventory(): Observable<WoodstockMasterInventory> {
    return this.apiService.getRequest<WoodstockMasterInventory>(`${this.basePath}/masterInventory`);
  }

  /** Gets woodstock player details with a gamertag. This can be used to retrieve a XUID. */
  public getPlayerDetailsByGamertag(gamertag: string): Observable<WoodstockPlayerDetails> {
    return this.apiService.getRequest<WoodstockPlayerDetails>(
      `${this.basePath}/player/gamertag(${gamertag})/details`,
    );
  }

  /** Gets woodstock player details with a XUID. */
  public getPlayerDetailsByXuid(xuid: BigNumber): Observable<WoodstockPlayerDetails> {
    return this.apiService.getRequest<WoodstockPlayerDetails>(
      `${this.basePath}/player/xuid(${xuid})/details`,
    );
  }

  /** Gets user flags by a XUID. */
  public getFlagsByXuid(xuid: BigNumber): Observable<WoodstockUserFlags> {
    return this.apiService.getRequest<WoodstockUserFlags>(
      `${this.basePath}/player/xuid(${xuid})/userFlags`,
    );
  }

  /** Gets user flags by a XUID. */
  public getProfileRollbacksXuid(xuid: BigNumber): Observable<WoodstockProfileRollback[]> {
    return this.apiService.getRequest<WoodstockProfileRollback[]>(
      `${this.basePath}/player/xuid(${xuid})/profileRollbacks`,
    );
  }

  /** Sets user flags by a XUID. */
  public putFlagsByXuid(
    xuid: BigNumber,
    flags: WoodstockUserFlags,
  ): Observable<WoodstockUserFlags> {
    return this.apiService.putRequest<WoodstockUserFlags>(
      `${this.basePath}/player/xuid(${xuid})/userFlags`,
      flags,
    );
  }

  /** Gets user flags by a XUID. */
  public getBanHistoryByXuid(xuid: BigNumber): Observable<LiveOpsBanDescriptions> {
    return this.apiService.getRequest<LiveOpsBanDescriptions>(
      `${this.basePath}/player/xuid(${xuid})/banHistory`,
    );
  }

  /** Gets ban summaries by a list of XUIDs. */
  public getBanSummariesByXuids(xuids: BigNumber[]): Observable<WoodstockBanSummary[]> {
    return this.apiService.postRequest<WoodstockBanSummary[]>(
      `${this.basePath}/players/banSummaries`,
      xuids,
    );
  }

  /** Bans players by a list of XUIDs. */
  public postBanPlayers(bans: WoodstockBanRequest[]): Observable<WoodstockBanResult[]> {
    return this.apiService.postRequest<WoodstockBanResult[]>(`${this.basePath}/players/ban`, bans);
  }

  /** Bans players by a list of XUIDs using background processing. */
  public postBanPlayersWithBackgroundProcessing(
    bans: WoodstockBanRequest[],
  ): Observable<BackgroundJob<void>> {
    return this.apiService.postRequest<BackgroundJob<void>>(
      `${this.basePath}/players/ban/useBackgroundProcessing`,
      bans,
    );
  }

  /** Gets Gift history by a XUID. */
  public getGiftHistoryByXuid(xuid: BigNumber): Observable<WoodstockGiftHistory[]> {
    return this.apiService.getRequest<WoodstockGiftHistory[]>(
      `${this.basePath}/player/xuid(${xuid})/giftHistory`,
    );
  }

  /** Gets Gift history by a LSP group ID. */
  public getGiftHistoryByLspGroup(lspGroupId: BigNumber): Observable<WoodstockGiftHistory[]> {
    return this.apiService.getRequest<WoodstockGiftHistory[]>(
      `${this.basePath}/group/groupId(${lspGroupId})/giftHistory`,
    );
  }

  /** Gets shared console users by XUID. */
  public getSharedConsoleUsersByXuid(xuid: BigNumber): Observable<WoodstockSharedConsoleUser[]> {
    return this.apiService.getRequest<WoodstockSharedConsoleUser[]>(
      `${this.basePath}/player/xuid(${xuid})/sharedConsoleUsers`,
    );
  }

  /** Gets console details by XUID. */
  public getConsoleDetailsByXuid(xuid: BigNumber): Observable<WoodstockConsoleDetailsEntry[]> {
    return this.apiService.getRequest<WoodstockConsoleDetailsEntry[]>(
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
  public getProfileSummaryByXuid(xuid: BigNumber): Observable<WoodstockProfileSummary> {
    return this.apiService.getRequest<WoodstockProfileSummary>(
      `${this.basePath}/player/xuid(${xuid})/profileSummary`,
    );
  }

  /** Sends a community message. */
  public postSendCommunityMessageToXuids(
    xuids: BigNumber[],
    communityMessage: CommunityMessage,
  ): Observable<CommunityMessageResult<BigNumber>[]> {
    const bulkMessage = communityMessage as BulkCommunityMessage;
    bulkMessage.xuids = xuids;

    return this.apiService.postRequest<CommunityMessageResult<BigNumber>[]>(
      `${this.basePath}/notifications/send`,
      bulkMessage,
    );
  }

  /** Sends a community message. */
  public postSendCommunityMessageToLspGroup(
    groupId: BigNumber,
    communityMessage: CommunityMessage,
  ): Observable<CommunityMessageResult<BigNumber>> {
    return this.apiService.postRequest<CommunityMessageResult<BigNumber>>(
      `${this.basePath}/notifications/send/groupId(${groupId})`,
      communityMessage,
    );
  }

  /** Gets a player's Profile Summary by XUID. */
  public getCreditHistoryByXuid(
    xuid: BigNumber,
    startIndex: number = 0,
    maxResults: number = 100,
  ): Observable<WoodstockCreditDetailsEntry[]> {
    const httpParams = new HttpParams()
      .set('startIndex', startIndex.toString())
      .set('maxResults', maxResults.toString());
    return this.apiService.getRequest<WoodstockCreditDetailsEntry[]>(
      `${this.basePath}/player/xuid(${xuid})/creditUpdates`,
      httpParams,
    );
  }

  /** Gets a player's profile list  by XUID. */
  public getPlayerInventoryProfilesByXuid(
    xuid: BigNumber,
  ): Observable<WoodstockPlayerInventoryProfile[]> {
    return this.apiService
      .getRequest<WoodstockPlayerInventoryProfile[]>(
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
  public getPlayerInventoryByXuid(xuid: BigNumber): Observable<WoodstockMasterInventory> {
    return this.apiService.getRequest<WoodstockMasterInventory>(
      `${this.basePath}/player/xuid(${xuid})/inventory`,
    );
  }

  /** Gets a specific version of a player's inventory */
  public getPlayerInventoryByProfileId(profileId: BigNumber): Observable<WoodstockMasterInventory> {
    return this.apiService.getRequest<WoodstockMasterInventory>(
      `${this.basePath}/player/profileId(${profileId})/inventory`,
    );
  }

  /** Gift players inventory items. */
  public postGiftPlayers(gift: WoodstockGroupGift): Observable<GiftResponse<BigNumber>[]> {
    return this.apiService.postRequest<GiftResponse<BigNumber>[]>(
      `${this.basePath}/gifting/players`,
      gift,
    );
  }

  /** Gift players inventory items using a background task. */
  public postGiftPlayersUsingBackgroundTask(
    gift: WoodstockGroupGift,
  ): Observable<BackgroundJob<void>> {
    return this.apiService.postRequest<BackgroundJob<void>>(
      `${this.basePath}/gifting/players/useBackgroundProcessing`,
      gift,
    );
  }

  /** Gift lsp group inventory items. */
  public postGiftLspGroup(
    lspGroup: LspGroup,
    gift: WoodstockGift,
  ): Observable<GiftResponse<BigNumber>> {
    return this.apiService.postRequest<GiftResponse<BigNumber>>(
      `${this.basePath}/gifting/groupId(${lspGroup.id})`,
      gift,
    );
  }
}
