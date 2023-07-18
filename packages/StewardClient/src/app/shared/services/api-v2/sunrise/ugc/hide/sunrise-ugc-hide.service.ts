import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackgroundJob } from '@models/background-job';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/sunrise/ugc/hide endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SunriseUgcHideService {
  private basePath: string = 'title/sunrise/ugc/hide';
  constructor(private readonly api: ApiV2Service) {}

  /** Hide Ugc items using background processing. */
  public hideUgcItemsUsingBackgroundJob$(ugcIds: string[]): Observable<BackgroundJob<void>> {
    const params = new HttpParams().set('useBackgroundProcessing', true);
    return this.api.postRequest$<BackgroundJob<void>>(`${this.basePath}`, ugcIds, params);
  }

  /** Hide Ugc items. */
  public hideUgcItems$(ugcIds: string[]): Observable<void> {
    const params = new HttpParams().set('useBackgroundProcessing', false);
    return this.api.postRequest$<void>(`${this.basePath}`, ugcIds, params);
  }
}
