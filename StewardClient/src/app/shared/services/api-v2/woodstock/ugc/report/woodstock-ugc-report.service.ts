import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UgcReportReason } from '@models/ugc-report-reason';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

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

  /** Report a Ugc. */
  public reportUgc$(ugcId: string, reasonId: string): Observable<void> {
    const params = new HttpParams().set('reasonId', reasonId);

    return this.api.postRequest$<void>(`${this.basePath}/${ugcId}/report`, undefined, params);
  }
}
