import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommunityAppTools, createCommunityNavbarPath } from '@community-app/community-tool-list';
import { environment } from '@environments/environment';
import { GameTitleCodeName } from '@models/enums';
import { createNavbarPath, NavbarTools } from 'app/pages/navbar-app/navbar-tool-list';

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
    const pathArr = this.router.url.split('/')?.filter(x => !!x && x !== '');
    const firstRouteInPath = pathArr[0];

    let rootRouterLink: string[] = [];
    switch (firstRouteInPath) {
      case 'support':
        rootRouterLink = createNavbarPath(NavbarTools.GiftingPage).routerLink;
        break;
      case 'community':
        rootRouterLink = createCommunityNavbarPath(CommunityAppTools.GiftingPage).routerLink;
        break;
      default:
        throw new Error('App is not setup to use the gifting feature.');
    }

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
