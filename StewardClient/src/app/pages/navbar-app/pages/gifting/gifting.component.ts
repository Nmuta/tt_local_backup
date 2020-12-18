import { Component } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { createNavbarPath, NavbarTools } from 'app/pages/navbar-app/navbar-tool-list';

/** The gifting page for the Navbar app. */
@Component({
  templateUrl: './gifting.component.html',
  styleUrls: ['./gifting.component.scss'],
})
export class GiftingComponent {
  public rootRouterLink = createNavbarPath(NavbarTools.GiftingPage).routerLink;
  public navbarRouterLinks = [
    {name: GameTitleCodeName.Street, route: [...this.rootRouterLink, GameTitleCodeName.Street.toLowerCase()]},
    {name: GameTitleCodeName.FH4, route: [...this.rootRouterLink, GameTitleCodeName.FH4.toLowerCase()]},
    {name: GameTitleCodeName.FM7, route: [...this.rootRouterLink, GameTitleCodeName.FM7.toLowerCase()]},
    {name: GameTitleCodeName.FH3, route: [...this.rootRouterLink, GameTitleCodeName.FH3.toLowerCase()]},
  ];

  constructor(private readonly store: Store) { }

  /** Logic when a new game title is selected */
  public newGameTitleSelected(title: GameTitleCodeName): void {
    this.store.dispatch(new Navigate(['/', NavbarTools.GiftingPage.path, title]));
  }
}
