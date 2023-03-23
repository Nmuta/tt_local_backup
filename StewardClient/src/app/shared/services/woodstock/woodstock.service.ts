import BigNumber from 'bignumber.js';
import { Injectable } from '@angular/core';
import {
  IdentityQueryAlphaBatch,
  IdentityResultAlphaBatch,
  IdentityQueryAlpha,
  IdentityResultAlpha,
} from '@models/identity-query.model';
import { LspGroups } from '@models/lsp-group';
import {
  LiveOpsExtendedBanDescriptions,
  WoodstockBanRequest,
  WoodstockBanResult,
  WoodstockBanSummary,
  WoodstockConsoleDetailsEntry,
  WoodstockGiftHistory,
  WoodstockMasterInventory,
  WoodstockPlayerAccountInventory,
  WoodstockPlayerDetails,
  WoodstockPlayerInventory,
  WoodstockPlayerInventoryProfile,
  WoodstockProfileRollback,
  WoodstockProfileSummary,
  WoodstockSharedConsoleUser,
  WoodstockUserFlags,
} from '@models/woodstock';
import { ApiService } from '@services/api';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { chain } from 'lodash';
import { BackgroundJob } from '@models/background-job';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import {
  BulkCommunityMessage,
  CommunityMessage,
  CommunityMessageResult,
} from '@models/community-message';
import { AuctionFilters } from '@models/auction-filters';
import { PlayerAuction } from '@models/player-auction';
import { BackstagePassHistory } from '@models/backstage-pass-history';
import {
  ClonedItemResult,
  PersistedItemResult,
  PlayerUgcItem,
  WoodstockPlayerUgcItem,
} from '@models/player-ugc-item';
import { UgcType } from '@models/ugc-filters';
import { UgcFeaturedStatus } from '@models/ugc-featured-status';
import { SimpleCar } from '@models/cars';
import { overrideWoodstockEndpointKey } from '@helpers/override-endpoint-key';
import { AuctionBlocklistEntry } from '@models/auction-blocklist-entry';
import { GroupNotification, PlayerNotification } from '@models/notifications.model';
import { ProfileNote } from '@models/profile-note.model';
import { AuctionData } from '@models/auction-data';
import { GuidLikeString } from '@models/extended-types';
import { HideableUgc } from '@models/hideable-ugc.model';
import { DateTime } from 'luxon';
import { PlayerAuctionAction } from '@models/player-auction-action';
import {
  DEFAULT_LEADERBOARD_SCORES_MAX_RESULTS,
  DEFAULT_LEADERBOARD_SCORES_NEAR_PLAYER_MAX_RESULTS,
  Leaderboard,
  LeaderboardScore,
} from '@models/leaderboards';
import { HideableUgcFileType } from '@models/hideable-ugc.model';
import { DeviceType, PegasusProjectionSlot } from '@models/enums';
import { addQueryParamArray } from '@helpers/add-query-param-array';
import { UnbanResult } from '@models/unban-result';

/** Handles calls to Woodstock API routes. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockService {
  public basePath: string = 'v1/title/woodstock';
  public basePathV2: string = 'v2/title/woodstock';

  constructor(private readonly apiService: ApiService) {}

  /** Gets the status of a player's notifications. */
  public getPlayerNotifications$(xuid: BigNumber): Observable<PlayerNotification[]> {
    return this.apiService.getRequest$(`${this.basePath}/player/xuid(${xuid})/notifications`);
  }

  /** Gets the status of an LSP group's notifications. */
  public getGroupNotifications$(lspGroupId: BigNumber): Observable<GroupNotification[]> {
    return this.apiService.getRequest$(
      `${this.basePath}/group/groupId(${lspGroupId})/notifications`,
    );
  }

  /** Edits a player's community message. */
  public postEditPlayerCommunityMessage$(
    xuid: BigNumber,
    notificationId: string,
    communityMessage: CommunityMessage,
  ): Observable<void> {
    return this.apiService.postRequest$<void>(
      `${this.basePath}/player/xuid(${xuid})/notifications/notificationId(${notificationId})`,
      communityMessage,
    );
  }

  // TODO: https://dev.azure.com/t10motorsport/Motorsport/_workitems/edit/1285965
  /** Edits a group community message. */
  public postEditLspGroupCommunityMessage$(
    _lspGroupId: BigNumber,
    notificationId: string,
    communityMessage: CommunityMessage,
  ): Observable<void> {
    return this.apiService.postRequest$<void>(
      `${this.basePath}/notifications/notificationId(${notificationId})`,
      communityMessage,
    );
  }

  /** Deletes a player's community message. */
  public deletePlayerCommunityMessage$(xuid: BigNumber, notificationId: string): Observable<void> {
    return this.apiService.deleteRequest$<void>(
      `${this.basePath}/player/xuid(${xuid})/notifications/notificationId(${notificationId})`,
    );
  }

  // TODO: https://dev.azure.com/t10motorsport/Motorsport/_workitems/edit/1285965
  /** Deletes a group community message. */
  public deleteLspGroupCommunityMessage$(
    _lspGroupId: BigNumber,
    notificationId: string,
  ): Observable<void> {
    return this.apiService.deleteRequest$<void>(
      `${this.basePath}/notifications/notificationId(${notificationId})`,
    );
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
    return this.apiService.getRequest$<WoodstockMasterInventory>(`${this.basePath}/items`);
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
  public getProfileNotesXuid$(xuid: BigNumber): Observable<ProfileNote[]> {
    return this.apiService.getRequest$<ProfileNote[]>(
      `${this.basePath}/player/xuid(${xuid})/profileNotes`,
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

  /** Gets ban history by a XUID. */
  public getBanHistoryByXuid$(xuid: BigNumber): Observable<LiveOpsExtendedBanDescriptions> {
    return this.apiService.getRequest$<LiveOpsExtendedBanDescriptions>(
      `${this.basePath}/player/xuid(${xuid})/banHistory`,
    );
  }

  /** Expire bans by ban entry IDs. */
  public expireBan$(banEntryId: BigNumber): Observable<UnbanResult> {
    return this.apiService.postRequest$<UnbanResult>(
      `${this.basePath}/ban/${banEntryId}/expire`,
      null,
    );
  }

  /** Delete bans by ban entry IDs. */
  public deleteBan$(banEntryId: BigNumber): Observable<UnbanResult> {
    return this.apiService.postRequest$<UnbanResult>(
      `${this.basePath}/ban/${banEntryId}/delete`,
      null,
    );
  }

  /** Gets ban summaries by a list of XUIDs. */
  public getBanSummariesByXuids$(
    xuids: BigNumber[],
    endpointKeyOverride?: string,
  ): Observable<WoodstockBanSummary[]> {
    let headers = new HttpHeaders();
    if (!!endpointKeyOverride) {
      headers = overrideWoodstockEndpointKey(endpointKeyOverride, headers);
    }

    return this.apiService.postRequest$<WoodstockBanSummary[]>(
      `${this.basePath}/players/banSummaries`,
      xuids,
      undefined,
      headers,
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
  public getGiftHistoryByXuid$(
    xuid: BigNumber,
    startDate?: DateTime,
    endDate?: DateTime,
  ): Observable<WoodstockGiftHistory[]> {
    let params = new HttpParams();

    if (startDate) {
      params = params.set('startDate', startDate.toISO());
    }

    if (endDate) {
      params = params.set('endDate', endDate.toISO());
    }

    return this.apiService.getRequest$<WoodstockGiftHistory[]>(
      `${this.basePath}/player/xuid(${xuid})/giftHistory`,
      params,
    );
  }

  /** Gets Gift history by a LSP group ID. */
  public getGiftHistoryByLspGroup$(
    lspGroupId: BigNumber,
    startDate?: DateTime,
    endDate?: DateTime,
  ): Observable<WoodstockGiftHistory[]> {
    let params = new HttpParams();

    if (startDate) {
      params = params.set('startDate', startDate.toISO());
    }

    if (endDate) {
      params = params.set('endDate', endDate.toISO());
    }

    return this.apiService.getRequest$<WoodstockGiftHistory[]>(
      `${this.basePath}/group/groupId(${lspGroupId})/giftHistory`,
      params,
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
      `${this.basePath}/console/consoleId(${consoleId})/consoleBanStatus/isBanned(${isBanned})`,
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

  /** Gets a player's auction action log by xuid.  */
  public getPlayerAuctionLogByXuid$(
    xuid: BigNumber,
    skipToken?: DateTime,
  ): Observable<PlayerAuctionAction[]> {
    if (!skipToken) {
      return this.apiService.getRequest$<PlayerAuctionAction[]>(
        `${this.basePath}/player/xuid(${xuid})/auctionLog`,
      );
    } else {
      const skipTokenString = skipToken.toISO();
      return this.apiService.getRequest2$<PlayerAuctionAction[]>(
        `${this.basePath}/player/xuid(${xuid})/auctionLog`,
        { params: { skipToken: skipTokenString } },
      );
    }
  }

  /** Gets an auction's data by ID. */
  public getAuctionDataByAuctionId$(auctionId: GuidLikeString): Observable<AuctionData> {
    return this.apiService.getRequest$<AuctionData>(
      `${this.basePath}/auction/${auctionId}/details`,
    );
  }

  /** Gets an auction's data by ID. */
  public deleteAuctionByAuctionId$(auctionId: GuidLikeString): Observable<void> {
    return this.apiService.deleteRequest$<void>(`${this.basePath}/auction/${auctionId}`);
  }

  /** Gets player UGC items by XUID. */
  public getPlayerUgcByXuid$(xuid: BigNumber, contentType: UgcType): Observable<PlayerUgcItem[]> {
    const httpParams = new HttpParams().append('ugcType', contentType.toString());

    return this.apiService.getRequest$<PlayerUgcItem[]>(
      `${this.basePath}/storefront/xuid(${xuid})`,
      httpParams,
    );
  }
  /** Sets a UGC item's GeoFlags*/
  public setUgcGeoFlag$(ugcId: string, geoFlags: string[]): Observable<void> {
    return this.apiService.postRequest$(`${this.basePathV2}/ugc/${ugcId}/geoFlags`, geoFlags);
  }

  /** Gets a player's hidden UGC item. */
  public getPlayerHiddenUgcByXuid$(xuid: BigNumber): Observable<HideableUgc[]> {
    return this.apiService.getRequest$<HideableUgc[]>(
      `${this.basePath}/storefront/xuid(${xuid})/hidden`,
    );
  }

  // /** Hide UGC item. */
  // public hideUgc$(ugcId: string): Observable<void> {
  //   return this.apiService.postRequest$<void>(
  //     `${this.basePath}/storefront/ugc/${ugcId}/hide`,
  //     null,
  //   );
  // }

  /** Unhide UGC item. */
  public unhideUgc$(
    xuid: BigNumber,
    fileType: HideableUgcFileType,
    ugcId: GuidLikeString,
  ): Observable<void> {
    return this.apiService.postRequest$<void>(
      `${this.basePath}/storefront/${xuid}/ugc/${fileType}/${ugcId}/unhide`,
      null,
    );
  }

  /** Persist UGC item to the system user. */
  public persistUgc$(ugcId: string): Observable<PersistedItemResult> {
    return this.apiService.postRequest$<PersistedItemResult>(
      `${this.basePathV2}/ugc/${ugcId}/persist`,
      null,
    );
  }

  /** Persist UGC item to the system user. */
  public cloneUgc$(ugcId: string, contentType: UgcType): Observable<ClonedItemResult> {
    return this.apiService.postRequest$<ClonedItemResult>(`${this.basePathV2}/ugc/${ugcId}/clone`, {
      contentType,
      keepGuid: true, // admin pages default was true
      isSearchable: true, // admin pages default was true
    });
  }

  /** Gets player UGC items by share code. */
  public getPlayerUgcByShareCode$(
    shareCode: string,
    contentType: UgcType,
  ): Observable<WoodstockPlayerUgcItem[]> {
    const httpParams = new HttpParams().append('ugcType', contentType.toString());

    return this.apiService.getRequest$<WoodstockPlayerUgcItem[]>(
      `${this.basePath}/storefront/sharecode(${shareCode})`,
      httpParams,
    );
  }

  /** Gets the woodstock detailed car list. */
  public getSimpleCars$(pegasusSlotId?: PegasusProjectionSlot): Observable<SimpleCar[]> {
    let params = new HttpParams();
    if (!!pegasusSlotId) {
      params = params.set('slotId', pegasusSlotId);
    }

    return this.apiService.getRequest$<SimpleCar[]>(`${this.basePath}/items/cars`, params);
  }

  /**
   * Gets a player's UGC item.
   * @deprecated TODO: Endpoint has been ported to v2 and should ve moved to a api-v2/* service
   */
  public getPlayerUgcItem$(id: string, ugcType: UgcType): Observable<WoodstockPlayerUgcItem> {
    if (ugcType === UgcType.Unknown) {
      throw new Error(`Invalid UGC item type for lookup: ${ugcType}}`);
    }

    return this.apiService.getRequest$<WoodstockPlayerUgcItem>(
      `${this.basePathV2}/ugc/${ugcType.toLowerCase()}/${id}`,
    );
  }

  /** Sets a UGC item's feature status.  */
  public setUgcItemFeatureStatus(status: UgcFeaturedStatus): Observable<void> {
    if (status.isFeatured && !status.expiry) {
      throw new Error('Cannot feature UGC item with an expiry duration.');
    }

    return this.apiService.postRequest$<void>(
      `${this.basePath}/storefront/itemId(${status.itemId})/featuredStatus`,
      status,
    );
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

  /** Gets leaderboards. */
  public getLeaderboards$(pegasusEnvironment: string): Observable<Leaderboard[]> {
    const params = new HttpParams().set('pegasusEnvironment', pegasusEnvironment);

    return this.apiService.getRequest$<Leaderboard[]>(`${this.basePath}/leaderboards`, params);
  }

  /** Gets leaderboard metadata. */
  public getLeaderboardMetadata$(
    scoreboardTypeId: BigNumber,
    scoreTypeId: BigNumber,
    trackId: BigNumber,
    pivotId: BigNumber,
    pegasusEnvironment: string,
  ): Observable<Leaderboard> {
    const params = new HttpParams()
      .set('scoreboardType', scoreboardTypeId.toString())
      .set('scoreType', scoreTypeId.toString())
      .set('trackId', trackId.toString())
      .set('pivotId', pivotId.toString())
      .set('pegasusEnvironment', pegasusEnvironment);

    return this.apiService.getRequest$<Leaderboard>(
      `${this.basePath}/leaderboard/metadata`,
      params,
    );
  }

  /** Gets leaderboard scores. */
  public getLeaderboardScores$(
    scoreboardTypeId: BigNumber,
    scoreTypeId: BigNumber,
    trackId: BigNumber,
    pivotId: BigNumber,
    deviceTypes: DeviceType[],
    startAt: BigNumber,
    maxResults: BigNumber = new BigNumber(DEFAULT_LEADERBOARD_SCORES_MAX_RESULTS),
    endpointKeyOverride?: string,
  ): Observable<LeaderboardScore[]> {
    let params = new HttpParams()
      .set('scoreboardType', scoreboardTypeId.toString())
      .set('scoreType', scoreTypeId.toString())
      .set('trackId', trackId.toString())
      .set('pivotId', pivotId.toString())
      .set('startAt', startAt.toString())
      .set('maxResults', maxResults.toString());
    params = addQueryParamArray(params, 'deviceTypes', deviceTypes);

    let headers = new HttpHeaders();
    if (!!endpointKeyOverride) {
      headers = overrideWoodstockEndpointKey(endpointKeyOverride, headers);
    }

    return this.apiService.getRequest$<LeaderboardScore[]>(
      `${this.basePath}/leaderboard/scores/top`,
      params,
      headers,
    );
  }

  /** Gets leaderboard scores. */
  public getLeaderboardScoresNearPlayer$(
    xuid: BigNumber,
    scoreboardTypeId: BigNumber,
    scoreTypeId: BigNumber,
    trackId: BigNumber,
    pivotId: BigNumber,
    deviceTypes: DeviceType[],
    maxResults: BigNumber = new BigNumber(DEFAULT_LEADERBOARD_SCORES_NEAR_PLAYER_MAX_RESULTS),
    endpointKeyOverride?: string,
  ): Observable<LeaderboardScore[]> {
    let params = new HttpParams()
      .set('scoreboardType', scoreboardTypeId.toString())
      .set('scoreType', scoreTypeId.toString())
      .set('trackId', trackId.toString())
      .set('pivotId', pivotId.toString())
      .set('maxResults', maxResults.toString());
    params = addQueryParamArray(params, 'deviceTypes', deviceTypes);

    let headers = new HttpHeaders();
    if (!!endpointKeyOverride) {
      headers = overrideWoodstockEndpointKey(endpointKeyOverride, headers);
    }

    return this.apiService.getRequest$<LeaderboardScore[]>(
      `${this.basePath}/leaderboard/scores/near-player/${xuid}`,
      params,
      headers,
    );
  }

  /** Deletes leaderboard scores. */
  public deleteLeaderboardScores$(
    scoreIds: GuidLikeString[],
    endpointKeyOverride?: string,
  ): Observable<void> {
    let headers = new HttpHeaders();
    if (!!endpointKeyOverride) {
      headers = overrideWoodstockEndpointKey(endpointKeyOverride, headers);
    }

    return this.apiService.postRequest$<void>(
      `${this.basePath}/leaderboard/scores/delete`,
      scoreIds,
      undefined,
      headers,
    );
  }
}
