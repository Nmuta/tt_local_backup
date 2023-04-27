import { Injectable } from '@angular/core';
import { FriendlyNameMap } from '@models/message-of-the-day';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/welcomecenter/worldofforza endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadWorldOfForzaService {
  public readonly basePath: string = 'title/steelhead/welcomecenter/worldofforza';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets Image Text Tile Friendly Name list mapped to Guid. */
  public getDisplayConditions$(): Observable<FriendlyNameMap> {
    return this.api.getRequest$<FriendlyNameMap>(`${this.basePath}/displayconditions`);
  }
}
