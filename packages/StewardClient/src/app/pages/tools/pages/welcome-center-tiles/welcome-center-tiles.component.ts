import { Component } from '@angular/core';
import { getWelcomeCenterTilesRoute } from '@helpers/route-links';
import { GameTitle, GameTitleAbbreviation, GameTitleCodeName } from '@models/enums';

/** Displays the welcome center tiles tool. */
@Component({
  templateUrl: './welcome-center-tiles.component.html',
  styleUrls: ['./welcome-center-tiles.component.scss'],
})
export class WelcomeCenterTilesComponent {
  public navbarRouterLinks = [
    {
      name: GameTitleAbbreviation.FM8,
      codename: GameTitleCodeName.FM8,
      route: getWelcomeCenterTilesRoute(GameTitle.FM8),
    },
  ];
}
