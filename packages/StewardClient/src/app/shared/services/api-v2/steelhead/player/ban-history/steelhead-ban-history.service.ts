import { Injectable } from '@angular/core';
import { SteelheadBanHistoryEntry } from '@models/steelhead';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/player/{xuid}/banHistory endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadBanHistoryService {
  public readonly basePath: string = 'title/steelhead/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets ban history by a XUID. */
  public getBanHistoryByXuid$(xuid: BigNumber): Observable<SteelheadBanHistoryEntry[]> {
    return this.api.getRequest$<SteelheadBanHistoryEntry[]>(`${this.basePath}/${xuid}/banHistory`);
  }
}
