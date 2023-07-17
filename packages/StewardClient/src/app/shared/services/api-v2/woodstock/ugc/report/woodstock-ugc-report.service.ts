import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackgroundJob } from '@models/background-job';
import { UgcReportReason } from '@models/ugc-report-reason';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/**
 * Interface to describe a response from the API for reporting multiple
 * UGC in bulk.
 */
export interface BulkReportUgcResponse {
  ugcId: string;
  error: string;
}

/** The /v2/woodstock/report endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockUgcReportService {
  private basePath: string = 'title/woodstock/ugc';
  constructor(private readonly api: ApiV2Service) {}

  /** Get Ugc report reasons. */
  public getUgcReportReasons$(): Observable<UgcReportReason[]> {
    return this.api.getRequest$<UgcReportReason[]>(`${this.basePath}/reportReasons`);
  }

  /** Report Ugc items using background processing. */
  public reportUgcItemsUsingBackgroundJob$(
    ugcIds: string[],
    reasonId: string,
  ): Observable<BackgroundJob<void>> {
    const params = new HttpParams().set('useBackgroundProcessing', true).set('reasonId', reasonId);
    return this.api.postRequest$<BackgroundJob<void>>(`${this.basePath}/report`, ugcIds, params);
  }

  /** Report a Ugc. */
  public reportUgc$(ugcIds: string[], reasonId: string): Observable<BulkReportUgcResponse[]> {
    const params = new HttpParams().set('useBackgroundProcessing', false).set('reasonId', reasonId);
    return this.api.postRequest$<BulkReportUgcResponse[]>(
      `${this.basePath}/report`,
      ugcIds,
      params,
    );
  }
}
