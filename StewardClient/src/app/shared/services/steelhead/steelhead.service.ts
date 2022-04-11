import BigNumber from 'bignumber.js';
import { Injectable } from '@angular/core';
import {
  SteelheadBanHistoryEntry,
  SteelheadBanRequest,
  SteelheadBanResult,
  SteelheadBanSummary,
  SteelheadConsoleDetailsEntry,
  SteelheadGift,
  SteelheadGiftHistory,
  SteelheadGroupGift,
  SteelheadMasterInventory,
  SteelheadPlayerDetails,
  SteelheadPlayerInventory,
  SteelheadPlayerInventoryProfile,
  SteelheadSharedConsoleUser,
} from '@models/steelhead';
import { BackgroundJob } from '@models/background-job';
import { GiftResponse } from '@models/gift-response';
import {
  IdentityQueryAlpha,
  IdentityQueryAlphaBatch,
  IdentityResultAlpha,
  IdentityResultAlphaBatch,
} from '@models/identity-query.model';
import { LspGroup, LspGroups } from '@models/lsp-group';
import { SteelheadUserFlags } from '@models/steelhead';
import { ApiService } from '@services/api';
import { chain } from 'lodash';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuctionFilters } from '@models/auction-filters';
import { PlayerAuction } from '@models/player-auction';
import { HttpParams } from '@angular/common/http';
import {
  BulkCommunityMessage,
  CommunityMessage,
  CommunityMessageResult,
} from '@models/community-message';
import { UgcType } from '@models/ugc-filters';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { DateTime } from 'luxon';
import { RacersCupSchedule } from '@models/racers-cup.model';
import { PegasusPathInfo } from '@models/pegasus-path-info';

/** Handles calls to Sunrise API routes. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadService {
  public basePath: string = 'v1/title/steelhead';

  constructor(private readonly apiService: ApiService) {}

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

  /** Gets ban summaries by a list of XUIDs. */
  public getBanSummariesByXuids$(xuids: BigNumber[]): Observable<SteelheadBanSummary[]> {
    return this.apiService.postRequest$<SteelheadBanSummary[]>(
      `${this.basePath}/players/banSummaries`,
      xuids,
    );
  }

  /** Gets ban history by a XUID. */
  public getBanHistoryByXuid$(xuid: BigNumber): Observable<SteelheadBanHistoryEntry[]> {
    return this.apiService.getRequest$<SteelheadBanHistoryEntry[]>(
      `${this.basePath}/player/xuid(${xuid})/banHistory`,
    );
  }

  /** Gets user flags by a XUID. */
  public getFlagsByXuid$(xuid: BigNumber): Observable<SteelheadUserFlags> {
    return this.apiService.getRequest$<SteelheadUserFlags>(
      `${this.basePath}/player/xuid(${xuid})/userFlags`,
    );
  }

  /** Sets user flags by a XUID. */
  public putFlagsByXuid$(
    xuid: BigNumber,
    flags: SteelheadUserFlags,
  ): Observable<SteelheadUserFlags> {
    return this.apiService.putRequest$<SteelheadUserFlags>(
      `${this.basePath}/player/xuid(${xuid})/userFlags`,
      flags,
    );
  }

  /** Gets shared console users by XUID. */
  public getSharedConsoleUsersByXuid$(xuid: BigNumber): Observable<SteelheadSharedConsoleUser[]> {
    return this.apiService.getRequest$<SteelheadSharedConsoleUser[]>(
      `${this.basePath}/player/xuid(${xuid})/sharedConsoleUsers`,
    );
  }

  /** Gets console details by XUID. */
  public getConsoleDetailsByXuid$(xuid: BigNumber): Observable<SteelheadConsoleDetailsEntry[]> {
    return this.apiService.getRequest$<SteelheadConsoleDetailsEntry[]>(
      `${this.basePath}/player/xuid(${xuid})/consoleDetails`,
    );
  }

  /** Bans players by a list of XUIDs. */
  public postBanPlayers$(bans: SteelheadBanRequest[]): Observable<SteelheadBanResult[]> {
    return this.apiService.postRequest$<SteelheadBanResult[]>(`${this.basePath}/players/ban`, bans);
  }

  /** Bans players by a list of XUIDs using background processing. */
  public postBanPlayersWithBackgroundProcessing$(
    bans: SteelheadBanRequest[],
  ): Observable<BackgroundJob<void>> {
    return this.apiService.postRequest$<BackgroundJob<void>>(
      `${this.basePath}/players/ban/useBackgroundProcessing`,
      bans,
    );
  }

  /** Gets Steelhead player details with a gamertag. This can be used to retrieve a XUID. */
  public getPlayerDetailsByGamertag$(gamertag: string): Observable<SteelheadPlayerDetails> {
    return this.apiService.getRequest$<SteelheadPlayerDetails>(
      `${this.basePath}/player/gamertag(${gamertag})/details`,
    );
  }

  /** Gets Gift history by a XUID. */
  public getGiftHistoryByXuid$(
    xuid: BigNumber,
    startDate?: DateTime,
    endDate?: DateTime,
  ): Observable<SteelheadGiftHistory[]> {
    let params = new HttpParams();

    if (startDate) {
      params = params.set('startDate', startDate.toISO());
    }

    if (endDate) {
      params = params.set('endDate', endDate.toISO());
    }

    return this.apiService.getRequest$<SteelheadGiftHistory[]>(
      `${this.basePath}/player/xuid(${xuid})/giftHistory`,
      params,
    );
  }

  /** Gets Gift history by a LSP Group. */
  public getGiftHistoryByLspGroup$(
    lspGroupId: BigNumber,
    startDate?: DateTime,
    endDate?: DateTime,
  ): Observable<SteelheadGiftHistory[]> {
    let params = new HttpParams();

    if (startDate) {
      params = params.set('startDate', startDate.toISO());
    }

    if (endDate) {
      params = params.set('endDate', endDate.toISO());
    }

    return this.apiService.getRequest$<SteelheadGiftHistory[]>(
      `${this.basePath}/group/groupId(${lspGroupId})/giftHistory`,
      params,
    );
  }

  /** Gets the Steelhead lsp groups. */
  public getLspGroups$(): Observable<LspGroups> {
    return this.apiService.getRequest$<LspGroups>(`${this.basePath}/groups`);
  }

  /** Gets the Steelhead master inventory. */
  public getMasterInventory$(): Observable<SteelheadMasterInventory> {
    return this.apiService.getRequest$<SteelheadMasterInventory>(
      `${this.basePath}/masterInventory`,
    );
  }

  /** Gets the Steelhead player's inventory. */
  public getPlayerInventoryByXuid$(xuid: BigNumber): Observable<SteelheadPlayerInventory> {
    return this.apiService.getRequest$<SteelheadPlayerInventory>(
      `${this.basePath}/player/xuid(${xuid})/inventory`,
    );
  }

  /** Gets a specific version of an Steelhead player's inventory */
  public getPlayerInventoryByProfileId$(
    profileId: BigNumber,
  ): Observable<SteelheadPlayerInventory> {
    return this.apiService.getRequest$<SteelheadPlayerInventory>(
      `${this.basePath}/player/profileId(${profileId})/inventory`,
    );
  }

  /** Gets a player's profile list  by XUID. */
  public getPlayerInventoryProfilesByXuid$(
    xuid: BigNumber,
  ): Observable<SteelheadPlayerInventoryProfile[]> {
    return this.apiService
      .getRequest$<SteelheadPlayerInventoryProfile[]>(
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

  /** Gift players inventory items. */
  public postGiftPlayers$(gift: SteelheadGroupGift): Observable<GiftResponse<BigNumber>[]> {
    return this.apiService.postRequest$<GiftResponse<BigNumber>[]>(
      `${this.basePath}/gifting/players`,
      gift,
    );
  }

  /** Gift players inventory items using a background task. */
  public postGiftPlayersUsingBackgroundTask$(
    gift: SteelheadGroupGift,
  ): Observable<BackgroundJob<void>> {
    return this.apiService.postRequest$<BackgroundJob<void>>(
      `${this.basePath}/gifting/players/useBackgroundProcessing`,
      gift,
    );
  }

  /** Gift lsp group inventory items. */
  public postGiftLspGroup$(
    lspGroup: LspGroup,
    gift: SteelheadGift,
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

  /** Gets player Ugc items by XUID. */
  public getPlayerUgcByXuid$(xuid: BigNumber, contentType: UgcType): Observable<PlayerUgcItem[]> {
    const httpParams = new HttpParams().append('ugcType', contentType.toString());

    return this.apiService.getRequest$<PlayerUgcItem[]>(
      `${this.basePath}/storefront/xuid(${xuid})`,
      httpParams,
    );
  }

  /** Gets player Ugc items by share code. */
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

  /** Gets Racer's Cup Schedule by xuid. */
  public getRacersCupScheduleForUser$(
    xuid: BigNumber,
    startTime?: DateTime,
    daysForward?: number,
  ): Observable<RacersCupSchedule> {
    let httpParams = new HttpParams();

    if (startTime) {
      httpParams = httpParams.append('startTime', startTime.toISO());
    }

    if (daysForward) {
      httpParams = httpParams.append('daysForward', daysForward.toString());
    }

    return this.apiService.getRequest$<RacersCupSchedule>(
      `${this.basePath}/player/${xuid}/RacerCupSchedule`,
      httpParams,
    );
  }

  /** Gets Racer's Cup Schedule by Pegasus values. */
  public getRacersCupScheduleByPegasusPath$(
    info: PegasusPathInfo,
    startTime?: DateTime,
    daysForward?: number,
  ): Observable<RacersCupSchedule> {
    let httpParams = new HttpParams();

    if (info?.environment) {
      httpParams = httpParams.append('pegasusEnvironment', info.environment);
    }

    if (info?.slot) {
      httpParams = httpParams.append('pegasusSlot', info.slot);
    }

    if (info?.snapshot) {
      httpParams = httpParams.append('pegasusSnapshot', info.snapshot);
    }

    if (startTime) {
      httpParams = httpParams.append('startTime', startTime.toISO());
    }

    if (daysForward) {
      httpParams = httpParams.append('daysForward', daysForward.toString());
    }

    return this.apiService.getRequest$<RacersCupSchedule>(
      `${this.basePath}/RacerCupSchedule`,
      httpParams,
    );
  }
}
