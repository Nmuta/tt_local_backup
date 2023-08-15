import { Injectable } from '@angular/core';
import { BanDuration } from '@models/ban-duration';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/player/{xuid}/ban endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadPlayerBanService {
  public readonly basePath: string = 'title/steelhead/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Get Next Ban Period . */
  public getNextBanDuration$(xuid: BigNumber, configurationId: string): Observable<BanDuration> {
    return this.api.getRequest$<BanDuration>(
      `${this.basePath}/${xuid}/ban/nextDuration/${configurationId}`,
    );
  }
}
