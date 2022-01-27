import { Component } from '@angular/core';
import { GameTitleAbbreviation, GameTitleCodeName } from '@models/enums';

/** Displays the leaderboards tool. */
@Component({
  templateUrl: './leaderboards.component.html',
  styleUrls: ['./leaderboards.component.scss'],
})
export class LeaderboardsComponent {
  public navbarRouterLinks = [
    {
      name: GameTitleAbbreviation.FH5,
      codename: GameTitleCodeName.FH5,
      route: ['.', GameTitleCodeName.FH5.toLowerCase()],
    },
  ];
}
