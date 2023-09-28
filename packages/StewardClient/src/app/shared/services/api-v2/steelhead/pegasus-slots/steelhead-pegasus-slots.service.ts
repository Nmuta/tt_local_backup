import { Injectable } from '@angular/core';
import { addEnvironmentAndSlotHttpParams } from '@helpers/query-param-helpers';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/pegasus/slots endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadPegasusSlotsService {
  public readonly basePath: string = 'title/steelhead/pegasus/slots';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets Datetime ranges mapped to Guid. */
  public getPegasusSlots$(environment: string = null): Observable<string[]> {
    const params = addEnvironmentAndSlotHttpParams(environment, null);
    return this.api.getRequest$<string[]>(`${this.basePath}`, params);
  }
}
