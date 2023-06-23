import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackgroundJob } from '@models/background-job';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

export interface GenerateSharecodeResponse {
  sharecode: string;
}

export interface BulkGenerateSharecodeResponse extends GenerateSharecodeResponse {
  ugcId: string;
  error: string;
}

/** The /v2/woodstock/ugc/{ugcId}/sharecode endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockUgcSharecodeService {
  private basePath: string = 'title/woodstock/ugc';
  constructor(private readonly api: ApiV2Service) {}

  /** Generate sharecode for UGC. */
  public ugcGenerateSharecode$(ugcIds: string[]): Observable<BulkGenerateSharecodeResponse[]> {
    const params = new HttpParams().set('useBackgroundProcessing', false);
    return this.api.postRequest$<BulkGenerateSharecodeResponse[]>(`${this.basePath}/sharecode`, ugcIds, params);
  }

  /** Bulk generate sharecodes for UGC. */
  public ugcGenerateSharecodesUsingBackgroundJob$(ugcIds: string[]): Observable<BackgroundJob<void>> {
    const params = new HttpParams().set('useBackgroundProcessing', true);
    return this.api.postRequest$<BackgroundJob<void>>(`${this.basePath}/sharecode`, ugcIds, params);
  }
}
