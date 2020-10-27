import { Injectable } from '@angular/core';
import { SunrisePlayerDetails, SunriseUserFlags } from '@models/sunrise';
import { SunriseBanHistory } from '@models/sunrise/sunrise-ban-history.model';
import { ApiService } from '@services/api';
import _ from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** Handles calls to Sunrise API routes. */
@Injectable({
  providedIn: 'root'
})
export class SunriseService {
  public basePath: string = 'v2/title/sunrise';

  constructor(private readonly apiService: ApiService) {}

  /** Gets gravity player details with a gamertag. This can be used to retrieve a XUID. */
  public getPlayerDetailsByGamertag(
    gamertag: string
  ): Observable<SunrisePlayerDetails> {
    return this.apiService.getRequest<SunrisePlayerDetails>(
      `${this.basePath}/player/gamertag(${gamertag})/details`
    );
  }

  /** Gets user flags by a XUID. */
  public getFlagsByXuid(
    xuid: number
  ): Observable<SunriseUserFlags> {
    return this.apiService.getRequest<SunriseUserFlags>(
      `${this.basePath}/player/xuid(${xuid})/userFlags`
    );
  }

  /** Gets user flags by a XUID. */
  public putFlagsByXuid(
    xuid: number,
    flags: SunriseUserFlags
  ): Observable<SunriseUserFlags> {
    return this.apiService.putRequest<SunriseUserFlags>(
      `${this.basePath}/player/xuid(${xuid})/userFlags`,
      flags,
    );
  }

  /** Gets user flags by a XUID. */
  public getBanHistoryByXuid(
    xuid: number,
  ): Observable<SunriseBanHistory> {
    return this.apiService.getRequest<SunriseBanHistory>(
      `${this.basePath}/player/xuid(${xuid})/banHistory`
    ).pipe(map(banHistory => {
      // these come in stringly-typed and must be converted

      for (const entry of banHistory.liveOpsBanHistory) {
        entry.startTimeUtc = new Date(entry.startTimeUtc);
        entry.expireTimeUtc = new Date(entry.expireTimeUtc);
      }

      for (const entry of banHistory.servicesBanHistory) {
        entry.startTimeUtc = new Date(entry.startTimeUtc);
        entry.expireTimeUtc = new Date(entry.expireTimeUtc);
      }

      return banHistory;
    }));
  }
}
