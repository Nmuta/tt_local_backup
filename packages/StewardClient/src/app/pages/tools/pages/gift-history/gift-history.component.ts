import { Component } from '@angular/core';
import { getGiftHistoryRoute } from '@helpers/route-links';
import { GameTitleCodeName, GameTitleAbbreviation, GameTitle } from '@models/enums';

/** The gift history page for the Navbar app. */
@Component({
  templateUrl: './gift-history.component.html',
  styleUrls: ['./gift-history.component.scss'],
})
export class GiftHistoryComponent {
  public navbarRouterLinks = [
    {
      name: GameTitleAbbreviation.FM8,
      codename: GameTitleCodeName.FM8,
      route: getGiftHistoryRoute(GameTitle.FM8),
    },
    {
      name: GameTitleAbbreviation.FH5,
      codename: GameTitleCodeName.FH5,
      route: getGiftHistoryRoute(GameTitle.FH5),
    },
    {
      name: GameTitleAbbreviation.FH4,
      codename: GameTitleCodeName.FH4,
      route: getGiftHistoryRoute(GameTitle.FH4),
    },
    {
      name: GameTitleAbbreviation.FM7,
      codename: GameTitleCodeName.FM7,
      route: getGiftHistoryRoute(GameTitle.FM7),
    },
  ];
}
