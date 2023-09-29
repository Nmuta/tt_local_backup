import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyChipListChange as MatChipListChange } from '@angular/material/legacy-chips';
import { MatLegacyMenuTrigger as MatMenuTrigger } from '@angular/material/legacy-menu';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { ZERO } from '@helpers/bignumbers';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { getToolsActivatedRoute } from '@helpers/tools-activated-route';
import { DeviceType, GameTitle } from '@models/enums';
import { IdentityResultAlpha, IdentityResultAlphaBatch } from '@models/identity-query.model';
import {
  generateLeaderboardMetadataString,
  LeaderboardMetadataAndQuery,
  LeaderboardQuery,
  LeaderboardScore,
  getDeviceTypesFromQuery,
  getLspEndpointFromLeaderboardEnvironment,
  LeaderboardEnvironment,
} from '@models/leaderboards';
import {
  LINE_CHART_SD_THRESHOLD_COLORS,
  NgxLineChartClickEvent,
  NgxLineChartResults,
  NgxLineChartSeries,
} from '@models/ngx-charts';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import BigNumber from 'bignumber.js';
import { compact, find, orderBy } from 'lodash';
import { catchError, combineLatest, EMPTY, Observable, of, takeUntil } from 'rxjs';

export interface LeaderboardStatsContract {
  talentUserGroupId: number;
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

  getLeaderboardTalentIdentities$(): Observable<IdentityResultAlphaBatch>;
}

export type LeaderboardTopTalentOption = {
  label: string;
  clickFn: (xuid: BigNumber) => void;
};

/** Displays the stats for leaderboard scores. */
@Component({
  selector: 'leaderboard-stats',
  templateUrl: './leaderboard-stats.component.html',
  styleUrls: ['./leaderboard-stats.component.scss'],
})
export class LeaderboardStatsComponent extends BaseComponent implements OnChanges {
  @ViewChildren(MatMenuTrigger) childMenuTriggers: QueryList<MatMenuTrigger>;
  /** REVIEW-COMMENT: Game title. */
  @Input() public gameTitle: GameTitle;
  /** REVIEW-COMMENT: The leaderboard stats service. */
  @Input() service: LeaderboardStatsContract;
  /** REVIEW-COMMENT: Leaderboard metadata and query. */
  @Input() leaderboard: LeaderboardMetadataAndQuery;
  /** REVIEW-COMMENT: Leaderboard scores deleted. */
  @Input() scoresDeleted: LeaderboardScore[];
  /** REVIEW-COMMENT: Output when a leaderboard score is selected. */
  @Output() selectedScore = new EventEmitter<LeaderboardScore>();

  public getLeaderboardScoresMonitor = new ActionMonitor('GET leaderboard scores');
  public getLeaderboardTalentMonitor = new ActionMonitor('GET leaderboard talent');

  public expanded: boolean = true;
  public maxNumberOfScores: number = 5_000;
  public viewOptions: number[] = [100, 250, 500, 1000, 2_500, 5000];
  public selectedViewOption = this.viewOptions.find(x => x == 1000);
  public displayTalentUsers: boolean = true;

  public talentIdentities: IdentityResultAlpha[] = [];
  public topTalentScores: LeaderboardScore[] = [];
  public topTalent: { identity: IdentityResultAlpha; position: BigNumber }[] = [];
  public sanitizedTopDisplayedPositions: BigNumber[] = [];
  public topTalentOptions: LeaderboardTopTalentOption[] = [
    { label: 'Jump to position', clickFn: xuid => this.jumpToPosition(xuid) },
    { label: 'Go To player Details', clickFn: xuid => this.jumpToPlayerDetails(xuid) },
  ];

  public displayTalentTickMarks: boolean = false;
  public selectedIdentityPosition: BigNumber;

  // Standard deviation variables
  public scores: LeaderboardScore[];
  public averageMean: number;
  public standardDeviation: number;

  // Graph variables
  public graphData: NgxLineChartResults[];
  public xAxisLabel: string = 'Leaderboard Position';
  public yAxisLabel: string = 'Score';
  public colorScheme: Color = {
    name: 'test',
    selectable: false,
    group: ScaleType.Linear,
    domain: LINE_CHART_SD_THRESHOLD_COLORS,
  };

  private readonly matCardSubtitleDefault = 'Select a leaderboard to show its stats';
  private numberOfTopScoresToDisplay: number = 3;
  public sortedTalentScores: LeaderboardScore[] = [];
  public matCardSubtitle = this.matCardSubtitleDefault;
  public talentFormControls = {
    numberToShow: new UntypedFormControl(this.numberOfTopScoresToDisplay, [
      Validators.required,
      Validators.min(0),
    ]),
  };
  public talentForm: UntypedFormGroup = new UntypedFormGroup(this.talentFormControls);

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnChanges(changes: BetterSimpleChanges<LeaderboardStatsComponent>): void {
    this.getLeaderboardScoresMonitor = this.getLeaderboardScoresMonitor.repeat();
    const foundQueryChange = !!changes.leaderboard && !!this.leaderboard?.query;
    const foundScoresDeleted = !!changes.scoresDeleted && this.scoresDeleted?.length > 0;

    if (foundQueryChange || foundScoresDeleted) {
      const getLeaderboardScores$ = this.getLeaderboardScores$(this.leaderboard.query);
      const getTalentedUsers$ = this.getTalentedUsers$();

      combineLatest([getLeaderboardScores$, getTalentedUsers$])
        .pipe(this.getLeaderboardScoresMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
        .subscribe(([scores, identities]) => {
          this.scores = scores;

          if (identities) {
            this.talentIdentities = identities;
          }

          if (scores.length > 0) {
            const talentScores = this.talentIdentities.map(x => {
              return this.scores.find(y => y.xuid.isEqualTo(x.xuid));
            });
            this.sortedTalentScores = compact(
              orderBy(talentScores, [
                function (o) {
                  return o?.position.toNumber();
                },
              ]),
            );
            this.updateDisplayedTalentCount();

            this.averageMean =
              scores.map(s => s.score.toNumber()).reduce((a, b) => a + b) / scores.length;
            this.standardDeviation = this.generateStandardDeviation(
              scores.map(s => s.score.toNumber()),
            );
            this.generateGraphData();
          }
        });
    }

    if (foundQueryChange) {
      this.matCardSubtitle = !!this.leaderboard?.metadata
        ? generateLeaderboardMetadataString(this.leaderboard.metadata)
        : 'Could not find leaderboard metadata';

      this.displayTalentUsers =
        this.leaderboard.query.leaderboardEnvironment.toLowerCase() == LeaderboardEnvironment.Prod;
      if (this.displayTalentUsers) {
        this.talentFormControls.numberToShow.valueChanges
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(() => {
            this.updateDisplayedTalentCount();
          });
      }
    }
  }

  /** Logic when view option is changed. */
  public onViewChange(): void {
    this.generateGraphData();
    this.sanitizeDisplayedTickMarks();
  }

  /** Called when a new set of results is selected. */
  public onSelect(change: MatChipListChange): void {
    if (change.value) {
      this.displayTalentTickMarks = true;
      this.selectedIdentityPosition = this.topTalentScores.find(x =>
        x.xuid.isEqualTo(change.value.xuid),
      )?.position;
      if (
        this.selectedIdentityPosition.isGreaterThanOrEqualTo(new BigNumber(this.selectedViewOption))
      ) {
        // change the view to include the selected identity.
        const newViewOption = find(this.viewOptions, x =>
          this.selectedIdentityPosition.isLessThan(new BigNumber(x)),
        );
        this.selectedViewOption = newViewOption;
        this.generateGraphData();
        this.sanitizeDisplayedTickMarks();
      }
    } else {
      this.displayTalentTickMarks = false;
      this.selectedIdentityPosition = new BigNumber(0);
    }
  }

  /** Update array of displayed talent to match count length. */
  public updateDisplayedTalentCount(): void {
    this.numberOfTopScoresToDisplay = this.talentFormControls.numberToShow.value;
    this.topTalentScores = this.sortedTalentScores.slice(0, this.numberOfTopScoresToDisplay);

    this.topTalent = this.topTalentScores.map(x => {
      const talentIdentity = this.talentIdentities.find(y => y.xuid.isEqualTo(x.xuid));
      return { position: x.position, identity: talentIdentity };
    });

    this.sanitizeDisplayedTickMarks();
  }

  /**
   *  Logic for trimming top displayed positions to fit into view.
   *  Required due to display bug with out of range tick marks.
   */
  public sanitizeDisplayedTickMarks(): void {
    this.sanitizedTopDisplayedPositions = this.topTalent
      .map(x => x.position)
      .filter(x => x.isLessThanOrEqualTo(new BigNumber(this.selectedViewOption)));
  }

  /** Logic when event on graph is selected. */
  public onGraphClick(event: NgxLineChartClickEvent): void {
    const score = this.scores.find(s => s.position.isEqualTo(event.name));
    this.emitSelectedScore(score);
  }

  /** Logic when talent chip is selected. */
  public jumpToPosition(xuid: BigNumber): void {
    const score = this.scores.find(s => s.xuid.isEqualTo(xuid));
    this.emitSelectedScore(score);
  }

  /** Emits score for parent component, also closes any open child menus. */
  public emitSelectedScore(score: LeaderboardScore) {
    if (!!score) {
      this.childMenuTriggers.forEach(trigger => trigger.closeMenu());
      this.selectedScore.emit(score);
    }
  }

  /** Logic when talent chip is selected. */
  public jumpToPlayerDetails(xuid: BigNumber): void {
    //Reroute to player details page using xuid.
    const toolsRoute = getToolsActivatedRoute(this.route);
    const queryParams = {};
    queryParams['xuid'] = xuid;

    this.childMenuTriggers.forEach(trigger => trigger.closeMenu());
    this.router.navigate([`user-details/${this.gameTitle}`], {
      relativeTo: toolsRoute,
      queryParams: queryParams,
      replaceUrl: false,
    });
  }

  /** Logic used to determine what to display tick mark labels on X-axis. */
  public xAxisTickFormatting = value => {
    return value <= this.selectedViewOption ? `${value}` : '';
  };

  private getLeaderboardScores$(query: LeaderboardQuery): Observable<LeaderboardScore[]> {
    return this.service
      .getLeaderboardScores$(
        query.scoreboardTypeId,
        query.scoreTypeId,
        query.trackId,
        query.gameScoreboardId,
        getDeviceTypesFromQuery(query),
        ZERO,
        new BigNumber(this.maxNumberOfScores),
        getLspEndpointFromLeaderboardEnvironment(query.leaderboardEnvironment),
      )
      .pipe(
        catchError(() => EMPTY),
        takeUntil(this.onDestroy$),
      );
  }

  private getTalentedUsers$(): Observable<IdentityResultAlphaBatch> {
    if (this.talentIdentities?.length > 0) {
      return of(undefined);
    }

    return this.service.getLeaderboardTalentIdentities$().pipe(takeUntil(this.onDestroy$));
  }

  private generateGraphData(): void {
    const scoresToShow = this.scores.slice(0, this.selectedViewOption);
    const scoresLowToHigh = this.scores[0].score.isLessThan(
      this.scores[this.scores.length - 1].score,
    );

    const strongOutliersLow = this.findScoresWithinThreshold(
      scoresToShow,
      Number.MIN_SAFE_INTEGER,
      this.averageMean - 3 * this.standardDeviation,
    );
    const mediumOutliersLow = this.findScoresWithinThreshold(
      scoresToShow,
      this.averageMean - 3 * this.standardDeviation,
      this.averageMean - 2 * this.standardDeviation,
    );
    const weakOutliersLow = this.findScoresWithinThreshold(
      scoresToShow,
      this.averageMean - 2 * this.standardDeviation,
      this.averageMean - this.standardDeviation,
    );
    const normal = this.findScoresWithinThreshold(
      scoresToShow,
      this.averageMean - this.standardDeviation,
      this.averageMean + this.standardDeviation,
    );
    const weakOutliersHigh = this.findScoresWithinThreshold(
      scoresToShow,
      this.averageMean + this.standardDeviation,
      this.averageMean + 2 * this.standardDeviation,
    );
    const mediumOutliersHigh = this.findScoresWithinThreshold(
      scoresToShow,
      this.averageMean + 2 * this.standardDeviation,
      this.averageMean + 3 * this.standardDeviation,
    );
    const strongOutliersHigh = this.findScoresWithinThreshold(
      scoresToShow,
      this.averageMean + 3 * this.standardDeviation,
      Number.MAX_SAFE_INTEGER,
    );

    const graphData = [
      {
        name: 'Strong Outliers',
        series: strongOutliersLow.map(d => this.toNgxLineChartSeries(d)),
      },
      {
        name: 'Medium Outliers',
        series: mediumOutliersLow.map(d => this.toNgxLineChartSeries(d)),
      },
      {
        name: 'Weak Outliers',
        series: weakOutliersLow.map(d => this.toNgxLineChartSeries(d)),
      },
      {
        name: 'Normal',
        series: normal.map(d => this.toNgxLineChartSeries(d)),
      },
      {
        name: 'Weak Outliers',
        series: weakOutliersHigh.map(d => this.toNgxLineChartSeries(d)),
      },
      {
        name: 'Medium Outliers',
        series: mediumOutliersHigh.map(d => this.toNgxLineChartSeries(d)),
      },
      {
        name: 'Strong Outliers',
        series: strongOutliersHigh.map(d => this.toNgxLineChartSeries(d)),
      },
    ];

    this.graphData = scoresLowToHigh ? graphData : graphData.reverse();
  }

  /** Check if score is greater than or equal to min and less than max. */
  private findScoresWithinThreshold(
    scores: LeaderboardScore[],
    min: number,
    max: number,
  ): LeaderboardScore[] {
    return scores.filter(entry => {
      return entry.score.isGreaterThanOrEqualTo(min) && entry.score.isLessThan(max);
    });
  }

  private toNgxLineChartSeries(entry: LeaderboardScore): NgxLineChartSeries {
    return {
      name: entry.position.toString(),
      value: entry.score.toNumber(),
    };
  }

  private generateStandardDeviation(scores: number[]): number {
    let result = 0;
    if (scores.length > 0) {
      const sum = scores
        .map(s => (s - this.averageMean) ** 2)
        .reduce((partialSum, a) => partialSum + a, 0);
      result = Math.sqrt(sum / (scores.length - 1));
    }
    return result;
  }
}
