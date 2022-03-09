import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { ignorePaginatorQueryParams } from '@helpers/paginator';
import {
  isValidLeaderboardQuery,
  LeaderboardMetadataAndQuery,
  LeaderboardScore,
  paramsToLeadboardQuery,
} from '@models/leaderboards';
import { WoodstockService } from '@services/woodstock';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { catchError, filter, map, of, switchMap, takeUntil, tap } from 'rxjs';

/** The Woodstock leaderboards page. */
@Component({
  templateUrl: './woodstock-leaderboards.component.html',
  styleUrls: ['./woodstock-leaderboards.component.scss'],
})
export class WoodstockLeaderboardsComponent extends BaseComponent implements OnInit {
  public statsSelectedScore: LeaderboardScore;
  public scoresDeleted: LeaderboardScore[];
  public activeLeaderboard: LeaderboardMetadataAndQuery;
  public temporaryLeaderboard: LeaderboardMetadataAndQuery;

  public getActionMonitor = new ActionMonitor('GET leaderboard metadata');

  constructor(
    private readonly woodstockService: WoodstockService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.listenForQueryParams();
  }

  /** Logic when stats score is selected. */
  public onStatsScoreSelected(score: LeaderboardScore): void {
    this.statsSelectedScore = score;
  }

  /** Logic when scores are deleted from leaderboard-scores. */
  public onScoresDeleted(scores: LeaderboardScore[]): void {
    this.scoresDeleted = scores;
  }

  private listenForQueryParams(): void {
    this.route.queryParams
      .pipe(
        ignorePaginatorQueryParams(),
        tap(() => {
          this.getActionMonitor = new ActionMonitor(this.getActionMonitor.dispose().label);
        }),
        map(params => {
          const query = paramsToLeadboardQuery(params);
          if (!isValidLeaderboardQuery(query)) {
            if (!!this.activeLeaderboard?.query) {
              // If there is an active query but no valid query params
              // Force the active query into the URL's query params
              this.router.navigate([], {
                relativeTo: this.route,
                queryParams: this.activeLeaderboard.query,
              });
            }
            return null;
          }

          return query;
        }),
        filter(query => !!query), // Ignore invalid queries
        tap(query => {
          this.temporaryLeaderboard = {
            query: query,
            metadata: null,
          };
        }),
        switchMap(() => {
          this.getActionMonitor = new ActionMonitor(this.getActionMonitor.dispose().label);

          return this.woodstockService
            .getLeaderboardMetadata$(
              this.temporaryLeaderboard.query.scoreboardTypeId,
              this.temporaryLeaderboard.query.scoreTypeId,
              this.temporaryLeaderboard.query.trackId,
              this.temporaryLeaderboard.query.gameScoreboardId,
            )
            .pipe(
              this.getActionMonitor.monitorSingleFire(),
              // Return null to let child components show errors
              catchError(() => of(null)),
            );
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(leaderboard => {
        this.temporaryLeaderboard.metadata = leaderboard;
        this.activeLeaderboard = this.temporaryLeaderboard;
      });
  }
}
