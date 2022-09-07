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
import { HttpParams } from '@angular/common/http';
import {
  BulkCommunityMessage,
  CommunityMessage,
  CommunityMessageResult,
} from '@models/community-message';
import { AuctionFilters } from '@models/auction-filters';
import { DetailedCar } from '@models/detailed-car';
import { PlayerAuction } from '@models/player-auction';
import { ProfileNote } from '@models/profile-note.model';
import { BackstagePassHistory } from '@models/backstage-pass-history';
import { UgcType } from '@models/ugc-filters';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { Gift, GroupGift } from '@models/gift';
import { UgcFeaturedStatus } from '@models/ugc-featured-status';
import { AuctionBlocklistEntry } from '@models/auction-blocklist-entry';
import { overrideSunriseEndpointKey } from '@helpers/override-endpoint-key';
import { PlayerAuctionAction } from '@models/player-auction-action';
import { GuidLikeString } from '@models/extended-types';
import { AuctionData } from '@models/auction-data';
import { GroupNotification, PlayerNotification } from '@models/notifications.model';
import { HideableUgc, HideableUgcFileType } from '@models/hideable-ugc.model';
import { DateTime } from 'luxon';
import { UnbanResult } from '@models/unban-result';

/** Handles calls to Sunrise API routes. */
@Injectable({
  providedIn: 'root',
})
export class SunriseService {
  public basePath: string = 'v1/title/sunrise';

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
  /** Edits a group community message. */
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
    endpointKeyOverride?: string,
  ): Observable<IdentityResultAlphaBatch> {
    return this.apiService.postRequest$<IdentityResultAlphaBatch>(
      `${this.basePath}/players/identities`,
      identityQueries,
      undefined,
      overrideSunriseEndpointKey(endpointKeyOverride),
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
  public getDetailedCars$(): Observable<DetailedCar[]> {
    return this.apiService.getRequest$<DetailedCar[]>(`${this.basePath}/kusto/cars`);
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
  ): Observable<SunriseBanSummary[]> {
    return this.apiService.postRequest$<SunriseBanSummary[]>(
      `${this.basePath}/players/banSummaries`,
      xuids,
      undefined,
      overrideSunriseEndpointKey(endpointKeyOverride),
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
  public getGiftHistoryByXuid$(
    xuid: BigNumber,
    startDate?: DateTime,
    endDate?: DateTime,
  ): Observable<SunriseGiftHistory[]> {
    let params = new HttpParams();

    if (startDate) {
      params = params.set('startDate', startDate.toISO());
    }

    if (endDate) {
      params = params.set('endDate', endDate.toISO());
    }

    return this.apiService.getRequest$<SunriseGiftHistory[]>(
      `${this.basePath}/player/xuid(${xuid})/giftHistory`,
      params,
    );
  }

  /** Gets Gift history by a LSP group ID. */
  public getGiftHistoryByLspGroup$(
    lspGroupId: BigNumber,
    startDate?: DateTime,
    endDate?: DateTime,
  ): Observable<SunriseGiftHistory[]> {
    let params = new HttpParams();

    if (startDate) {
      params = params.set('startDate', startDate.toISO());
    }

    if (endDate) {
      params = params.set('endDate', endDate.toISO());
    }

    return this.apiService.getRequest$<SunriseGiftHistory[]>(
      `${this.basePath}/group/groupId(${lspGroupId})/giftHistory`,
      params,
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
  public getPlayerUgcByXuid$(xuid: BigNumber, contentType: UgcType): Observable<PlayerUgcItem[]> {
    const httpParams = new HttpParams().append('ugcType', contentType.toString());

    return this.apiService.getRequest$<PlayerUgcItem[]>(
      `${this.basePath}/storefront/xuid(${xuid})`,
      httpParams,
    );
  }

  /** Gets a player's hidden UGC item. */
  public getPlayerHiddenUgcByXuid$(xuid: BigNumber): Observable<HideableUgc[]> {
    return this.apiService.getRequest$<HideableUgc[]>(
      `${this.basePath}/storefront/xuid(${xuid})/hidden`,
    );
  }

  /** Hide UGC item. */
  public hideUgc$(ugcId: string): Observable<void> {
    return this.apiService.postRequest$<void>(
      `${this.basePath}/storefront/ugc/${ugcId}/hide`,
      null,
    );
  }

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

  /** Gets player UGC items by share code. */
  public getPlayerUgcByShareCode$(
    shareCode: string,
    contentType: UgcType,
  ): Observable<PlayerUgcItem[]> {
    const httpParams = new HttpParams().append('ugcType', contentType.toString());

    return this.apiService.getRequest$<PlayerUgcItem[]>(
      `${this.basePath}/storefront/sharecode(${shareCode})`,
      httpParams,
    );
  }

  /** Gets a player's UGC item.  */
  public getPlayerUgcItem$(id: string, ugcType: UgcType): Observable<PlayerUgcItem> {
    if (ugcType === UgcType.Unknown) {
      throw new Error(`Invalid UGC item type for lookup: ${ugcType}}`);
    }

    return this.apiService.getRequest$<PlayerUgcItem>(
      `${this.basePath}/storefront/${ugcType.toLowerCase()}(${id})`,
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

  /** Gifts livery to players.  */
  public postGiftLiveryToPlayersUsingBackgroundJob$(
    liveryId: string,
    groupGift: GroupGift,
  ): Observable<BackgroundJob<void>> {
    return this.apiService.postRequest$<BackgroundJob<void>>(
      `${this.basePath}/gifting/livery(${liveryId})/players/useBackgroundProcessing`,
      groupGift,
    );
  }

  /** Gifts livery to an LSP group.  */
  public postGiftLiveryToLspGroup$(
    liveryId: string,
    lspGroup: LspGroup,
    gift: Gift,
  ): Observable<GiftResponse<BigNumber>> {
    return this.apiService.postRequest$<GiftResponse<BigNumber>>(
      `${this.basePath}/gifting/livery(${liveryId})/groupId(${lspGroup.id})`,
      gift,
    );
  }
}
