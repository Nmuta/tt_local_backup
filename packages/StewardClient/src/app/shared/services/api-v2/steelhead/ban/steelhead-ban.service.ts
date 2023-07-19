import { Injectable } from '@angular/core';
import { UnbanResult } from '@models/unban-result';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/player/{xuid} endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadBanService {
  public readonly basePath: string = 'title/steelhead/ban';
  constructor(private readonly api: ApiV2Service) {}

  /** Expire ban by ban entry ID. */
  public expireBan$(banEntryId: BigNumber): Observable<UnbanResult> {
    return this.api.postRequest$<UnbanResult>(`${this.basePath}/${banEntryId}`, null);
  }

  /** Delete ban by ban entry ID. */
  public deleteBan$(banEntryId: BigNumber): Observable<UnbanResult> {
    return this.api.deleteRequest$<UnbanResult>(`${this.basePath}/${banEntryId}`, null);
  }
}
