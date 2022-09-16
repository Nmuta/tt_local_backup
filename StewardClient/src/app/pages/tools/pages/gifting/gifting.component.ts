import { Component } from '@angular/core';
import { GameTitleCodeName, GameTitleAbbreviation } from '@models/enums';

/** The gifting page for the Navbar app. */
@Component({
  templateUrl: './gifting.component.html',
  styleUrls: ['./gifting.component.scss'],
})
export class GiftingComponent {
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
