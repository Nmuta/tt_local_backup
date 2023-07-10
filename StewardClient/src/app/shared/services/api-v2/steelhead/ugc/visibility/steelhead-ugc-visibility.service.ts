import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackgroundJob } from '@models/background-job';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/steelhead/ugc/ hide and unhide endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadUgcVisibilityService {
  private basePath: string = 'title/steelhead/ugc';
  constructor(private readonly api: ApiV2Service) {}

  /** Hide Ugc items using background processing. */
  public hideUgcItemsUsingBackgroundJob$(ugcIds: string[]): Observable<BackgroundJob<void>> {
    const params = new HttpParams().set('useBackgroundProcessing', true);
    return this.api.postRequest$<BackgroundJob<void>>(`${this.basePath}/hide`, ugcIds, params);
  }

  /** Hide Ugc items. */
  public hideUgcItems$(ugcIds: string[]): Observable<string[]> {
    const params = new HttpParams().set('useBackgroundProcessing', false);
    return this.api.postRequest$<string[]>(`${this.basePath}/hide`, ugcIds, params);
  }

  /** Unhide Ugc items using background processing. */
  public unhideUgcItemsUsingBackgroundJob$(ugcIds: string[]): Observable<BackgroundJob<void>> {
    const params = new HttpParams().set('useBackgroundProcessing', true);
    return this.api.postRequest$<BackgroundJob<void>>(`${this.basePath}/unhide`, ugcIds, params);
  }

  /** Unhide Ugc item. */
  public unhideUgcItems$(ugcIds: string[]): Observable<string[]> {
    const params = new HttpParams().set('useBackgroundProcessing', false);
    return this.api.postRequest$<string[]>(`${this.basePath}/unhide`, ugcIds, params);
  }
}
