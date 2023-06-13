import { Injectable } from '@angular/core';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

export interface GenerateSharecodeResponse {
  sharecode: string;
}

/** The /v2/woodstock/ugc/{ugcId}/sharecode endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockUgcSharecodeService {
  private basePath: string = 'title/woodstock/ugc';
  constructor(private readonly api: ApiV2Service) {}

  /** Generate sharecode for UGC. */
  public ugcGenerateSharecode$(ugcId: string): Observable<GenerateSharecodeResponse> {
    return this.api.postRequest$<GenerateSharecodeResponse>(
      `${this.basePath}/${ugcId}/sharecode`,
      undefined,
    );
  }
}