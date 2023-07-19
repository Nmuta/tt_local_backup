import { Component } from '@angular/core';
import { WoodstockLeaderboardsService } from '@services/api-v2/woodstock/leaderboards/woodstock-leaderboards.service';

/**
 *  Woodstock search leaderboards component.
 */
@Component({
  selector: 'woodstock-search-leaderboards',
  templateUrl: './woodstock-search-leaderboards.component.html',
})
export class WoodstockSearchLeaderboardsComponent {
  constructor(public readonly leaderboardsService: WoodstockLeaderboardsService) {}
}
