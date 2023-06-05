import { Component, Input, OnChanges } from '@angular/core';
import { GameTitle } from '@models/enums';
import { ActivePullRequestsServiceContract } from '../active-pull-requests.component';
import { SteelheadGitOperationService } from '@services/api-v2/steelhead/git-operation/steelhead-git-operation.service';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { PullRequest, PullRequestSubject } from '@models/git-operation';

/**
 *  Steelhead cms override component.
 */
@Component({
  selector: 'steelhead-active-pull-requests',
  templateUrl: './steelhead-active-pull-requests.component.html',
})
export class SteelheadActivePullRequestsComponent implements OnChanges {
  /** Perm attribute to allow abandoning PRs. */
  @Input() abandonPermAttribute: PermAttributeName;

  /** Subject matter to pull active PRs from. */
  @Input() pullRequestSubject: PullRequestSubject;

  /** Newly created PR. Will be added to the existing active PR list. */
  @Input() newActivePullRequest: PullRequest;

  public service: ActivePullRequestsServiceContract;

  constructor(private readonly gitOperationService: SteelheadGitOperationService) {}

  /** Lifecycle hook. */
  public ngOnChanges(): void {
    this.service = {
      gameTitle: GameTitle.FM8,
      abandonPermAttribute: this.abandonPermAttribute,
      getActivePullRequests$: () =>
        this.gitOperationService.getActivePullRequests$(this.pullRequestSubject),
      abandonPullRequest$: (id: number) => this.gitOperationService.abandonPullRequest$(id),
    };
  }
}
