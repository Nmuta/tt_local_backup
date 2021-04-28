import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { GameTitleCodeName } from '@models/enums';
import { generateSharedPageRouterLink } from '../generate-shared-router-link';
import { SharedNavbarTools } from '../shared-tool-list';

/** The gifting page for the Navbar app. */
@Component({
  templateUrl: './gifting.component.html',
  styleUrls: ['./gifting.component.scss'],
})
export class GiftingComponent implements OnInit {
  public navbarRouterLinks = [];

  constructor(private readonly router: Router) {}

  /** Lifecycle hook */
  public ngOnInit(): void {
    const rootRouterLink = generateSharedPageRouterLink(this.router, SharedNavbarTools.GiftingPage);
    this.navbarRouterLinks = [
      {
        name: GameTitleCodeName.Street,
        route: [...rootRouterLink, GameTitleCodeName.Street.toLowerCase()],
      },
      {
        name: GameTitleCodeName.FH4,
        route: [...rootRouterLink, GameTitleCodeName.FH4.toLowerCase()],
      },
      {
        name: GameTitleCodeName.FM7,
        route: [...rootRouterLink, GameTitleCodeName.FM7.toLowerCase()],
      },
    ];

    // TODO: Make this a permanent route after Steelhead is fully integrated.
    if (!environment.production) {
      this.navbarRouterLinks.unshift({
        name: GameTitleCodeName.FM8,
        route: [...rootRouterLink, GameTitleCodeName.FM8.toLowerCase()],
      });
    }
  }
}
