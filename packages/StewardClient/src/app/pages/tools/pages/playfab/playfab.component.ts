import { Component } from '@angular/core';
import { getPlayFabRoute } from '@helpers/route-links';
import { GameTitle, GameTitleAbbreviation, GameTitleCodeName } from '@models/enums';

/** Displays the Steward PlayFab tool. */
@Component({
  templateUrl: './playfab.component.html',
  styleUrls: ['./playfab.component.scss'],
})
export class PlayFabComponent {
  public navbarRouterLinks = [
    {
      name: GameTitleAbbreviation.Forte,
      codename: GameTitleCodeName.Forte,
      route: getPlayFabRoute(GameTitle.Forte),
    },
    {
      name: GameTitleAbbreviation.FH5,
      codename: GameTitleCodeName.FH5,
      route: getPlayFabRoute(GameTitle.FH5),
    },
  ];
}
