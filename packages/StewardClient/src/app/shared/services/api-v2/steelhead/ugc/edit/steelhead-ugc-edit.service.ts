import { Injectable } from '@angular/core';
import { UgcEditInput } from '@models/ugc-edit-input';
import { UgcEditStatsInput } from '@models/ugc-edit-stats-input';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/steelhead/ugc/{ugcId}/edit endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadUgcEditService {
  private basePath: string = 'title/steelhead/ugc';
  constructor(private readonly api: ApiV2Service) {}

  /** Edit a Ugc. */
  public editUgc$(ugcId: string, ugcEditInput: UgcEditInput): Observable<void> {
    return this.api.postRequest$<void>(`${this.basePath}/${ugcId}/edit`, ugcEditInput);
  }

  /** Edit a Ugc stats. */
  public editUgcStats$(ugcId: string, ugcEditStatsInput: UgcEditStatsInput): Observable<void> {
    return this.api.postRequest$<void>(`${this.basePath}/${ugcId}/edit/stats`, ugcEditStatsInput);
  }
}
