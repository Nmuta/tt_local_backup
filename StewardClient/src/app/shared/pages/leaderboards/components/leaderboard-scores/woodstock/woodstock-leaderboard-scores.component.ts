import { Component } from '@angular/core';
import { WoodstockService } from '@services/woodstock';

/**
 *  Woodstock leaderboard scores component.
 */
@Component({
  selector: 'woodstock-leaderboard-scores',
  templateUrl: './woodstock-leaderboard-scores.component.html',
})
export class WoodstockLeaderboardScoresComponent {
  constructor(public service: WoodstockService) {}
}
