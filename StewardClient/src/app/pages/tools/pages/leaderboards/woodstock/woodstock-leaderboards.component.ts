import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { ignorePaginatorQueryParams } from '@helpers/paginator';
import {
  isValidLeaderboardQuery,
  LeaderboardQuery,
  LeaderboardScore,
  paramsToLeadboardQuery,
} from '@models/leaderboards';
import { filter, map, takeUntil } from 'rxjs';

/** The Woodstock leaderboards page. */
@Component({
  templateUrl: './woodstock-leaderboards.component.html',
  styleUrls: ['./woodstock-leaderboards.component.scss'],
})
export class WoodstockLeaderboardsComponent extends BaseComponent implements OnInit {
  public statsSelectedScore: LeaderboardScore;
  public scoresDeleted: LeaderboardScore[];
  public activeQuery: LeaderboardQuery;

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {
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
        map(params => {
          const query = paramsToLeadboardQuery(params);
          if (!isValidLeaderboardQuery(query)) {
            if (!!this.activeQuery) {
              // If there is an active query but no valid query params
              // Force the active query into the URL's query params
              this.router.navigate([], {
                relativeTo: this.route,
                queryParams: this.activeQuery,
              });
            }
            return null;
          }

          return query;
        }),
        filter(query => !!query),
        takeUntil(this.onDestroy$),
      )
      .subscribe(query => {
        this.activeQuery = query;
      });
  }
}
