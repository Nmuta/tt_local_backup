import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { DateRangePickerFormValue } from '@components/date-time-pickers/datetime-range-picker/date-range-picker/date-range-picker.component';
import { DATE_TIME_TOGGLE_OPTIONS } from '@components/date-time-pickers/datetime-range-picker/datetime-range-toggle-defaults';
import { HCI } from '@environments/environment';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { renderGuard } from '@helpers/rxjs';
import { DeviceType, GameTitle } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import {
  Leaderboard,
  LeaderboardQuery,
  LeaderboardScore,
  LeaderboardMetadataAndQuery,
  determineScoreTypeQualifier,
  LEADERBOARD_PAGINATOR_SIZES,
  generateLeaderboardMetadataString,
  getDeviceTypesFromQuery,
  getLspEndpointFromLeaderboardEnvironment,
  LeaderboardScoreType,
} from '@models/leaderboards';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';
import BigNumber from 'bignumber.js';
import { cloneDeep, first, last } from 'lodash';
import { DateTime } from 'luxon';
import { EMPTY, merge, Observable, Subject } from 'rxjs';
import { switchMap, takeUntil, tap, catchError, filter, debounceTime } from 'rxjs/operators';

export interface LeaderboardScoresContract {
  /** Gets leaderboard metadata. */
  getLeaderboardMetadata$(
    scoreboardTypeId: BigNumber,
    scoreTypeId: BigNumber,
    trackId: BigNumber,
    pivotId: BigNumber,
    pegasusEnvironment: string,
  ): Observable<Leaderboard>;

  /** Gets leaderboard scores from top of leaderboard. */
  getLeaderboardScores$(
    scoreboardTypeId: BigNumber,
    scoreTypeId: BigNumber,
    trackId: BigNumber,
    pivotId: BigNumber,
    deviceTypes: DeviceType[],
    startAt: BigNumber,
    maxResults?: BigNumber,
    endpointKeyOverride?: string,
  ): Observable<LeaderboardScore[]>;

  /** Gets leaderboard scores near player XUID. */
  getLeaderboardScoresNearPlayer$(
    xuid: BigNumber,
    scoreboardTypeId: BigNumber,
    scoreTypeId: BigNumber,
    trackId: BigNumber,
    pivotId: BigNumber,
    deviceTypes: DeviceType[],
    maxResults?: BigNumber,
    endpointKeyOverride?: string,
  ): Observable<LeaderboardScore[]>;

  /** Deletes leaderboard scores. */
  deleteLeaderboardScores$(
    scoreIds: GuidLikeString[],
    endpointKeyOverride?: string,
  ): Observable<void>;
}

enum LeaderboardView {
  Top = 'Top Of List',
  Player = 'Near Player',
}

enum BooleanFilterToggle {
  Ignore,
  On,
  Off,
}

/** Displays a leaderboard's scores. */
@Component({
  selector: 'leaderboard-scores',
  templateUrl: './leaderboard-scores.component.html',
  styleUrls: ['./leaderboard-scores.component.scss'],
  providers: [HumanizePipe],
})
export class LeaderboardScoresComponent
  extends BaseComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('dateSlideToggle') dateSlideToggle: MatSlideToggle;
  /** The leaderboard scores service.*/
  @Input() service: LeaderboardScoresContract;
  /** REVIEW-COMMENT: Leaderboard metadata and query. */
  @Input() leaderboard: LeaderboardMetadataAndQuery;
  /** REVIEW-COMMENT: Selected score. */
  @Input() externalSelectedScore: LeaderboardScore;
  /** The game title. */
  @Input() gameTitle: GameTitle;
  /** REVIEW-COMMENT: Output when leaderboard scores are deleted. */
  @Output() scoresDeleted = new EventEmitter<LeaderboardScore[]>();

  public getLeaderboardScores$ = new Subject<LeaderboardQuery>();
  public leaderboardScores = new BetterMatTableDataSource<LeaderboardScore>([]);
  public getLeaderboardScoresMonitor = new ActionMonitor('GET Leaderboard Scores');
  public deleteLeaderboardScoresMonitor = new ActionMonitor('DELETE Leaderboard Score(s)');
  public leaderboardDisplayColumns: string[] = [
    'position',
    'score',
    'metadata',
    'assists',
    'actions',
  ];

  public isMultiDeleteActive: boolean = false;
  public scoreTypeQualifier: string = '';
  public LeaderboardView = LeaderboardView;
  public activeLeaderboardView: LeaderboardView;
  public activeXuid: BigNumber;

  public selectedScores: LeaderboardScore[] = [];
  public allScores: LeaderboardScore[] = [];
  public filteredScores: LeaderboardScore[] = [];
  public exportableScores: string[][];
  public exportFileName: string;
  public disableExport: boolean = true;
  public paginatorSizes: number[] = LEADERBOARD_PAGINATOR_SIZES;
  private scoresAscendWithPosition: boolean;

  private readonly matCardSubtitleDefault = 'Select a leaderboard to show its scores';
  public matCardSubtitle = this.matCardSubtitleDefault;
  public leaderboardScoreTypeLaptime = LeaderboardScoreType.Laptime;

  /** Paginator jump form controls. */
  public jumpFormControls = {
    score: new FormControl(null, Validators.required),
  };
  public jumpFormGroup = new FormGroup(this.jumpFormControls);

  public dateRangeToggleOptions = DATE_TIME_TOGGLE_OPTIONS;
  public filterFormControls = {
    dateRange: new FormControl({
      value: {
        start: DateTime.local().minus({ days: 7 }),
        end: DateTime.local(),
      } as DateRangePickerFormValue,
      disabled: true,
    }),
    usedStmAssist: new FormControl(BooleanFilterToggle.Ignore),
    usedAbsAssist: new FormControl(BooleanFilterToggle.Ignore),
    usedTcsAssist: new FormControl(BooleanFilterToggle.Ignore),
    usedAutoAssist: new FormControl(BooleanFilterToggle.Ignore),
  };

  public readonly assistFilterContexts = {
    stmAssist: {
      formControl: this.filterFormControls.usedStmAssist,
      name: 'STM Assist',
      helpTitle: 'Stability Management Assist Filter',
      helpText:
        'Allows for slightly more slip before applying corrective braking to individual wheels.',
    },
    absAssist: {
      formControl: this.filterFormControls.usedAbsAssist,
      name: 'ABS Assist',
      helpTitle: 'Anti-Lock Braking System Assist Filter',
      helpText:
        "When a driver applies the brakes, this system pulses the brakes to ensure that they don't lock up.",
    },
    tcsAssist: {
      formControl: this.filterFormControls.usedTcsAssist,
      name: 'TCS Assist',
      helpTitle: 'Traction Control System Assist Filter',
      helpText: 'Allows for slightly more slip before applying corrective braking.',
    },
    autoAssist: {
      formControl: this.filterFormControls.usedAutoAssist,
      name: 'Auto Assist',
      helpTitle: 'Automatic Transmission Assist Filter',
      helpText: "Uses Forza's artificial intelligence to handle the shifting for the player.",
    },
  };

  public readonly permAttribute = PermAttributeName.DeleteLeaderboardScores;

  public BooleanFilterToggle = BooleanFilterToggle;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackbar: MatSnackBar,
    private readonly humanizePipe: HumanizePipe,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (!this.service) {
      throw new Error('No service is defined for leaderboard scores.');
    }

    this.setupGetLeaderboardScoresObservable();

    if (!!this.leaderboard?.query) {
      this.getLeaderboardScores$.next(this.leaderboard.query);
    }

    const dateRangeChanges = this.filterFormControls.dateRange.valueChanges;
    const stmChanges = this.filterFormControls.usedStmAssist.valueChanges;
    const absChanges = this.filterFormControls.usedAbsAssist.valueChanges;
    const tcsChanges = this.filterFormControls.usedTcsAssist.valueChanges;
    const autoChanges = this.filterFormControls.usedAutoAssist.valueChanges;

    merge(dateRangeChanges, stmChanges, absChanges, tcsChanges, autoChanges)
      .pipe(
        debounceTime(HCI.TypingToAutoSearchDebounceMillis),
        tap(() => {
          this.unsetHighlightForAllLeaderboardScores();
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        this.filteredScores = this.filterScores(this.allScores);
        this.setLeaderboardScoresData(this.filteredScores);
      });
  }

  /** Lifecycle hook. */
  public ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.externalSelectedScore && !!this.externalSelectedScore) {
      this.jumpFormControls.score.setValue(this.externalSelectedScore.score.toNumber());
      this.jumpToScore();
    }

    if (!!changes?.leaderboard && !!this.leaderboard?.query) {
      this.getLeaderboardScores$.next(this.leaderboard.query);

      this.matCardSubtitle = !!this.leaderboard?.metadata
        ? generateLeaderboardMetadataString(this.leaderboard.metadata)
        : 'Could not find leaderboard metadata';
    }
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
    this.deleteLeaderboardScoresMonitor = this.deleteLeaderboardScoresMonitor.repeat();

    const scoreIds = scores.map(score => score.id);
    this.service
      .deleteLeaderboardScores$(
        scoreIds,
        getLspEndpointFromLeaderboardEnvironment(this.leaderboard.query.leaderboardEnvironment),
      )

      .pipe(this.deleteLeaderboardScoresMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.getLeaderboardScores$.next(this.leaderboard.query);
        this.scoresDeleted.emit(scores);
      });
  }

  /** Hook into paginator page changes. */
  public paginatorPageChange(event: PageEvent): void {
    this.leaderboard.query.pi = event.pageIndex;
    this.leaderboard.query.ps = event.pageSize;

    this.router.navigate([], {
      queryParams: this.leaderboard.query,
      replaceUrl: true,
    });
  }

  /** Jumps to score in table. */
  public jumpToScore(): void {
    const score = this.jumpFormControls.score.value;
    const pageSize = this.leaderboardScores.paginator.pageSize;

    // Determine page where searched score exists
    const scoreIndex = this.leaderboardScores.data.findIndex(s => {
      // A high/low score is better depending on criteria.
      if (this.scoresAscendWithPosition) {
        return s.score.isGreaterThanOrEqualTo(new BigNumber(score));
      } else {
        return s.score.isLessThanOrEqualTo(new BigNumber(score));
      }
    });

    const foundPageIndex = Math.floor(scoreIndex / pageSize);
    const highestPageIndex = Math.floor(this.leaderboardScores.data.length / pageSize) - 1;

    // Jump to page
    const foundThreshold = foundPageIndex >= 0;
    const newPageIndex = foundPageIndex >= 0 ? foundPageIndex : highestPageIndex;
    this.paginator.pageIndex = newPageIndex;
    this.paginator.page.next({
      pageIndex: newPageIndex,
      pageSize: this.paginator.pageSize,
      length: this.paginator.length,
    });

    // If threshold is found, highlight closest score
    if (foundThreshold) {
      this.unsetHighlightForAllLeaderboardScores();
      this.leaderboardScores.data[scoreIndex].highlighted = true;
      const xuid = this.leaderboardScores.data[scoreIndex].xuid.toString();

      renderGuard(() => {
        const el = document.getElementById(xuid);
        el?.scrollIntoView({ block: 'center' });
      });
    }

    // Show snackbar of automated adjustment
    const snackbarMessage = foundThreshold
      ? `Jumped to page ${newPageIndex + 1}, threshold is highlighted`
      : 'Threshold too high, jumped to end of list';
    this.snackbar.open(snackbarMessage, 'Okay', {
      duration: 3_000,
      panelClass: foundThreshold ? 'snackbar-info' : 'snackbar-warn',
    });
  }

  /** Logic when datetime filter toggle is clicked. */
  public toggleDatetimeFilter(toggleEvent: { checked: boolean }): void {
    if (toggleEvent.checked) {
      this.filterFormControls.dateRange.enable();
    } else {
      this.filterFormControls.dateRange.disable();
    }

    // Make sure slide toggle matches the change event
    if (!!this.dateSlideToggle && this.dateSlideToggle.checked != toggleEvent.checked) {
      this.dateSlideToggle.toggle();
    }
  }

  private setupGetLeaderboardScoresObservable(): void {
    this.getLeaderboardScores$
      .pipe(
        tap(() => {
          this.setLeaderboardScoresData([]);
          this.selectedScores = [];
          this.isMultiDeleteActive = false;
          this.activeXuid = null;
          this.getLeaderboardScoresMonitor = this.getLeaderboardScoresMonitor.repeat();
        }),
        filter(q => !!q),
        tap(() => {
          // Reset date range toggle filter
          this.toggleDatetimeFilter({ checked: false });
        }),
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
        this.allScores = scores;
        this.filteredScores = this.filterScores(this.allScores);
        this.scoreTypeQualifier = determineScoreTypeQualifier(this.leaderboard.query.scoreTypeId);

        if (this.leaderboard.query?.pi >= 0) {
          this.paginator.pageIndex = this.leaderboard.query.pi;
        }

        if (this.leaderboard.query?.ps >= 0) {
          this.paginator.pageSize = this.leaderboard.query.ps;
        }

        this.prepareAlternateScoreValues(this.allScores);
        this.setLeaderboardScoresData(this.allScores);
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
        getDeviceTypesFromQuery(query),
        undefined,
        getLspEndpointFromLeaderboardEnvironment(query.leaderboardEnvironment),
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
      getDeviceTypesFromQuery(query),
      new BigNumber(0),
      undefined,
      getLspEndpointFromLeaderboardEnvironment(query.leaderboardEnvironment),
    );
  }

  private filterScores(_scores: LeaderboardScore[]): LeaderboardScore[] {
    const dateRange = this.filterFormControls.dateRange.value as DateRangePickerFormValue;
    const dateRangeFilterActive =
      !this.filterFormControls.dateRange.disabled && !!dateRange.start && !!dateRange.end;
    const startDate = dateRange.start.toLocal();
    const endDate = dateRange.end.toLocal();

    return _scores.filter(score => {
      let passesDateFilter = true;
      if (dateRangeFilterActive) {
        const scoreDate = score.submissionTimeUtc.toLocal();
        passesDateFilter = scoreDate >= startDate && scoreDate <= endDate;
      }

      const passesStmFilter = this.doesPassAssistFilter(
        this.filterFormControls.usedStmAssist.value,
        score.stabilityManagement,
      );
      const passesAbsFilter = this.doesPassAssistFilter(
        this.filterFormControls.usedAbsAssist.value,
        score.antiLockBrakingSystem,
      );
      const passesTcsFilter = this.doesPassAssistFilter(
        this.filterFormControls.usedTcsAssist.value,
        score.tractionControlSystem,
      );
      const passesAutoFilter = this.doesPassAssistFilter(
        this.filterFormControls.usedAutoAssist.value,
        score.automaticTransmission,
      );

      return (
        passesDateFilter &&
        passesStmFilter &&
        passesAbsFilter &&
        passesTcsFilter &&
        passesAutoFilter
      );
    });
  }

  private setLeaderboardScoresData(scores: LeaderboardScore[]): void {
    this.leaderboardScores.data = scores;

    this.exportableScores = this.prepareExportableScores(scores);
    this.scoresAscendWithPosition = first(scores)?.score.isLessThanOrEqualTo(last(scores)?.score);
  }

  private prepareAlternateScoreValues(scores: LeaderboardScore[]): void {
    switch (this.leaderboard.query.scoreTypeId.toNumber()) {
      case LeaderboardScoreType.SpeedTrap:
      case LeaderboardScoreType.AverageSpeedZone:
        scores.forEach(entry => {
          entry.alternateScoreRepresentations = entry.alternateScoreRepresentations ?? [];
          entry.alternateScoreRepresentations.push({
            label: 'mph',
            value: entry.score.dividedBy(1.609344),
          });
        });
        break;
      case LeaderboardScoreType.DangerSign:
        scores.forEach(entry => {
          entry.alternateScoreRepresentations = entry.alternateScoreRepresentations ?? [];
          entry.alternateScoreRepresentations.push({
            label: 'feet',
            value: entry.score.multipliedBy(3.281),
          });
        });
        break;
    }
  }

  private prepareExportableScores(scores: LeaderboardScore[]): string[][] {
    let scoreType = this.scoreTypeQualifier ?? 'Score';
    scoreType = this.humanizePipe.transform(scoreType);

    const dateRange = this.filterFormControls.dateRange.value as DateRangePickerFormValue;
    const startDate = dateRange.start.toLocal();
    const endDate = dateRange.end.toLocal();

    this.exportFileName = this.leaderboard?.metadata?.name;
    if (this.filterFormControls.dateRange.enabled) {
      this.exportFileName = `[${startDate.toISODate()}_to_${endDate.toISODate()}]`.concat(
        this.exportFileName,
      );
    }

    const newLeaderboardCsvData = [
      [
        'Position',
        scoreType,
        'Xuid',
        'Submission Time (UTC)',
        'Device Type',
        'Leaderboard Entry ID',
      ],
    ];
    for (const score of scores) {
      newLeaderboardCsvData[newLeaderboardCsvData.length] = [
        `${score.position}`, //Position
        `${score.score}`, //Score
        `${score.xuid}`, //Xuid
        `${score.submissionTimeUtc}`, //Submission Time (UTC
        `${score.deviceType}`, //DeviceType
        `${score.id}`, //ID
      ];
    }

    this.disableExport = scores.length === 0;
    return newLeaderboardCsvData;
  }

  private unsetHighlightForAllLeaderboardScores() {
    this.leaderboardScores.data.forEach(s => (s.highlighted = false));
  }

  private doesPassAssistFilter(toggle: BooleanFilterToggle, assist: boolean): boolean {
    switch (toggle) {
      case BooleanFilterToggle.On:
        return assist;
      case BooleanFilterToggle.Off:
        return !assist;
      default:
        return true;
    }
  }
}
