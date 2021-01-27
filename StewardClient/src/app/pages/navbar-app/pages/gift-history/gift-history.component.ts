import { Component } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { createNavbarPath, NavbarTools } from 'app/pages/navbar-app/navbar-tool-list';

/** The gift history page for the Navbar app. */
@Component({
  templateUrl: './gift-history.component.html',
  styleUrls: ['./gift-history.component.scss']
})

export class GiftHistoryComponent {
  public rootRouterLink = createNavbarPath(NavbarTools.GiftHistoryPage).routerLink;
  public navbarRouterLinks = [
    {
      name: GameTitleCodeName.Street,
      route: [...this.rootRouterLink, GameTitleCodeName.Street.toLowerCase()],
    },
    {
      name: GameTitleCodeName.FH4,
      route: [...this.rootRouterLink, GameTitleCodeName.FH4.toLowerCase()],
    },
    {
      name: GameTitleCodeName.FM7,
      route: [...this.rootRouterLink, GameTitleCodeName.FM7.toLowerCase()],
    },
  ];
}
