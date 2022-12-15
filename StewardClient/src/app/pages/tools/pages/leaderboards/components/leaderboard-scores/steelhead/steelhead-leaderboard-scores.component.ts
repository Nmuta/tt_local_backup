import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GameTitle } from '@models/enums';
import { LeaderboardMetadataAndQuery, LeaderboardScore } from '@models/leaderboards';
import { SteelheadLeaderboardsService } from '@services/api-v2/steelhead/leaderboards/steelhead-leaderboards.service';

/**
 *  Displays leaderboard scores for Steelhead.
 */
@Component({
  selector: 'steelhead-leaderboard-scores',
  templateUrl: './steelhead-leaderboard-scores.component.html',
})
export class SteelheadLeaderboardScoresComponent {
  /** Leaderboard metadata and query. */
  @Input() leaderboard: LeaderboardMetadataAndQuery;
  /** Selected leaderboard score. */
  @Input() externalSelectedScore: LeaderboardScore;
  /** Output scores for deletion. */
  @Output() scoresDeleted = new EventEmitter<LeaderboardScore[]>();

  public gameTitle = GameTitle.FM8;

  constructor(public readonly service: SteelheadLeaderboardsService) {}
}
