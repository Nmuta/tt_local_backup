import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GravityGiftHistories, GravityPlayerDetails, GravityPlayerInventory } from '@models/gravity';
import { GravityMasterInventory } from '@models/gravity/gravity-master-inventory.model';
import {
  IdentityQueryBeta,
  IdentityQueryBetaBatch,
  IdentityResultBeta,
  IdentityResultBetaBatch,
} from '@models/identity-query.model';
import { ApiService } from '@services/api';
import { GiftHistoryAntecedent } from '@shared/constants';
import { Observable, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

/** Defines the gravity service. */
@Injectable({
  providedIn: 'root',
})
export class GravityService {
  public basePath: string = 'v1/title/gravity';

  constructor(private readonly apiService: ApiService) {}

  /** Gets a single identity within this service. */
  public getPlayerIdentity(identityQuery: IdentityQueryBeta): Observable<IdentityResultBeta> {
    const queryBatch: IdentityQueryBetaBatch = [identityQuery];
    return this.getPlayerIdentities(queryBatch).pipe(
      switchMap((data: IdentityResultBetaBatch) => {
        const result = data[0];
        return of(result);
      }),
    );
  }

  /** Gets identities within this service. */
  public getPlayerIdentities(
    identityQueries: IdentityQueryBetaBatch,
  ): Observable<IdentityResultBetaBatch> {
    return this.apiService.postRequest<IdentityResultBetaBatch>(
      `${this.basePath}/players/identities`,
      identityQueries,
    );
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
    if (!inventory.t10Id || inventory.t10Id === '') {
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
  public getGameSettings(gameSettingsId: string): Observable<GravityMasterInventory> {
    return this.apiService.getRequest<GravityMasterInventory>(
      `${this.basePath}/data/gameSettingsId(${gameSettingsId})`,
    );
  }

  /** Gets Gift history by a XUID. */
  public getGiftHistoryByT10Id(t10Id: string): Observable<GravityGiftHistories> {
    return this.apiService
      .getRequest<GravityGiftHistories>(`${this.basePath}/player/t10Id(${t10Id})/giftHistory`)
      .pipe(
        map(giftHistory => {
          // these come in stringly-typed and must be converted
          for (const gift of giftHistory) {
            gift.giftSendDateUtc = new Date(gift.giftSendDateUtc);
          }

          return giftHistory;
        }),
      );
  }
}
