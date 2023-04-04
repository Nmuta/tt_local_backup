import { Injectable } from '@angular/core';
import { SteelheadLoyaltyRewardsTitle } from '@models/loyalty-rewards';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

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
  ): Observable<Record<SteelheadLoyaltyRewardsTitle, boolean>> {
    return this.api.postRequest$<Record<SteelheadLoyaltyRewardsTitle, boolean>>(
      `${this.basePath}/${xuid}/loyalty`,
      titles,
    );
  }
}
