import { Injectable } from '@angular/core';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/steelhead/report endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadUgcReportService {
  private basePath: string = 'title/steelhead/ugc';
  constructor(private readonly api: ApiV2Service) {}

  /** Report a Ugc. */
  public reportUgc$(ugcId: string): Observable<void> {
    return this.api.postRequest$<void>(`${this.basePath}/${ugcId}/report`, undefined);
  }
}
