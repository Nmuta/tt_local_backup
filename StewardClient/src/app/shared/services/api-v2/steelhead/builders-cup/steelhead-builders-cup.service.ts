import { Injectable } from '@angular/core';
import { SimpleCar } from '@models/cars';
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
  openTimeUtc: DateTime;
  closeTimeUtc: DateTime;
  allowedCars: SimpleCar[];
  allowedCarClass: BuildersCupCarRestriction;
}

/** Interface that represents Builder's Cup featured Tours. */
export interface BuildersCupFeaturedTour {
  name: string;
  description: string;
  isDisabled: boolean;
  openTimeUtc: DateTime;
  closeTimeUtc: DateTime;
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
  public getBuildersCupSchedule$(): Observable<BuildersCupFeaturedTour[]> {
    return this.api.getRequest$<BuildersCupFeaturedTour[]>(`${this.basePath}/schedule`);
  }
}
