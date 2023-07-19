import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { ignorePaginatorQueryParams } from '@helpers/paginator';
import { DeviceType } from '@models/enums';
import {
  getDeviceTypesFromQuery,
  isValidLeaderboardQuery,
  LeaderboardMetadataAndQuery,
  LeaderboardQuery,
  LeaderboardScore,
  paramsToLeadboardQuery,
} from '@models/leaderboards';
import { WoodstockLeaderboardService } from '@services/api-v2/woodstock/leaderboard/woodstock-leaderboard.service';
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
    private readonly leaderboardService: WoodstockLeaderboardService,
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
          this.getActionMonitor = this.getActionMonitor.repeat();
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
        filter(query => this.hasValidDeviceTypes(query)), // Remove invalid device types from query params
        tap(query => {
          this.temporaryLeaderboard = {
            query: query,
            metadata: null,
          };
        }),
        switchMap(() => {
          this.getActionMonitor = this.getActionMonitor.repeat();

          return this.leaderboardService
            .getLeaderboardMetadata$(
              this.temporaryLeaderboard.query.scoreboardTypeId,
              this.temporaryLeaderboard.query.scoreTypeId,
              this.temporaryLeaderboard.query.trackId,
              this.temporaryLeaderboard.query.gameScoreboardId,
              this.temporaryLeaderboard.query.leaderboardEnvironment,
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
        this.temporaryLeaderboard.metadata.deviceTypes = getDeviceTypesFromQuery(
          this.temporaryLeaderboard.query,
        );
        this.activeLeaderboard = this.temporaryLeaderboard;
      });
  }

  /** Checks if invalid device types are found in query params.. */
  private hasValidDeviceTypes(query: LeaderboardQuery): boolean {
    const hasDeviceTypes = !!query.deviceTypes;
    if (!hasDeviceTypes) {
      return true;
    }

    const allDeviceTypes = query.deviceTypes.split(',').map(deviceType => DeviceType[deviceType]);
    const validDeviceTypes = allDeviceTypes.filter(deviceType => !!deviceType);
    const invalidDeviceTypes = allDeviceTypes.filter(deviceType => !deviceType);

    // If we have invalid device types, remove them and re-route with valid params.
    const hasValidDevices = validDeviceTypes?.length > 0;
    const hasInvalidDevices = invalidDeviceTypes?.length > 0;
    if (hasInvalidDevices) {
      query.deviceTypes = hasValidDevices ? validDeviceTypes.join(',') : undefined;
      this.router.navigate([], {
        queryParams: query,
        replaceUrl: true,
      });

      return false;
    }

    return true;
  }
}
