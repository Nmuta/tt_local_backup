import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { ZERO } from '@helpers/bignumbers';
import { DeviceType } from '@models/enums';
import {
  generateLeaderboardMetadataString,
  LeaderboardMetadataAndQuery,
  LeaderboardQuery,
  LeaderboardScore,
  getDeviceTypesFromQuery,
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
import { catchError, EMPTY, Observable, takeUntil } from 'rxjs';

export interface LeaderboardStatsContract {
  /** Gets leaderboard scores from top of leaderboard. */
  getLeaderboardScores$(
    scoreboardTypeId: BigNumber,
    scoreTypeId: BigNumber,
    trackId: BigNumber,
    pivotId: BigNumber,
    deviceTypes: DeviceType[],
    startAt: BigNumber,
    maxResults?: BigNumber,
  ): Observable<LeaderboardScore[]>;
}

/** Displays the stats for leaderboard scores. */
@Component({
  selector: 'leaderboard-stats',
  templateUrl: './leaderboard-stats.component.html',
  styleUrls: ['./leaderboard-stats.component.scss'],
})
export class LeaderboardStatsComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() service: LeaderboardStatsContract;
  @Input() leaderboard: LeaderboardMetadataAndQuery;
  @Input() scoresDeleted: LeaderboardScore[];
  @Output() selectedScore = new EventEmitter<LeaderboardScore>();

  public getLeaderboardScoresMonitor = new ActionMonitor('GET leaderboard scores');
  public expanded: boolean = true;
  public maxNumberOfScores: number = 5_000;
  public viewOptions: number[] = [100, 500, 1000, 2_500, 5000];
  public selectedViewOption = this.viewOptions.find(x => x == 1000);

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
  public matCardSubtitle = this.matCardSubtitleDefault;

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (!this.service) {
      throw new Error('No service is defined for leaderboard stats.');
    }
  }

  /** Lifecycle hook. */
  public ngOnChanges(changes: SimpleChanges): void {
    const foundQueryChange = !!changes.leaderboard && !!this.leaderboard?.query;
    const foundScoresDeleted = !!changes.scoresDeleted && this.scoresDeleted?.length > 0;

    if (foundQueryChange || foundScoresDeleted) {
      this.getLeaderboardScores$(this.leaderboard.query).subscribe(scores => {
        this.scores = scores;
        if (scores.length > 0) {
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
    }
  }

  /** Logic when view option is changed. */
  public onViewChange(): void {
    this.generateGraphData();
  }

  /** Logic when event on graph is selected. */
  public onGraphClick(event: NgxLineChartClickEvent): void {
    const score = this.scores.find(s => s.position.isEqualTo(event.name));

    if (!!score) {
      this.selectedScore.emit(score);
    }
  }

  private getLeaderboardScores$(query: LeaderboardQuery): Observable<LeaderboardScore[]> {
    this.getLeaderboardScoresMonitor = this.getLeaderboardScoresMonitor.repeat();
    return this.service
      .getLeaderboardScores$(
        query.scoreboardTypeId,
        query.scoreTypeId,
        query.trackId,
        query.gameScoreboardId,
        getDeviceTypesFromQuery(query),
        ZERO,
        new BigNumber(this.maxNumberOfScores),
      )
      .pipe(
        this.getLeaderboardScoresMonitor.monitorSingleFire(),
        catchError(() => EMPTY),
        takeUntil(this.onDestroy$),
      );
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
