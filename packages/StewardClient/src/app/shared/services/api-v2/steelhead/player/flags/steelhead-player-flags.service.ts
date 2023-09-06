import { Injectable } from '@angular/core';
import { SteelheadUserFlags, SteelheadUserFlagsInput } from '@models/steelhead';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/player/{xuid}/flags endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadPlayerFlagsService {
  public readonly basePath: string = 'title/steelhead/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets user flags by a XUID. */
  public getFlagsByXuid$(xuid: BigNumber): Observable<SteelheadUserFlags> {
    return this.api.getRequest$<SteelheadUserFlags>(`${this.basePath}/${xuid}/flags`);
  }

  /** Sets user flags by a XUID. */
  public putFlagsByXuid$(
    xuid: BigNumber,
    flags: SteelheadUserFlagsInput,
  ): Observable<SteelheadUserFlags> {
    return this.api.putRequest$<SteelheadUserFlags>(`${this.basePath}/${xuid}/flags`, flags);
  }
}
