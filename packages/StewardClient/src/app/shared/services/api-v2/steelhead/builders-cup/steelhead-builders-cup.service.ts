import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { addEnvironmentAndSlotHttpParams } from '@helpers/query-param-helpers';
import { SimpleCar } from '@models/cars';
import { GuidLikeString } from '@models/extended-types';
import { PegasusPathInfo } from '@models/pegasus-path-info';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

/** Interface that represents Builder's Cup car restriction. */
export interface BuildersCupCarRestriction {
  name: string;
  carClassName: string;
  carClassId: BigNumber;
}

/** Interface that represents Builder's Cup Championship Series. */
export interface BuildersCupChampionshipSeries {
  name: string;
  description: string;
  openTimeUtc?: DateTime;
  closeTimeUtc?: DateTime;
  allowedCars: SimpleCar[];
  allowedCarClass: BuildersCupCarRestriction;
}

/** Interface that represents Builder's Cup featured Tours. */
export interface BuildersCupFeaturedTour {
  name: string;
  description: string;
  isDisabled: boolean;
  openTimeUtc?: DateTime;
  closeTimeUtc?: DateTime;
  championshipSeries: BuildersCupChampionshipSeries[];
}

/** The /v2/steelhead/buildersCup endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadBuildersCupService {
  private basePath: string = 'title/steelhead/buildersCup';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets the Steelhead Builder's Cup featured content schedule. */
  public getBuildersCupScheduleByPegasus$(
    info: PegasusPathInfo,
  ): Observable<BuildersCupFeaturedTour[]> {
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

    return this.api.getRequest$<BuildersCupFeaturedTour[]>(`${this.basePath}/schedule`, httpParams);
  }

  /** Gets the Steelhead Builder's Cup featured content schedule. */
  public getBuildersCupScheduleByUser$(xuid: BigNumber): Observable<BuildersCupFeaturedTour[]> {
    return this.api.getRequest$<BuildersCupFeaturedTour[]>(
      `${this.basePath}/player/${xuid}/schedule`,
    );
  }

  /** Gets the Steelhead Builder's Cup championships. */
  public getBuildersCupChampionships$(
    environment: string = null,
    slot: string = null,
  ): Observable<Map<GuidLikeString, string>> {
    const params = addEnvironmentAndSlotHttpParams(environment, slot);
    return this.api.getRequest$<Map<GuidLikeString, string>>(
      `${this.basePath}/championships`,
      params,
    );
  }

  /** Gets the Steelhead Builder's Cup ladders. */
  public getBuildersCupLadders$(
    environment: string = null,
    slot: string = null,
  ): Observable<Map<GuidLikeString, string>> {
    const params = addEnvironmentAndSlotHttpParams(environment, slot);
    return this.api.getRequest$<Map<GuidLikeString, string>>(`${this.basePath}/ladders`, params);
  }

  /** Gets the Steelhead Builder's Cup series. */
  public getBuildersCupSeries$(
    environment: string = null,
    slot: string = null,
  ): Observable<Map<string, string>> {
    const params = addEnvironmentAndSlotHttpParams(environment, slot);
    return this.api.getRequest$<Map<string, string>>(`${this.basePath}/series`, params);
  }
}
