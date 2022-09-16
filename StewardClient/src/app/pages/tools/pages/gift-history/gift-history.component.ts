import { Component } from '@angular/core';
import { GameTitleCodeName, GameTitleAbbreviation } from '@models/enums';

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
      route: ['.', GameTitleCodeName.FM8.toLowerCase()],
    },
    {
      name: GameTitleAbbreviation.FH5,
      codename: GameTitleCodeName.FH5,
      route: ['.', GameTitleCodeName.FH5.toLowerCase()],
    },
    {
      name: GameTitleAbbreviation.FH4,
      codename: GameTitleCodeName.FH4,
      route: ['.', GameTitleCodeName.FH4.toLowerCase()],
    },
    {
      name: GameTitleAbbreviation.FM7,
      codename: GameTitleCodeName.FM7,
      route: ['.', GameTitleCodeName.FM7.toLowerCase()],
    },
  ];
}
