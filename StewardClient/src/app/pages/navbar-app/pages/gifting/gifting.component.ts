import { Component } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { createNavbarPath, NavbarTools } from 'app/pages/navbar-app/navbar-tool-list';

/** The gifting page for the Navbar app. */
@Component({
  templateUrl: './gifting.component.html',
  styleUrls: ['./gifting.component.scss'],
})
export class GiftingComponent {
  public rootRouterLink = createNavbarPath(NavbarTools.GiftingPage).routerLink;
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
