import { Injectable } from '@angular/core';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

export interface ProcessedAcLog
{
  result: string;
}

/** The /v2/title/steelhead/acLogReader endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadAcLogReaderService {
  public readonly basePath: string = 'title/steelhead/acLogReader';
  constructor(private readonly api: ApiV2Service) {}

  /** Uploads a file for AC Log Reader to parse. */
  public postAcLogReader$(): Observable<ProcessedAcLog> {
    return this.api.postRequest$<ProcessedAcLog>(`${this.basePath}`, null);
  }
}
