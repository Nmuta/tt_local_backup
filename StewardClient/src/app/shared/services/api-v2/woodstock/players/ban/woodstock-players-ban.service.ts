import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackgroundJob } from '@models/background-job';
import { BanConfiguration } from '@models/ban-configuration';
import { WoodstockBanRequest, WoodstockBanResult } from '@models/woodstock';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/woodstock/players/ban endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockPlayersBanService {
  public readonly basePath: string = 'title/woodstock/players/ban';
  constructor(private readonly api: ApiV2Service) {}

  /** Get Ban Configuration. */
  public getBanConfigurations$(): Observable<BanConfiguration[]> {
    return this.api.getRequest$<BanConfiguration[]>(`${this.basePath}/banConfigurations`);
  }

  /** Bans players by a list of XUIDs. */
  public postBanPlayers$(bans: WoodstockBanRequest[]): Observable<WoodstockBanResult[]> {
    const params = new HttpParams().set('useBackgroundProcessing', false);

    return this.api.postRequest$<WoodstockBanResult[]>(`${this.basePath}`, bans, params);
  }

  /** Bans players by a list of XUIDs using background processing. */
  public postBanPlayersWithBackgroundProcessing$(
    bans: WoodstockBanRequest[],
  ): Observable<BackgroundJob<void>> {
    const params = new HttpParams().set('useBackgroundProcessing', true);

    return this.api.postRequest$<BackgroundJob<void>>(`${this.basePath}`, bans, params);
  }
}
