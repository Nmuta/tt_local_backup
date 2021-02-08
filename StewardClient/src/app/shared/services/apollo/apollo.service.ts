import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ApolloBanResult,
  ApolloGift,
  ApolloGroupGift,
  ApolloMasterInventory,
  ApolloPlayerDetails,
  ApolloPlayerInventory,
} from '@models/apollo';
import { ApolloBanRequest } from '@models/apollo/apollo-ban-request.model';
import { ApolloBanSummary } from '@models/apollo/apollo-ban-summary.model';
import { ApolloGiftHistory } from '@models/apollo/apollo-gift-history.model';
import { BackgroundJob } from '@models/background-job';
import { GiftResponse, GiftResponses } from '@models/gift-response';
import {
  IdentityQueryAlpha,
  IdentityQueryAlphaBatch,
  IdentityResultAlpha,
  IdentityResultAlphaBatch,
} from '@models/identity-query.model';
import { LspGroup, LspGroups } from '@models/lsp-group';
import { ApiService } from '@services/api';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

/** Handles calls to Sunrise API routes. */
@Injectable({
  providedIn: 'root',
})
export class ApolloService {
  public basePath: string = 'v1/title/apollo';

  constructor(private readonly apiService: ApiService) {}

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

  /** Gets ban summaries by a list of XUIDs. */
  public getBanSummariesByXuids(xuids: BigInt[]): Observable<ApolloBanSummary[]> {
    return this.apiService.postRequest<ApolloBanSummary[]>(
      `${this.basePath}/players/banSummaries`,
      xuids,
    );
  }

  /** Bans players by a list of XUIDs. */
  public postBanPlayers(bans: ApolloBanRequest[]): Observable<ApolloBanResult[]> {
    return this.apiService.postRequest<ApolloBanResult[]>(`${this.basePath}/players/ban`, bans);
  }

  /** Gets apollo player details with a gamertag. This can be used to retrieve a XUID. */
  public getPlayerDetailsByGamertag(gamertag: string): Observable<ApolloPlayerDetails> {
    return this.apiService
      .getRequest<ApolloPlayerDetails>(`${this.basePath}/player/gamertag(${gamertag})/details`)
      .pipe(
        map(details => {
          details.firstLoginUtc = !!details.firstLoginUtc ? new Date(details.firstLoginUtc) : null;
          details.lastLoginUtc = !!details.lastLoginUtc ? new Date(details.lastLoginUtc) : null;
          return details;
        }),
      );
  }

  /** Gets Gift history by a XUID. */
  public getGiftHistoryByXuid(xuid: BigInt): Observable<ApolloGiftHistory[]> {
    return this.apiService.getRequest<ApolloGiftHistory[]>(
      `${this.basePath}/player/xuid(${xuid})/giftHistory`,
    );
  }

  /** Gets Gift history by a LSP Group. */
  public getGiftHistoryByLspGroup(lspGroupId: BigInt): Observable<ApolloGiftHistory[]> {
    return this.apiService.getRequest<ApolloGiftHistory[]>(
      `${this.basePath}/group/groupId(${lspGroupId})/giftHistory`,
    );
  }

  /** Gets the apollo lsp groups. */
  public getLspGroups(): Observable<LspGroups> {
    return this.apiService.getRequest<LspGroups>(`${this.basePath}/groups`);
  }

  /** Gets the apollo master inventory. */
  public getMasterInventory(): Observable<ApolloMasterInventory> {
    return this.apiService.getRequest<ApolloMasterInventory>(`${this.basePath}/masterInventory`);
  }

  /** Gets the apollo player's inventory. */
  public getPlayerInventoryByXuid(xuid: bigint): Observable<ApolloPlayerInventory> {
    return this.apiService.getRequest<ApolloPlayerInventory>(
      `${this.basePath}/player/xuid(${xuid})/inventory`,
    );
  }

  /** Gift players inventory items. */
  public postGiftPlayers(gift: ApolloGroupGift): Observable<GiftResponses<bigint>> {
    return this.apiService.postRequest<GiftResponses<bigint>>(
      `${this.basePath}/gifting/players`,
      gift,
    );
  }

  /** Gift players inventory items using a background task. */
  public postGiftPlayersUsingBackgroundTask(gift: ApolloGroupGift): Observable<BackgroundJob<void>> {
    const params = new HttpParams().set('useBackgroundProcessing', 'true');
    return this.apiService.postRequest<BackgroundJob<void>>(`${this.basePath}/gifting/players`, gift, params);
  }

  /** Gift lsp group inventory items. */
  public postGiftLspGroup(lspGroup: LspGroup, gift: ApolloGift): Observable<GiftResponse<string>> {
    return this.apiService.postRequest<GiftResponse<string>>(
      `${this.basePath}/gifting/groupId(${lspGroup.id})`,
      gift,
    );
  }
}
