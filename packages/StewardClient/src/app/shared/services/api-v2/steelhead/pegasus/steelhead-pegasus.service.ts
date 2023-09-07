import { Injectable } from '@angular/core';
import { FriendlyNameMap } from '@models/message-of-the-day';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/pegasus endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadPegasusService {
  public readonly basePath: string = 'title/steelhead/pegasus';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets Datetime ranges mapped to Guid. */
  public getDatetimeRanges$(): Observable<FriendlyNameMap> {
    return this.api.getRequest$<FriendlyNameMap>(`${this.basePath}/datetimeRanges`);
  }

  /** Gets challenges mapped to Guid. */
  public getChallenges$(): Observable<FriendlyNameMap> {
    return this.api.getRequest$<FriendlyNameMap>(`${this.basePath}/challenges`);
  }
}
