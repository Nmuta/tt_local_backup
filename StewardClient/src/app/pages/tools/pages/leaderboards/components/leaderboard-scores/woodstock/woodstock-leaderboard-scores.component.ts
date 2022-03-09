import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() leaderboard: LeaderboardMetadataAndQuery;
  @Input() externalSelectedScore: LeaderboardScore;
  @Output() scoresDeleted = new EventEmitter<LeaderboardScore[]>();

  constructor(public service: WoodstockService) {}
}
