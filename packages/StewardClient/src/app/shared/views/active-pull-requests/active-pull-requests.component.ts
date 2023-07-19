import { Component, Input, OnInit, OnChanges, QueryList, ViewChildren } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { MatCheckbox } from '@angular/material/checkbox';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { PullRequest } from '@models/git-operation';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { Observable, takeUntil } from 'rxjs';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { BetterSimpleChanges } from '@helpers/simple-changes';

/** Service contract for the ActivePullRequestsComponent. */
export interface ActivePullRequestsServiceContract {
  /** Game title the service contract is associated with. */
  gameTitle: GameTitle;
  /** Perm attribute to allow abandoning PRs. */
  abandonPermAttribute: PermAttributeName;
  /** Gets active PRs from ADO to display in a table. */
  getActivePullRequests$(): Observable<PullRequest[]>;
  /** Abandons the provided active PR in ADO. */
  abandonPullRequest$(id: number): Observable<void>;
}

type PullRequestTableData = PullRequest & {
  monitor: ActionMonitor;
};

/** Component to get and set a player's cms override. */
@Component({
  selector: 'active-pull-requests',
  templateUrl: './active-pull-requests.component.html',
  styleUrls: ['./active-pull-requests.component.scss'],
})
export class ActivePullRequestsComponent extends BaseComponent implements OnInit, OnChanges {
  @ViewChildren(MatCheckbox) verifyCheckboxes: QueryList<MatCheckbox>;

  /** The cms override service. */
  @Input() service: ActivePullRequestsServiceContract;
  /** Newly created PR. Will be added to the existing active PR list. */
  @Input() newActivePullRequest: PullRequest;

  public pullRequestUrl: string;
  public existingPullRequestList = new BetterMatTableDataSource<PullRequestTableData>([]);
  public columnsToDisplay = ['title', 'creationDate', 'actions'];

  public getPullRequests = new ActionMonitor('GET Pull Requests');

  /** Gets the service contract game title. */
  public get gameTitle(): GameTitle {
    return this.service.gameTitle;
  }

  /** Gets the perm attribute allowing abandoning of PRs. */
  public get permAttribute(): PermAttributeName {
    return this.service.abandonPermAttribute;
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.getPullRequests = this.getPullRequests.repeat();
    this.service
      .getActivePullRequests$()
      .pipe(this.getPullRequests.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(result => {
        this.existingPullRequestList.data = result.map(pullrequest => {
          return {
            ...pullrequest,
            monitor: new ActionMonitor(`Abandon pull request: ${pullrequest.id}`),
          } as PullRequestTableData;
        });
      });
  }

  /** Lifecycle hook. */
  public ngOnChanges(changes: BetterSimpleChanges<ActivePullRequestsComponent>): void {
    if (!this.service) {
      throw new Error('No service is defined for cms override component.');
    }

    if (!!changes.newActivePullRequest && !!this.newActivePullRequest) {
      this.addNewPrToExistingList(this.newActivePullRequest);
    }
  }

  /** Send a request to github to abandon a Pull Request. */
  public abandonPullRequest(entry: PullRequestTableData): void {
    entry.monitor = entry.monitor.repeat();
    this.service
      .abandonPullRequest$(entry.id)
      .pipe(entry.monitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        const index = this.existingPullRequestList.data.indexOf(entry);
        this.existingPullRequestList.data.splice(index, 1);
        this.existingPullRequestList._updateChangeSubscription();
      });
  }

  private addNewPrToExistingList(pullrequest: PullRequest): void {
    this.existingPullRequestList.data.unshift({
      ...pullrequest,
      monitor: new ActionMonitor(`Abandon pull request: ${pullrequest.id}`),
    } as PullRequestTableData);
    this.existingPullRequestList._updateChangeSubscription();
  }
}
