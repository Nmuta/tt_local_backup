import { Injectable } from '@angular/core';
import { addEnvironmentAndSlotHttpParams } from '@helpers/query-param-helpers';
import { GuidLikeString } from '@models/extended-types';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/store endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadStoreService {
  public readonly basePath: string = 'title/steelhead/store';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets the Store Entitlements. */
  public getStoreEntitlements$(
    environment: string = null,
    slot: string = null,
  ): Observable<Map<GuidLikeString, string>> {
    const params = addEnvironmentAndSlotHttpParams(environment, slot);
    return this.api.getRequest$<Map<GuidLikeString, string>>(
      `${this.basePath}/entitlements`,
      params,
    );
  }
}
