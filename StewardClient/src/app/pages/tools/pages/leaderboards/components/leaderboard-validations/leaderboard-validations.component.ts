import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  generateLeaderboardMetadataString,
  LeaderboardMetadataAndQuery,
} from '@models/leaderboards';

/** Displays the leaderboard validation rules. */
@Component({
  selector: 'leaderboard-validations',
  templateUrl: './leaderboard-validations.component.html',
  styleUrls: ['./leaderboard-validations.component.scss'],
})
export class LeaderboardValidationsComponent implements OnChanges {
  /** REVIEW-COMMENT: Leaderboard metadata and query. */
  @Input() leaderboard: LeaderboardMetadataAndQuery;

  public expanded: boolean = true;
  private readonly matCardSubtitleDefault = 'Select a leaderboard to show its validation rules';
  public matCardSubtitle = this.matCardSubtitleDefault;

  /** Lifecycle hook. */
  public ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.leaderboard && !!this.leaderboard?.query) {
      this.matCardSubtitle = !!this.leaderboard?.metadata
        ? generateLeaderboardMetadataString(this.leaderboard.metadata)
        : 'Could not find leaderboard metadata';
    }
  }
}
