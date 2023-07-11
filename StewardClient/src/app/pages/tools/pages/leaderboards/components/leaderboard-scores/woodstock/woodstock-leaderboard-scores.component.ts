import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GameTitle } from '@models/enums';
import { LeaderboardMetadataAndQuery, LeaderboardScore } from '@models/leaderboards';
import { WoodstockLeaderboardService } from '@services/api-v2/woodstock/leaderboard/woodstock-leaderboard.service';

/**
 *  Woodstock leaderboard scores component.
 */
@Component({
  selector: 'woodstock-leaderboard-scores',
  templateUrl: './woodstock-leaderboard-scores.component.html',
})
export class WoodstockLeaderboardScoresComponent {
  /** Leaderboard metadata and query. */
  @Input() leaderboard: LeaderboardMetadataAndQuery;
  /** Selected score. */
  @Input() externalSelectedScore: LeaderboardScore;
  /** Output when leaderboard scores are deleted. */
  @Output() scoresDeleted = new EventEmitter<LeaderboardScore[]>();

  public gameTitle = GameTitle.FH5;

  constructor(public leaderboardService: WoodstockLeaderboardService) {}
}
