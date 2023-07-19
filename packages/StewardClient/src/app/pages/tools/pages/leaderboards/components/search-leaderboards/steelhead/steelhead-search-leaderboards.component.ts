import { Component } from '@angular/core';
import { SteelheadLeaderboardsService } from '@services/api-v2/steelhead/leaderboards/steelhead-leaderboards.service';

/**
 *  Searches Steelhead leaderboards.
 */
@Component({
  selector: 'steelhead-search-leaderboards',
  templateUrl: './steelhead-search-leaderboards.component.html',
})
export class SteelheadSearchLeaderboardsComponent {
  constructor(public readonly service: SteelheadLeaderboardsService) {}
}
