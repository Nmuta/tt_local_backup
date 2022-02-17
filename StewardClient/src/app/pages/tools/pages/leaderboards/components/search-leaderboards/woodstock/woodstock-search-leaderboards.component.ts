import { Component } from '@angular/core';
import { WoodstockService } from '@services/woodstock';

/**
 *  Woodstock search leaderboards component.
 */
@Component({
  selector: 'woodstock-search-leaderboards',
  templateUrl: './woodstock-search-leaderboards.component.html',
})
export class WoodstockSearchLeaderboardsComponent {
  constructor(public readonly service: WoodstockService) {}
}
