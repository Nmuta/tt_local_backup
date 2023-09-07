import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GuidLikeString } from '@models/extended-types';
import { PegasusPathInfo } from '@models/pegasus-path-info';
import { RacersCupChampionship } from '@models/racers-cup.model';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/racersCup endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadRacersCupService {
  public readonly basePath: string = 'title/steelhead/racersCup';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets Racer's Cup Schedule by Pegasus values. */
  public getRacersCupScheduleByPegasusPath$(
    info: PegasusPathInfo,
    startTime?: DateTime,
    daysForward?: number,
  ): Observable<RacersCupChampionship> {
    let httpParams = new HttpParams();

    if (info?.environment) {
      httpParams = httpParams.append('environment', info.environment);
    }

    if (info?.slot) {
      httpParams = httpParams.append('slot', info.slot);
    }

    if (info?.snapshot) {
      httpParams = httpParams.append('snapshot', info.snapshot);
    }

    if (startTime) {
      httpParams = httpParams.append('startTime', startTime.toISO());
    }

    if (daysForward) {
      httpParams = httpParams.append('daysForward', daysForward.toString());
    }

    return this.api.getRequest$<RacersCupChampionship>(`${this.basePath}/schedule`, httpParams);
  }

  /** Gets Racer's Cup Schedule by xuid. */
  public getRacersCupScheduleForUser$(
    xuid: BigNumber,
    startTime?: DateTime,
    daysForward?: number,
  ): Observable<RacersCupChampionship> {
    let httpParams = new HttpParams();

    if (startTime) {
      httpParams = httpParams.append('startTime', startTime.toISO());
    }

    if (daysForward) {
      httpParams = httpParams.append('daysForward', daysForward.toString());
    }

    return this.api.getRequest$<RacersCupChampionship>(
      `${this.basePath}/player/${xuid}/schedule`,
      httpParams,
    );
  }

  /** Gets the Racer's Cup series. */
  public getRacersCupSeries$(): Observable<Map<GuidLikeString, string>> {
    return this.api.getRequest$<Map<GuidLikeString, string>>(`${this.basePath}/series`);
  }
}
