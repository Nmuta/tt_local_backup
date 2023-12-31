import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackgroundJob } from '@models/background-job';
import { BanConfiguration } from '@models/ban-configuration';
import { BanReasonGroup } from '@models/ban-reason-group';
import { SteelheadBanRequest, SteelheadBanResult } from '@models/steelhead';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/steelhead/players/ban endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadPlayersBanService {
  public readonly basePath: string = 'title/steelhead/players/ban';
  constructor(private readonly api: ApiV2Service) {}

  /** Get Ban Reasons. */
  public getBanReasonGroups$(): Observable<BanReasonGroup[]> {
    return this.api.getRequest$<BanReasonGroup[]>(`${this.basePath}/banReasonGroups`);
  }

  /** Get Ban Configuration. */
  public getBanConfigurations$(): Observable<BanConfiguration[]> {
    return this.api.getRequest$<BanConfiguration[]>(`${this.basePath}/banConfigurations`);
  }

  /** Bans players by a list of XUIDs. */
  public postBanPlayers$(bans: SteelheadBanRequest[]): Observable<SteelheadBanResult[]> {
    const params = new HttpParams().set('useBackgroundProcessing', false);

    return this.api.postRequest$<SteelheadBanResult[]>(`${this.basePath}`, bans, params);
  }

  /** Bans players by a list of XUIDs using background processing. */
  public postBanPlayersWithBackgroundProcessing$(
    bans: SteelheadBanRequest[],
  ): Observable<BackgroundJob<void>> {
    const params = new HttpParams().set('useBackgroundProcessing', true);

    return this.api.postRequest$<BackgroundJob<void>>(`${this.basePath}`, bans, params);
  }
}
