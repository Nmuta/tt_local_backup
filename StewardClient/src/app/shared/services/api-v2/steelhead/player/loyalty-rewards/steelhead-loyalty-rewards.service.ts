import { Injectable } from '@angular/core';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** Enum that represents loyalty reward titles for Steelhead. */
export enum SteelheadLoyaltyRewardsTitle {
  FH = 'FH',
  FH2 = 'FH2',
  FH3 = 'FH3',
  FH4 = 'FH4',
  FH5 = 'FH5',
  FM2 = 'FM2',
  FM3 = 'FM3',
  FM4 = 'FM4',
  FM5 = 'FM5',
  FM6 = 'FM6',
  FM7 = 'FM7',
  Street = 'Street',
}

/** The /v2/steelhead/buildersCup endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadLoyaltyRewardsService {
  public readonly basePath: string = 'title/steelhead/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Get a player's previously played titles. */
  public getUserLoyalty$(xuid: BigNumber): Observable<SteelheadLoyaltyRewardsTitle[]> {
    return this.api.getRequest$<SteelheadLoyaltyRewardsTitle[]>(`${this.basePath}/${xuid}/loyalty`);
  }

  /** sets a player's previously played titles, granting legacy rewards as well. */
  public postUserLoyalty$(
    xuid: BigNumber,
    titles: SteelheadLoyaltyRewardsTitle[],
  ): Observable<null> {
    return this.api.postRequest$<null>(`${this.basePath}/${xuid}/loyalty`, titles);
  }
}
