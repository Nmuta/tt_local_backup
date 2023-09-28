import { Injectable } from '@angular/core';
import { addEnvironmentAndSlotHttpParams } from '@helpers/query-param-helpers';
import { GuidLikeString } from '@models/extended-types';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/cars endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadCarsService {
  public readonly basePath: string = 'title/steelhead/cars';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets the Cars Manufacturers. */
  public getCarManufacturers$(
    environment: string = null,
    slot: string = null,
  ): Observable<Map<GuidLikeString, string>> {
    const params = addEnvironmentAndSlotHttpParams(environment, slot);
    return this.api.getRequest$<Map<GuidLikeString, string>>(
      `${this.basePath}/manufacturers`,
      params,
    );
  }

  /** Gets the Cars reference. */
  public getCarsReference$(
    environment: string = null,
    slot: string = null,
  ): Observable<Map<GuidLikeString, string>> {
    const params = addEnvironmentAndSlotHttpParams(environment, slot);
    return this.api.getRequest$<Map<GuidLikeString, string>>(`${this.basePath}/reference`, params);
  }
}
