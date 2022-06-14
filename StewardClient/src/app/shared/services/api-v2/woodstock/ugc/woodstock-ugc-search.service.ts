import { Injectable } from '@angular/core';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcSearchFilters } from '@models/ugc-filters';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/woodstock/ugc/search endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockUgcSearchService {
  private basePath: string = 'title/woodstock/ugc/search';
  constructor(private readonly api: ApiV2Service) {}

  /** Search UGC. */
  public SearchUgc$(parameters: UgcSearchFilters): Observable<PlayerUgcItem[]> {
    return this.api.postRequest$<PlayerUgcItem[]>(
      `${this.basePath}/${parameters.ugcType}`,
      parameters,
      undefined,
    );
  }
}
