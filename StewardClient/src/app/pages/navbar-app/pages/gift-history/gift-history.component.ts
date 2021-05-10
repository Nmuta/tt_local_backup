import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { GameTitleCodeName } from '@models/enums';
import { createNavbarPath, NavbarTools } from '@navbar-app/navbar-tool-list';

/** The gift history page for the Navbar app. */
@Component({
  templateUrl: './gift-history.component.html',
  styleUrls: ['./gift-history.component.scss'],
})
export class GiftHistoryComponent implements OnInit {
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

  /** Lifecycle hook. */
  public ngOnInit(): void {
    // TODO: Make these permanent routes after respective titles are fully integrated.
    if (!environment.production) {
      this.navbarRouterLinks.unshift({
        name: GameTitleCodeName.FM8,
        route: [...this.rootRouterLink, GameTitleCodeName.FM8.toLowerCase()],
      });
      this.navbarRouterLinks.unshift({
        name: GameTitleCodeName.FH5,
        route: [...this.rootRouterLink, GameTitleCodeName.FH5.toLowerCase()],
      });
    }
  }
}
