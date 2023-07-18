import { Injectable } from '@angular/core';
import { BackgroundJob } from '@models/background-job';
import { SteelheadBanRequest, SteelheadBanResult, SteelheadBanSummary } from '@models/steelhead';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/players endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadPlayersService {
  public readonly basePath: string = 'title/steelhead/players';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets ban summaries by a list of XUIDs. */
  public getBanSummariesByXuids$(xuids: BigNumber[]): Observable<SteelheadBanSummary[]> {
    return this.api.postRequest$<SteelheadBanSummary[]>(`${this.basePath}/banSummaries`, xuids);
  }

  /** Bans players by a list of XUIDs. */
  public postBanPlayers$(bans: SteelheadBanRequest[]): Observable<SteelheadBanResult[]> {
    return this.api.postRequest$<SteelheadBanResult[]>(`${this.basePath}/ban`, bans);
  }

  /** Bans players by a list of XUIDs using background processing. */
  public postBanPlayersWithBackgroundProcessing$(
    bans: SteelheadBanRequest[],
  ): Observable<BackgroundJob<void>> {
    return this.api.postRequest$<BackgroundJob<void>>(
      `${this.basePath}/ban/useBackgroundProcessing`,
      bans,
    );
  }
}
