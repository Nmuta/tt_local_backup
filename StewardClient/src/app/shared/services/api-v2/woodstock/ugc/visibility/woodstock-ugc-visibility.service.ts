import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackgroundJob } from '@models/background-job';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/woodstock/ugc/visibility endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockUgcVisibilityService {
  private basePath: string = 'title/woodstock/ugc';
  constructor(private readonly api: ApiV2Service) {}

  /** Hide Ugc items using background processing. */
  public hideUgcItemsUsingBackgroundJob$(ugcIds: string[]): Observable<BackgroundJob<void>> {
    const params = new HttpParams().set('useBackgroundProcessing', true);
    return this.api.postRequest$<BackgroundJob<void>>(`${this.basePath}/hide`, ugcIds, params);
  }

  /** Hide Ugc items. */
  public hideUgcItems$(ugcIds: string[]): Observable<void> {
    const params = new HttpParams().set('useBackgroundProcessing', false);
    return this.api.postRequest$<void>(`${this.basePath}/hide`, ugcIds, params);
  }

  /** Unhide Ugc item. */
  public unhideUgc$(ugcId: string): Observable<void> {
    return this.api.postRequest$<void>(`${this.basePath}/${ugcId}/unhide`, null);
  }
}
