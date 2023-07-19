import { Component } from '@angular/core';
import { getLeaderboardRoute } from '@helpers/route-links';
import { GameTitle, GameTitleAbbreviation, GameTitleCodeName } from '@models/enums';

/** Displays the leaderboards tool. */
@Component({
  templateUrl: './leaderboards.component.html',
  styleUrls: ['./leaderboards.component.scss'],
})
export class LeaderboardsComponent {
  public navbarRouterLinks = [
    {
      name: GameTitleAbbreviation.FM8,
      codename: GameTitleCodeName.FM8,
      route: getLeaderboardRoute(GameTitle.FM8),
    },
    {
      name: GameTitleAbbreviation.FH5,
      codename: GameTitleCodeName.FH5,
      route: getLeaderboardRoute(GameTitle.FH5),
    },
  ];
}
