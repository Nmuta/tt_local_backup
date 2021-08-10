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
  WoodstockPlayerAccountInventory,
  WoodstockPlayerDetails,
  WoodstockPlayerInventory,
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
import { AuctionFilters } from '@models/auction-filters';
import { PlayerAuction } from '@models/player-auction';
import { BackstagePassHistory } from '@models/backstage-pass-history';
import { PlayerUGCItem } from '@models/player-ugc-item';
import { UGCFilters, UGCType } from '@models/ugc-filters';
import { UGCFeaturedStatus } from '@models/ugc-featured-status';
import { KustoCar } from '@models/kusto-car';

/** Handles calls to Woodstock API routes. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockService {
  public basePath: string = 'v1/title/woodstock';

  constructor(private readonly apiService: ApiService) {}

  /** Gets the status of a player's notifications. */
  public getPlayerNotificationsByXuid$(xuid: BigNumber): Observable<WoodstockPlayerNotifications> {
    return this.apiService.getRequest$(`${this.basePath}/player/xuid(${xuid})/notifications`);
  }

  /** Gets a single identity within this service. */
  public getPlayerIdentity$(identityQuery: IdentityQueryAlpha): Observable<IdentityResultAlpha> {
    const queryBatch: IdentityQueryAlphaBatch = [identityQuery];
    return this.getPlayerIdentities$(queryBatch).pipe(
      switchMap((data: IdentityResultAlphaBatch) => {
        const result = data[0];
        return of(result);
      }),
    );
  }

  /** Gets identities within this service. */
  public getPlayerIdentities$(
    identityQueries: IdentityQueryAlphaBatch,
  ): Observable<IdentityResultAlphaBatch> {
    return this.apiService.postRequest$<IdentityResultAlphaBatch>(
      `${this.basePath}/players/identities`,
      identityQueries,
    );
  }

  /** Gets the woodstock lsp groups. */
  public getLspGroups$(): Observable<LspGroups> {
    return this.apiService.getRequest$<LspGroups>(`${this.basePath}/groups`);
  }

  /** Gets the woodstock master inventory. */
  public getMasterInventory$(): Observable<WoodstockMasterInventory> {
    return this.apiService.getRequest$<WoodstockMasterInventory>(
      `${this.basePath}/masterInventory`,
    );
  }

  /** Gets woodstock player details with a gamertag. This can be used to retrieve a XUID. */
  public getPlayerDetailsByGamertag$(gamertag: string): Observable<WoodstockPlayerDetails> {
    return this.apiService.getRequest$<WoodstockPlayerDetails>(
      `${this.basePath}/player/gamertag(${gamertag})/details`,
    );
  }

  /** Gets woodstock player details with a XUID. */
  public getPlayerDetailsByXuid$(xuid: BigNumber): Observable<WoodstockPlayerDetails> {
    return this.apiService.getRequest$<WoodstockPlayerDetails>(
      `${this.basePath}/player/xuid(${xuid})/details`,
    );
  }

  /** Gets user flags by a XUID. */
  public getFlagsByXuid$(xuid: BigNumber): Observable<WoodstockUserFlags> {
    return this.apiService.getRequest$<WoodstockUserFlags>(
      `${this.basePath}/player/xuid(${xuid})/userFlags`,
    );
  }

  /** Gets user flags by a XUID. */
  public getProfileRollbacksXuid$(xuid: BigNumber): Observable<WoodstockProfileRollback[]> {
    return this.apiService.getRequest$<WoodstockProfileRollback[]>(
      `${this.basePath}/player/xuid(${xuid})/profileRollbacks`,
    );
  }

  /** Sets user flags by a XUID. */
  public putFlagsByXuid$(
    xuid: BigNumber,
    flags: WoodstockUserFlags,
  ): Observable<WoodstockUserFlags> {
    return this.apiService.putRequest$<WoodstockUserFlags>(
      `${this.basePath}/player/xuid(${xuid})/userFlags`,
      flags,
    );
  }

  /** Gets user flags by a XUID. */
  public getBanHistoryByXuid$(xuid: BigNumber): Observable<LiveOpsBanDescriptions> {
    return this.apiService.getRequest$<LiveOpsBanDescriptions>(
      `${this.basePath}/player/xuid(${xuid})/banHistory`,
    );
  }

  /** Gets ban summaries by a list of XUIDs. */
  public getBanSummariesByXuids$(xuids: BigNumber[]): Observable<WoodstockBanSummary[]> {
    return this.apiService.postRequest$<WoodstockBanSummary[]>(
      `${this.basePath}/players/banSummaries`,
      xuids,
    );
  }

  /** Bans players by a list of XUIDs. */
  public postBanPlayers$(bans: WoodstockBanRequest[]): Observable<WoodstockBanResult[]> {
    return this.apiService.postRequest$<WoodstockBanResult[]>(`${this.basePath}/players/ban`, bans);
  }

  /** Bans players by a list of XUIDs using background processing. */
  public postBanPlayersWithBackgroundProcessing$(
    bans: WoodstockBanRequest[],
  ): Observable<BackgroundJob<void>> {
    return this.apiService.postRequest$<BackgroundJob<void>>(
      `${this.basePath}/players/ban/useBackgroundProcessing`,
      bans,
    );
  }

  /** Gets Gift history by a XUID. */
  public getGiftHistoryByXuid$(xuid: BigNumber): Observable<WoodstockGiftHistory[]> {
    return this.apiService.getRequest$<WoodstockGiftHistory[]>(
      `${this.basePath}/player/xuid(${xuid})/giftHistory`,
    );
  }

  /** Gets Gift history by a LSP group ID. */
  public getGiftHistoryByLspGroup$(lspGroupId: BigNumber): Observable<WoodstockGiftHistory[]> {
    return this.apiService.getRequest$<WoodstockGiftHistory[]>(
      `${this.basePath}/group/groupId(${lspGroupId})/giftHistory`,
    );
  }

  /** Gets shared console users by XUID. */
  public getSharedConsoleUsersByXuid$(xuid: BigNumber): Observable<WoodstockSharedConsoleUser[]> {
    return this.apiService.getRequest$<WoodstockSharedConsoleUser[]>(
      `${this.basePath}/player/xuid(${xuid})/sharedConsoleUsers`,
    );
  }

  /** Gets console details by XUID. */
  public getConsoleDetailsByXuid$(xuid: BigNumber): Observable<WoodstockConsoleDetailsEntry[]> {
    return this.apiService.getRequest$<WoodstockConsoleDetailsEntry[]>(
      `${this.basePath}/player/xuid(${xuid})/consoleDetails`,
    );
  }

  /** Updates a console's ban status by the Console's ID. */
  public putBanStatusByConsoleId$(consoleId: string, isBanned: boolean): Observable<void> {
    return this.apiService.putRequest$<void>(
      `${this.basePath}/console/consoleId(${consoleId})/isBanned(${isBanned})`,
      null,
    );
  }

  /** Gets a player's Profile Summary by XUID. */
  public getProfileSummaryByXuid$(xuid: BigNumber): Observable<WoodstockProfileSummary> {
    return this.apiService.getRequest$<WoodstockProfileSummary>(
      `${this.basePath}/player/xuid(${xuid})/profileSummary`,
    );
  }

  /** Sends a community message. */
  public postSendCommunityMessageToXuids$(
    xuids: BigNumber[],
    communityMessage: CommunityMessage,
  ): Observable<CommunityMessageResult<BigNumber>[]> {
    const bulkMessage = communityMessage as BulkCommunityMessage;
    bulkMessage.xuids = xuids;

    return this.apiService.postRequest$<CommunityMessageResult<BigNumber>[]>(
      `${this.basePath}/notifications/send`,
      bulkMessage,
    );
  }

  /** Sends a community message. */
  public postSendCommunityMessageToLspGroup$(
    groupId: BigNumber,
    communityMessage: CommunityMessage,
  ): Observable<CommunityMessageResult<BigNumber>> {
    return this.apiService.postRequest$<CommunityMessageResult<BigNumber>>(
      `${this.basePath}/notifications/send/groupId(${groupId})`,
      communityMessage,
    );
  }

  /** Gets a player's Profile Summary by XUID. */
  public getCreditHistoryByXuid$(
    xuid: BigNumber,
    startIndex: number = 0,
    maxResults: number = 100,
  ): Observable<WoodstockCreditDetailsEntry[]> {
    const httpParams = new HttpParams()
      .set('startIndex', startIndex.toString())
      .set('maxResults', maxResults.toString());
    return this.apiService.getRequest$<WoodstockCreditDetailsEntry[]>(
      `${this.basePath}/player/xuid(${xuid})/creditUpdates`,
      httpParams,
    );
  }

  /** Gets a player's history of backstage passes by XUID. */
  public getBackstagePassHistoryByXuid$(xuid: BigNumber): Observable<BackstagePassHistory[]> {
    return this.apiService.getRequest$<BackstagePassHistory[]>(
      `${this.basePath}/player/xuid(${xuid})/backstagePassUpdates`,
    );
  }

  /** Gets a player's account inventory by XUID. */
  public getPlayerAccountInventoryByXuid$(
    xuid: BigNumber,
  ): Observable<WoodstockPlayerAccountInventory> {
    return this.apiService.getRequest$<WoodstockPlayerAccountInventory>(
      `${this.basePath}/player/xuid(${xuid})/accountInventory`,
    );
  }

  /** Gets a player's profile list  by XUID. */
  public getPlayerInventoryProfilesByXuid$(
    xuid: BigNumber,
  ): Observable<WoodstockPlayerInventoryProfile[]> {
    return this.apiService
      .getRequest$<WoodstockPlayerInventoryProfile[]>(
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
  public getPlayerInventoryByXuid$(xuid: BigNumber): Observable<WoodstockPlayerInventory> {
    return this.apiService.getRequest$<WoodstockPlayerInventory>(
      `${this.basePath}/player/xuid(${xuid})/inventory`,
    );
  }

  /** Gets a specific version of a player's inventory */
  public getPlayerInventoryByProfileId$(
    profileId: BigNumber,
  ): Observable<WoodstockPlayerInventory> {
    return this.apiService.getRequest$<WoodstockPlayerInventory>(
      `${this.basePath}/player/profileId(${profileId})/inventory`,
    );
  }

  /** Gift players inventory items. */
  public postGiftPlayers$(gift: WoodstockGroupGift): Observable<GiftResponse<BigNumber>[]> {
    return this.apiService.postRequest$<GiftResponse<BigNumber>[]>(
      `${this.basePath}/gifting/players`,
      gift,
    );
  }

  /** Gift players inventory items using a background task. */
  public postGiftPlayersUsingBackgroundTask$(
    gift: WoodstockGroupGift,
  ): Observable<BackgroundJob<void>> {
    return this.apiService.postRequest$<BackgroundJob<void>>(
      `${this.basePath}/gifting/players/useBackgroundProcessing`,
      gift,
    );
  }

  /** Gift lsp group inventory items. */
  public postGiftLspGroup$(
    lspGroup: LspGroup,
    gift: WoodstockGift,
  ): Observable<GiftResponse<BigNumber>> {
    return this.apiService.postRequest$<GiftResponse<BigNumber>>(
      `${this.basePath}/gifting/groupId(${lspGroup.id})`,
      gift,
    );
  }

  /** Gets player auctions by XUID. */
  public getPlayerAuctionsByXuid$(
    xuid: BigNumber,
    filters: AuctionFilters,
  ): Observable<PlayerAuction[]> {
    let httpParams: HttpParams = new HttpParams()
      .append('sort', filters.sort.toString())
      .append('status', filters.status.toString());

    if (filters?.carId) {
      httpParams = httpParams.append('carId', filters.carId.toString());
    }

    if (filters?.makeId) {
      httpParams = httpParams.append('makeId', filters.makeId.toString());
    }

    return this.apiService.getRequest$<PlayerAuction[]>(
      `${this.basePath}/player/xuid(${xuid})/auctions`,
      httpParams,
    );
  }

  /** Gets player UGC items by XUID. */
  public getPlayerUGCByXuid$(xuid: BigNumber, filters: UGCFilters): Observable<PlayerUGCItem[]> {
    const httpParams = new HttpParams().append('xuid', xuid.toString());

    return this.getPlayerUGC$(filters, httpParams);
  }

  /** Gets player UGC items by share code. */
  public getPlayerUGCByShareCode$(
    shareCode: string,
    filters: UGCFilters,
  ): Observable<PlayerUGCItem[]> {
    const httpParams = new HttpParams().append('shareCode', shareCode);

    return this.getPlayerUGC$(filters, httpParams);
  }

  /** Gets the woodstock detailed car list. */
  public getDetailedKustoCars$(): Observable<KustoCar[]> {
    return this.apiService.getRequest$<KustoCar[]>(`${this.basePath}/kusto/cars`);
  }

  /** Gets a player's UGC item.  */
  public getPlayerUGCItem(id: string, type: UGCType): Observable<PlayerUGCItem> {
    switch (type) {
      case UGCType.Livery:
        return this.apiService.getRequest$<PlayerUGCItem>(
          `${this.basePath}/storefront/livery/${id}`,
        );
      case UGCType.Photo:
        return this.apiService.getRequest$<PlayerUGCItem>(
          `${this.basePath}/storefront/photo/${id}`,
        );
      default:
        throw new Error(`Invalid UGC item type for lookup: ${type}}`);
    }
  }

  /** Sets a UGC item's feature status.  */
  public setUGCItemFeatureStatus(status: UGCFeaturedStatus): Observable<void> {
    if (status.isFeatured && !status.expiry) {
      throw new Error('Cannot feature UGC item with an expiry duration.');
    }

    return this.apiService.postRequest$<void>(
      `${this.basePath}/storefront/itemId(${status.itemId})/featuredStatus`,
      status,
    );
  }

  /** Sends search request to lookup player ugc item. */
  private getPlayerUGC$(
    filters: UGCFilters,
    httpParams: HttpParams = new HttpParams(),
  ): Observable<PlayerUGCItem[]> {
    httpParams = httpParams
      .append('ugcType', filters.type.toString())
      .append('accessLevel', filters.accessLevel.toString())
      .append('orderBy', filters.orderBy.toString());

    if (filters?.carId) {
      httpParams = httpParams.append('carId', filters.carId.toString());
    }

    if (filters?.makeId) {
      httpParams = httpParams.append('makeId', filters.makeId.toString());
    }

    if (filters?.keyword) {
      httpParams = httpParams.append('keyword', filters.keyword.toString());
    }

    return this.apiService.getRequest$<PlayerUGCItem[]>(`${this.basePath}/storefront`, httpParams);
  }
}
