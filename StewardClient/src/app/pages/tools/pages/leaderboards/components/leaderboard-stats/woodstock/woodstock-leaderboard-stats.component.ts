import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LeaderboardMetadataAndQuery, LeaderboardScore } from '@models/leaderboards';
import { WoodstockService } from '@services/woodstock';

/**
 *  Woodstock leaderboard stats component.
 */
@Component({
  selector: 'woodstock-leaderboard-stats',
  templateUrl: './woodstock-leaderboard-stats.component.html',
})
export class WoodstockLeaderboardStatsComponent {
  @Input() leaderboard: LeaderboardMetadataAndQuery;
  @Input() scoresDeleted: LeaderboardScore[];
  @Output() selectedScore = new EventEmitter<LeaderboardScore>();

  constructor(public readonly service: WoodstockService) {}
}
