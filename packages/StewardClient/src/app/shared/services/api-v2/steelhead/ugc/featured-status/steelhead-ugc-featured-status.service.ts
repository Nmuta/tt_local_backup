import { Injectable } from '@angular/core';
import { UgcFeaturedStatus } from '@models/ugc-featured-status';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/steelhead/ugc/{id}/featuredStatus endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadUgcFeaturedStatusService {
  private basePath: string = 'title/steelhead/ugc';
  constructor(private readonly api: ApiV2Service) {}

  /** Set feature status for a Ugc item. */
  public reportUgc$(ugcId: string, status: UgcFeaturedStatus): Observable<void> {
    return this.api.postRequest$<void>(`${this.basePath}/${ugcId}/featuredStatus`, status);
  }
}
