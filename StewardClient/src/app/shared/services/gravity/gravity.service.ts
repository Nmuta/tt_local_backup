import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MSError } from '@models/error.model';
import {
  GravityGameSettings,
  GravityGiftHistory,
  GravityPlayerDetails,
  GravityPlayerInventory,
} from '@models/gravity';
import {
  IdentityQueryBeta,
  IdentityQueryBetaBatch,
  IdentityResultBeta,
  IdentityResultBetaBatch,
  isGamertagQuery,
  isT10IdQuery,
  isXuidQuery,
} from '@models/identity-query.model';
import { ApiService } from '@services/api';
import { GiftHistoryAntecedent } from '@shared/constants';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/** Defines the gravity service. */
@Injectable({
  providedIn: 'root',
})
export class GravityService {
  public basePath: string = 'v1/title/gravity';

  constructor(private readonly apiService: ApiService) {}

  /** Gets a single identity within this service. */
  public getIdentity(identityQuery: IdentityQueryBeta): Observable<IdentityResultBeta> {
    return this.getIdentitySingle(identityQuery);
  }

  /** Gets identities within this service. */
  public getIdentities(
    identityQueries: IdentityQueryBetaBatch,
  ): Observable<IdentityResultBetaBatch> {
    return forkJoin([...identityQueries.map(q => this.getIdentitySingle(q))]);
  }

  /** Gets gravity player details with a gamertag. */
  public getPlayerDetailsByGamertag(gamertag: string): Observable<GravityPlayerDetails> {
    return this.apiService
      .getRequest<GravityPlayerDetails>(`${this.basePath}/player/gamertag(${gamertag})/details`)
      .pipe(
        map(details => {
          details.firstLoginUtc = !!details.firstLoginUtc ? new Date(details.firstLoginUtc) : null;
          details.lastLoginUtc = !!details.lastLoginUtc ? new Date(details.lastLoginUtc) : null;
          return details;
        }),
      );
  }

  /** Gets gravity player details with a XUID. */
  public getPlayerDetailsByXuid(xuid: string): Observable<GravityPlayerDetails> {
    return this.apiService
      .getRequest<GravityPlayerDetails>(`${this.basePath}/player/xuid(${xuid})/details`)
      .pipe(
        map(details => {
          details.firstLoginUtc = !!details.firstLoginUtc ? new Date(details.firstLoginUtc) : null;
          details.lastLoginUtc = !!details.lastLoginUtc ? new Date(details.lastLoginUtc) : null;
          return details;
        }),
      );
  }

  /** Gets gravity player details with a T10 ID. */
  public getPlayerDetailsByT10Id(t10Id: string): Observable<GravityPlayerDetails> {
    return this.apiService
      .getRequest<GravityPlayerDetails>(`${this.basePath}/player/t10Id(${t10Id})/details`)
      .pipe(
        map(details => {
          details.firstLoginUtc = !!details.firstLoginUtc ? new Date(details.firstLoginUtc) : null;
          details.lastLoginUtc = !!details.lastLoginUtc ? new Date(details.lastLoginUtc) : null;
          return details;
        }),
      );
  }

  /** Gets gravity player inventory with a XUID. */
  public getPlayerInventoryByXuid(xuid: string): Observable<GravityPlayerInventory> {
    return this.apiService.getRequest<GravityPlayerInventory>(
      `${this.basePath}/player/inventory/xuid(${xuid})`,
    );
  }

  /** Gets gravity player inventory with a T10 ID. */
  public getPlayerInventoryByT10Id(t10Id: string): Observable<GravityPlayerInventory> {
    return this.apiService.getRequest<GravityPlayerInventory>(
      `${this.basePath}/player/inventory/t10Id(${t10Id})`,
    );
  }

  /** Gets gravity player inventory with a profile ID. */
  public getPlayerInventoryByProfileIdWithXuid(
    xuid: string,
    profileId: string,
  ): Observable<GravityPlayerInventory> {
    return this.apiService.getRequest<GravityPlayerInventory>(
      `${this.basePath}/player/inventory/xuid(${xuid})/profileId(${profileId})`,
    );
  }

  /** Gets gravity player inventory with a profile ID. */
  public getPlayerInventoryByProfileIdWithT10Id(
    t10Id: string,
    profileId: string,
  ): Observable<GravityPlayerInventory> {
    return this.apiService.getRequest<GravityPlayerInventory>(
      `${this.basePath}/player/inventory/t10Id(${t10Id})/profileId(${profileId})`,
    );
  }

  /** Updates gravity player inventory with a XUID. */
  public updatePlayerInventoryByXuid(
    inventory: GravityPlayerInventory,
    useBackgroundProcessing: boolean = false,
  ): Observable<GravityPlayerInventory> {
    if (!inventory.xuid) {
      return throwError('No XUID provided.');
    }

    const params = new HttpParams().append(
      'useBackgroundProcessing',
      useBackgroundProcessing.toString(),
    );

    return this.apiService.postRequest<GravityPlayerInventory>(
      `${this.basePath}/player/inventory/xuid`,
      inventory,
      params,
    );
  }

  /** Updates gravity player inventory with a T10 Id. */
  public updatePlayerInventoryByT10Id(
    inventory: GravityPlayerInventory,
    useBackgroundProcessing: boolean = false,
  ): Observable<GravityPlayerInventory> {
    if (!inventory.turn10Id || inventory.turn10Id === '') {
      return throwError('No T10 Id provided.');
    }

    const params = new HttpParams().append(
      'useBackgroundProcessing',
      useBackgroundProcessing.toString(),
    );

    return this.apiService.postRequest<GravityPlayerInventory>(
      `${this.basePath}/player/inventory/t10Id`,
      inventory,
      params,
    );
  }

  /** Gets gravity game settings. */
  public getGameSettings(gameSettingsId: string): Observable<GravityGameSettings> {
    return this.apiService.getRequest<GravityGameSettings>(
      `${this.basePath}/data/gameSettingsId(${gameSettingsId})`,
    );
  }

  /** Gets gravity gift histories. */
  public getGiftHistories(
    giftHistoryAntecedent: GiftHistoryAntecedent,
    giftRecipientId: string,
  ): Observable<GravityGiftHistory> {
    return this.apiService.getRequest<GravityGiftHistory>(
      `${this.basePath}/giftHistory/giftRecipientId/(${giftRecipientId})/giftHistoryAntecedent/(${giftHistoryAntecedent})`,
    );
  }

  private getIdentitySingle(query: IdentityQueryBeta): Observable<IdentityResultBeta> {
    return this.getIdentityHelper(query).pipe(
      map(
        v =>
          <IdentityResultBeta>{
            query: query,
            gamertag: v.gamertag,
            xuid: v.xuid,
            t10id: v.turn10Id,
          },
        catchError((e: string) =>
          of(<IdentityResultBeta>{ query: query, error: ({ details: e } as unknown) as MSError }),
        ),
      ),
    );
  }

  private getIdentityHelper(query: IdentityQueryBeta): Observable<GravityPlayerDetails> {
    if (isGamertagQuery(query)) {
      return this.apiService.getRequest<GravityPlayerDetails>(
        `${this.basePath}/player/gamertag(${query.gamertag})/details`,
      );
    } else if (isXuidQuery(query)) {
      return this.apiService.getRequest<GravityPlayerDetails>(
        `${this.basePath}/player/xuid(${query.xuid})/details`,
      );
    } else if (isT10IdQuery(query)) {
      return this.apiService.getRequest<GravityPlayerDetails>(
        `${this.basePath}/player/t10id(${query.t10id})/details`,
      );
    } else {
      return throwError(`query not recognized ${JSON.stringify(query)}`);
    }
  }
}
