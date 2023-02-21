import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PullRequest, PullRequestStatus, PullRequestSubject } from '@models/git-operation';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/gitops endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadGitOperationService {
  public readonly basePath: string = 'title/steelhead/gitops';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets all active pull request based on a subject. */
  public getActivePullRequests$(subject: PullRequestSubject): Observable<PullRequest[]> {
    let httpParams = new HttpParams();

    httpParams = httpParams.append('subject', subject);

    return this.api.getRequest$<PullRequest[]>(
      `${this.basePath}/pullrequest/${PullRequestStatus.Active}`,
      httpParams,
    );
  }

  /** Abandon a pull request. */
  public abandonPullRequest$(pullRequestId: number): Observable<void> {
    return this.api.getRequest$<void>(`${this.basePath}/pullrequest/abandon/${pullRequestId}`);
  }
}
