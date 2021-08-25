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
  SunriseBanRequest,
  SunriseBanResult,
  SunriseBanSummary,
  SunriseConsoleDetailsEntry,
  SunriseCreditDetailsEntry,
  SunriseGift,
  SunriseGiftHistory,
  SunriseGroupGift,
  SunriseMasterInventory,
  SunrisePlayerAccountInventory,
  SunrisePlayerDetails,
  SunrisePlayerInventory,
  SunrisePlayerInventoryProfile,
  SunrisePlayerNotifications,
  SunriseProfileSummary,
  SunriseSharedConsoleUser,
  SunriseUserFlags,
} from '@models/sunrise';
import { ApiService } from '@services/api';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { chain } from 'lodash';
import { GiftResponse } from '@models/gift-response';
import { BackgroundJob } from '@models/background-job';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import {
  BulkCommunityMessage,
  CommunityMessage,
  CommunityMessageResult,
} from '@models/community-message';
import { AuctionFilters } from '@models/auction-filters';
import { KustoCar } from '@models/kusto-car';
import { PlayerAuction } from '@models/player-auction';
import { ProfileNote } from '@models/profile-note.model';
import { BackstagePassHistory } from '@models/backstage-pass-history';
import { UGCFilters, UGCType } from '@models/ugc-filters';
import { PlayerUGCItem } from '@models/player-ugc-item';
import { UGCFeaturedStatus } from '@models/ugc-featured-status';
import { AuctionBlocklistEntry } from '@models/auction-blocklist-entry';
import { SunriseEndpointKey } from '@models/enums';
import { overrideSunriseEndpointKey } from '@helpers/override-endpoint-key';

/** Handles calls to Sunrise API routes. */
@Injectable({
  providedIn: 'root',
})
export class SunriseService {
  public basePath: string = 'v1/title/sunrise';

  constructor(private readonly apiService: ApiService) {}

  /** Gets the status of a player's notifications. */
  public getPlayerNotificationsByXuid$(xuid: BigNumber): Observable<SunrisePlayerNotifications> {
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

  /** Gets the sunrise lsp groups. */
  public getLspGroups$(): Observable<LspGroups> {
    return this.apiService.getRequest$<LspGroups>(`${this.basePath}/groups`);
  }

  /** Gets auction house blocklist. */
  public getAuctionBlocklist$(): Observable<AuctionBlocklistEntry[]> {
    return this.apiService.getRequest$<AuctionBlocklistEntry[]>(
      `${this.basePath}/auctions/blockList`,
    );
  }

  /** Adds entries to auction house blocklist. */
  public postAuctionBlocklistEntries$(
    entries: AuctionBlocklistEntry[],
  ): Observable<AuctionBlocklistEntry[]> {
    return this.apiService.postRequest$(`${this.basePath}/auctions/blockList`, entries);
  }

  /** Deletes an auction house blocklist entry. */
  public deleteAuctionBlocklistEntry$(carId: BigNumber): Observable<AuctionBlocklistEntry[]> {
    return this.apiService.deleteRequest$<AuctionBlocklistEntry[]>(
      `${this.basePath}/auctions/blockList/carId(${carId})`,
    );
  }

  /** Gets the sunrise master inventory. */
  public getMasterInventory$(): Observable<SunriseMasterInventory> {
    return this.apiService.getRequest$<SunriseMasterInventory>(`${this.basePath}/masterInventory`);
  }

  /** Gets the sunrise detailed car list. */
  public getDetailedKustoCars$(): Observable<KustoCar[]> {
    return this.apiService.getRequest$<KustoCar[]>(`${this.basePath}/kusto/cars`);
  }

  /** Gets sunrise player details with a gamertag. This can be used to retrieve a XUID. */
  public getPlayerDetailsByGamertag$(gamertag: string): Observable<SunrisePlayerDetails> {
    return this.apiService.getRequest$<SunrisePlayerDetails>(
      `${this.basePath}/player/gamertag(${gamertag})/details`,
    );
  }

  /** Gets sunrise player details with a XUID. */
  public getPlayerDetailsByXuid$(xuid: BigNumber): Observable<SunrisePlayerDetails> {
    return this.apiService.getRequest$<SunrisePlayerDetails>(
      `${this.basePath}/player/xuid(${xuid})/details`,
    );
  }

  /** Gets user flags by a XUID. */
  public getFlagsByXuid$(xuid: BigNumber): Observable<SunriseUserFlags> {
    return this.apiService.getRequest$<SunriseUserFlags>(
      `${this.basePath}/player/xuid(${xuid})/userFlags`,
    );
  }

  /** Gets user flags by a XUID. */
  public getProfileNotesXuid$(xuid: BigNumber): Observable<ProfileNote[]> {
    return this.apiService.getRequest$<ProfileNote[]>(
      `${this.basePath}/player/xuid(${xuid})/profileNotes`,
    );
  }

  /** Sets user flags by a XUID. */
  public putFlagsByXuid$(xuid: BigNumber, flags: SunriseUserFlags): Observable<SunriseUserFlags> {
    return this.apiService.putRequest$<SunriseUserFlags>(
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
  public getBanSummariesByXuids$(
    xuids: BigNumber[],
    endpointKeyOverride?: SunriseEndpointKey,
  ): Observable<SunriseBanSummary[]> {
    let headers = new HttpHeaders();
    if (!!endpointKeyOverride) {
      headers = overrideSunriseEndpointKey(endpointKeyOverride, headers);
    }

    return this.apiService.postRequest$<SunriseBanSummary[]>(
      `${this.basePath}/players/banSummaries`,
      xuids,
      undefined,
      headers,
    );
  }

  /** Bans players by a list of XUIDs. */
  public postBanPlayers$(bans: SunriseBanRequest[]): Observable<SunriseBanResult[]> {
    return this.apiService.postRequest$<SunriseBanResult[]>(`${this.basePath}/players/ban`, bans);
  }

  /** Bans players by a list of XUIDs using background processing. */
  public postBanPlayersWithBackgroundProcessing$(
    bans: SunriseBanRequest[],
  ): Observable<BackgroundJob<void>> {
    return this.apiService.postRequest$<BackgroundJob<void>>(
      `${this.basePath}/players/ban/useBackgroundProcessing`,
      bans,
    );
  }

  /** Gets Gift history by a XUID. */
  public getGiftHistoryByXuid$(xuid: BigNumber): Observable<SunriseGiftHistory[]> {
    return this.apiService.getRequest$<SunriseGiftHistory[]>(
      `${this.basePath}/player/xuid(${xuid})/giftHistory`,
    );
  }

  /** Gets Gift history by a LSP group ID. */
  public getGiftHistoryByLspGroup$(lspGroupId: BigNumber): Observable<SunriseGiftHistory[]> {
    return this.apiService.getRequest$<SunriseGiftHistory[]>(
      `${this.basePath}/group/groupId(${lspGroupId})/giftHistory`,
    );
  }

  /** Gets shared console users by XUID. */
  public getSharedConsoleUsersByXuid$(xuid: BigNumber): Observable<SunriseSharedConsoleUser[]> {
    return this.apiService.getRequest$<SunriseSharedConsoleUser[]>(
      `${this.basePath}/player/xuid(${xuid})/sharedConsoleUsers`,
    );
  }

  /** Gets console details by XUID. */
  public getConsoleDetailsByXuid$(xuid: BigNumber): Observable<SunriseConsoleDetailsEntry[]> {
    return this.apiService.getRequest$<SunriseConsoleDetailsEntry[]>(
      `${this.basePath}/player/xuid(${xuid})/consoleDetails`,
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

  /** Updates a console's ban status by the Console's ID. */
  public putBanStatusByConsoleId$(consoleId: string, isBanned: boolean): Observable<void> {
    return this.apiService.putRequest$<void>(
      `${this.basePath}/console/consoleId(${consoleId})/consoleBanStatus/isBanned(${isBanned})`,
      null,
    );
  }

  /** Gets a player's Profile Summary by XUID. */
  public getProfileSummaryByXuid$(xuid: BigNumber): Observable<SunriseProfileSummary> {
    return this.apiService.getRequest$<SunriseProfileSummary>(
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
  ): Observable<SunriseCreditDetailsEntry[]> {
    const httpParams = new HttpParams()
      .set('startIndex', startIndex.toString())
      .set('maxResults', maxResults.toString());
    return this.apiService.getRequest$<SunriseCreditDetailsEntry[]>(
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
  ): Observable<SunrisePlayerAccountInventory> {
    return this.apiService.getRequest$<SunrisePlayerAccountInventory>(
      `${this.basePath}/player/xuid(${xuid})/accountInventory`,
    );
  }

  /** Gets a player's profile list  by XUID. */
  public getPlayerInventoryProfilesByXuid$(
    xuid: BigNumber,
  ): Observable<SunrisePlayerInventoryProfile[]> {
    return this.apiService
      .getRequest$<SunrisePlayerInventoryProfile[]>(
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
  public getPlayerInventoryByXuid$(xuid: BigNumber): Observable<SunrisePlayerInventory> {
    return this.apiService.getRequest$<SunrisePlayerInventory>(
      `${this.basePath}/player/xuid(${xuid})/inventory`,
    );
  }

  /** Gets a specific version of a player's inventory */
  public getPlayerInventoryByProfileId$(profileId: BigNumber): Observable<SunrisePlayerInventory> {
    return this.apiService.getRequest$<SunrisePlayerInventory>(
      `${this.basePath}/player/profileId(${profileId})/inventory`,
    );
  }

  /** Gift players inventory items. */
  public postGiftPlayers$(gift: SunriseGroupGift): Observable<GiftResponse<BigNumber>[]> {
    return this.apiService.postRequest$<GiftResponse<BigNumber>[]>(
      `${this.basePath}/gifting/players`,
      gift,
    );
  }

  /** Gift players inventory items using a background task. */
  public postGiftPlayersUsingBackgroundTask$(
    gift: SunriseGroupGift,
  ): Observable<BackgroundJob<void>> {
    return this.apiService.postRequest$<BackgroundJob<void>>(
      `${this.basePath}/gifting/players/useBackgroundProcessing`,
      gift,
    );
  }

  /** Gift lsp group inventory items. */
  public postGiftLspGroup$(
    lspGroup: LspGroup,
    gift: SunriseGift,
  ): Observable<GiftResponse<BigNumber>> {
    return this.apiService.postRequest$<GiftResponse<BigNumber>>(
      `${this.basePath}/gifting/groupId(${lspGroup.id})`,
      gift,
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
