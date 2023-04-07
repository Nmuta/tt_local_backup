import { Injectable } from '@angular/core';
import { PlayerCmsOverride } from '@models/player-cms-override.model';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/woodstock/player/{xuid}/cmsOverride endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockPlayerCmsOverrideService {
  public readonly basePath: string = 'title/woodstock/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets player CMS override. */
  public getCmsOverrideByXuid$(xuid: BigNumber): Observable<PlayerCmsOverride> {
    return this.api.getRequest$<PlayerCmsOverride>(`${this.basePath}/${xuid}/cmsOverride`);
  }

  /** Sets player CMS override. */
  public setCmsOverrideByXuid$(xuid: BigNumber, cmsOverride: PlayerCmsOverride): Observable<void> {
    return this.api.postRequest$<void>(`${this.basePath}/${xuid}/cmsOverride`, cmsOverride);
  }

  /** Deletes player CMS override. */
  public deleteCmsOverrideByXuid$(xuid: BigNumber): Observable<void> {
    return this.api.deleteRequest$<void>(`${this.basePath}/${xuid}/cmsOverride`);
  }
}
