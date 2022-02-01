import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { ignorePaginatorQueryParams } from '@helpers/paginator';
import { GuidLikeString } from '@models/extended-types';
import {
  paramsToLeadboardQuery,
  isValidLeaderboardQuery,
  Leaderboard,
  LeaderboardQuery,
  LeaderboardScore,
  determineScoreTypeQualifier,
  LEADERBOARD_PAGINATOR_SIZES,
} from '@models/leaderboards';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import BigNumber from 'bignumber.js';
import { cloneDeep } from 'lodash';
import { EMPTY, Observable, Subject } from 'rxjs';
import { switchMap, takeUntil, tap, map, catchError, filter } from 'rxjs/operators';

export interface LeaderboardScoresContract {
  /** Gets leaderboard metadata. */
  getLeaderboardMetadata$(
    scoreboardTypeId: BigNumber,
    scoreTypeId: BigNumber,
    trackId: BigNumber,
    pivotId: BigNumber,
  ): Observable<Leaderboard>;

  /** Gets leaderboard scores from top of leaderboard. */
  getLeaderboardScores$(
    scoreboardTypeId: BigNumber,
    scoreTypeId: BigNumber,
    trackId: BigNumber,
    pivotId: BigNumber,
    startAt: BigNumber,
    maxResults?: BigNumber,
  ): Observable<LeaderboardScore[]>;

  /** Gets leaderboard scores near player XUID. */
  getLeaderboardScoresNearPlayer$(
    xuid: BigNumber,
    scoreboardTypeId: BigNumber,
    scoreTypeId: BigNumber,
    trackId: BigNumber,
    pivotId: BigNumber,
    maxResults?: BigNumber,
  ): Observable<LeaderboardScore[]>;

  /** Deletes leaderboard scores. */
  deleteLeaderboardScores$(scoreIds: GuidLikeString[]): Observable<void>;
}

enum LeaderboardView {
  Top = 'Top Of List',
  Player = 'Near Player',
}

/** Displays a leaderboard's scores. */
@Component({
  selector: 'leaderboard-scores',
  templateUrl: './leaderboard-scores.component.html',
  styleUrls: ['./leaderboard-scores.component.scss'],
})
export class LeaderboardScoresComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() service: LeaderboardScoresContract;

  public getLeaderboardScores$ = new Subject<LeaderboardQuery>();
  public leaderboardScores = new BetterMatTableDataSource<LeaderboardScore>([]);
  public getLeaderboardScoresMonitor = new ActionMonitor('GET Leaderboard Scores');
  public deleteLeaderboardScoresMonitor = new ActionMonitor('DELETE Leaderboard Score(s)');
  public leaderboardDisplayColumns: string[] = ['position', 'score', 'metadata', 'actions'];

  public isMultiDeleteActive: boolean = false;
  public scoreTypeQualifier: string = '';
  public activeLeaderboardQuery: LeaderboardQuery;
  public activeLeaderboard: Leaderboard;
  public activeLeaderboardView: LeaderboardView;
  public activeXuid: BigNumber;

  public selectedScores: LeaderboardScore[] = [];
  public paginatorSizes: number[] = LEADERBOARD_PAGINATOR_SIZES;

  /** Paginator jump form controls. */
  public jumpFormControls = {
    score: new FormControl(null, Validators.required),
  };
  public jumpFormGroup = new FormGroup(this.jumpFormControls);

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackbar: MatSnackBar,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (!this.service) {
      throw new Error('No service is defined for leaderboard scores.');
    }

    this.setupGetLeaderboardMetadataObservable();
    this.setupGetLeaderboardScoresObservable();
    this.listenForQueryParams();
  }

  /** Lifecycle  hook. */
  public ngAfterViewInit(): void {
    this.leaderboardScores.paginator = this.paginator;
  }

  /** Removes the XUID query param from URL. */
  public switchToTopOfListView(): void {
    const params = cloneDeep(this.route.snapshot.queryParams);
    params['xuid'] = null;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  /** Logic when row is clicked on. */
  public onRowClicked(score: LeaderboardScore): void {
    score.selected = !score.selected;
    const selectedScoreIndex = this.selectedScores.findIndex(s => s.id === score.id);
    if (selectedScoreIndex >= 0) {
      this.selectedScores.splice(selectedScoreIndex, 1);
    }

    if (score.selected) {
      this.selectedScores.push(score);
    }
  }

  /** Unselects all selected scores. */
  public unselectAllScores(): void {
    this.selectedScores = [];
    this.leaderboardScores.data.map(s => (s.selected = false));
  }

  /** Auto-selects all scores at and above the provided score position. */
  public autoSelectMultiScores(score: LeaderboardScore): void {
    const positionMargin = score.position;

    this.selectedScores = [];
    this.leaderboardScores.data.map(s => {
      if (s.position.isLessThanOrEqualTo(positionMargin)) {
        this.selectedScores.push(s);
        s.selected = true;
      }
    });
  }

  /** Deletes scores from leaderboard. */
  public deleteScores(scores: LeaderboardScore[]): void {
    this.deleteLeaderboardScoresMonitor = new ActionMonitor(
      this.deleteLeaderboardScoresMonitor.dispose().label,
    );

    const scoreIds = scores.map(score => score.id);
    this.service
      .deleteLeaderboardScores$(scoreIds)
      .pipe(this.deleteLeaderboardScoresMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.getLeaderboardScores$.next(this.activeLeaderboardQuery);
      });
  }

  /** Hook into paginator page changes. */
  public paginatorPageChange(event: PageEvent): void {
    this.activeLeaderboardQuery.pi = event.pageIndex;
    this.activeLeaderboardQuery.ps = event.pageSize;

    this.router.navigate([], {
      queryParams: this.activeLeaderboardQuery,
      replaceUrl: true,
    });
  }

  /** Jumps to score in table. */
  public jumpToScore(): void {
    const score = this.jumpFormControls.score.value;
    const pageSize = this.leaderboardScores.paginator.pageSize;

    // Determine page where searched score exists
    const scoreIndex = this.leaderboardScores.data.findIndex(s =>
      s.score.isGreaterThanOrEqualTo(new BigNumber(score)),
    );
    const foundPageIndex = Math.floor(scoreIndex / pageSize);
    const highestPageIndex = Math.floor(this.leaderboardScores.data.length / pageSize) - 1;

    // Jump to page
    const showSuccessSnackbar = foundPageIndex >= 0;
    const newPageIndex = foundPageIndex >= 0 ? foundPageIndex : highestPageIndex;
    this.paginator.pageIndex = newPageIndex;
    this.paginator.page.next({
      pageIndex: newPageIndex,
      pageSize: this.paginator.pageSize,
      length: this.paginator.length,
    });

    // Show snackbar of automated adjustment
    const snackbarMessage = showSuccessSnackbar
      ? `Jumped to page ${newPageIndex + 1}`
      : 'Threshold too high, jumped to end of list';
    this.snackbar.open(snackbarMessage, 'Okay', {
      duration: 3_000,
      panelClass: showSuccessSnackbar ? 'snackbar-info' : 'snackbar-warn',
    });
  }

  private setupGetLeaderboardScoresObservable(): void {
    this.getLeaderboardScores$
      .pipe(
        tap(() => {
          this.leaderboardScores.data = [];
          this.selectedScores = [];
          this.isMultiDeleteActive = false;
          this.activeXuid = null;
          this.getLeaderboardScoresMonitor = new ActionMonitor(
            this.getLeaderboardScoresMonitor.dispose().label,
          );
        }),
        filter(q => !!q),
        tap(q => (this.activeLeaderboardQuery = q)),
        switchMap(query => {
          let newObs: Observable<LeaderboardScore[]>;
          if (!!query.xuid) {
            this.activeXuid = query.xuid;
            newObs = this.getLeaderboardScoresNearPlayer$(query);
          } else {
            newObs = this.getLeaderboardScoresFromTop$(query);
          }

          return newObs.pipe(
            this.getLeaderboardScoresMonitor.monitorSingleFire(),
            catchError(() => EMPTY),
          );
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(scores => {
        this.scoreTypeQualifier = determineScoreTypeQualifier(
          this.activeLeaderboardQuery.scoreTypeId,
        );

        if (this.activeLeaderboardQuery?.pi >= 0) {
          this.paginator.pageIndex = this.activeLeaderboardQuery.pi;
        }

        if (this.activeLeaderboardQuery?.ps >= 0) {
          this.paginator.pageSize = this.activeLeaderboardQuery.ps;
        }

        this.leaderboardScores.data = scores;
      });
  }

  private setupGetLeaderboardMetadataObservable(): void {
    this.getLeaderboardScores$
      .pipe(
        filter(q => !!q),
        switchMap(query => {
          return this.service
            .getLeaderboardMetadata$(
              query.scoreboardTypeId,
              query.scoreTypeId,
              query.trackId,
              query.gameScoreboardId,
            )
            .pipe(catchError(() => EMPTY));
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(leaderboard => {
        this.activeLeaderboard = leaderboard;
      });
  }

  private listenForQueryParams(): void {
    this.route.queryParams
      .pipe(
        ignorePaginatorQueryParams(),
        map(params => {
          const query = paramsToLeadboardQuery(params);
          if (!isValidLeaderboardQuery(query)) {
            if (!!this.activeLeaderboardQuery) {
              // If there is an active query but no valid query params
              // Force the active query into the URL's query params
              this.router.navigate([], {
                relativeTo: this.route,
                queryParams: this.activeLeaderboardQuery,
              });
            }
            return null;
          }

          return query;
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(query => {
        this.getLeaderboardScores$.next(query);
      });
  }

  private getLeaderboardScoresNearPlayer$(query: LeaderboardQuery): Observable<LeaderboardScore[]> {
    this.activeLeaderboardView = LeaderboardView.Player;
    return this.service
      .getLeaderboardScoresNearPlayer$(
        query.xuid,
        query.scoreboardTypeId,
        query.scoreTypeId,
        query.trackId,
        query.gameScoreboardId,
      )
      .pipe(
        tap(scores => {
          // Highlight selected player's score
          const score = scores.find(s => s.xuid.isEqualTo(this.activeXuid));
          if (!!score) {
            score.highlighted = true;
          }
        }),
      );
  }

  private getLeaderboardScoresFromTop$(query: LeaderboardQuery): Observable<LeaderboardScore[]> {
    this.activeLeaderboardView = LeaderboardView.Top;
    return this.service.getLeaderboardScores$(
      query.scoreboardTypeId,
      query.scoreTypeId,
      query.trackId,
      query.gameScoreboardId,
      new BigNumber(0),
    );
  }
}