import { Injectable } from '@angular/core';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { BugReport, FeatureRequest } from 'app/sidebars/contact-us/contact-us.component';
import { Observable } from 'rxjs';

/** The /v2/msTeams endpoints. */
@Injectable({
  providedIn: 'root',
})
export class MsTeamsService {
  public readonly basePath: string = 'msTeams';

  constructor(private readonly api: ApiV2Service) {}

  /** Sends bug report to Steward's MS Teams help channel. */
  public sendBugReportMessage$(bugReport: BugReport): Observable<void> {
    return this.api.postRequest$<void>(`${this.basePath}/bugReport`, bugReport);
  }

  /** Sends feature request to Steward's MS Teams help channel. */
  public sendFeatureRequestMessage$(featureRequest: FeatureRequest): Observable<void> {
    return this.api.postRequest$<void>(`${this.basePath}/featureRequest`, featureRequest);
  }
}
