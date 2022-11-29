import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GameTitle } from '@models/enums';
import { LeaderboardMetadataAndQuery, LeaderboardScore } from '@models/leaderboards';
import { WoodstockService } from '@services/woodstock';

/**
 *  Woodstock leaderboard scores component.
 */
@Component({
  selector: 'woodstock-leaderboard-scores',
  templateUrl: './woodstock-leaderboard-scores.component.html',
})
export class WoodstockLeaderboardScoresComponent {
  /** REVIEW-COMMENT: Leaderboard metadata and query. */
  @Input() leaderboard: LeaderboardMetadataAndQuery;
  /** REVIEW-COMMENT: Selected score. */
  @Input() externalSelectedScore: LeaderboardScore;
  /** REVIEW-COMMENT: Output when leaderboard scores are deleted. */
  @Output() scoresDeleted = new EventEmitter<LeaderboardScore[]>();

  public gameTitle = GameTitle.FH5;

  constructor(public service: WoodstockService) {}
}
