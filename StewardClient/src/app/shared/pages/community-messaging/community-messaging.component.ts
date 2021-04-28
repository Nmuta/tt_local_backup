import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameTitleCodeName } from '@models/enums';
import { generateSharedPageRouterLink } from '../generate-shared-router-link';
import { SharedNavbarTools } from '../shared-tool-list';

/** The community messaging component. */
@Component({
  templateUrl: './community-messaging.component.html',
  styleUrls: ['./community-messaging.component.scss'],
})
export class CommunityMessagingComponent implements OnInit {
  public navbarRouterLinks = [];

  constructor(private readonly router: Router) {}

  /** Lifecycle hook */
  public ngOnInit(): void {
    const rootRouterLink = generateSharedPageRouterLink(
      this.router,
      SharedNavbarTools.MessagingPage,
    );
    this.navbarRouterLinks = [
      {
        name: GameTitleCodeName.FH4,
        route: [...rootRouterLink, GameTitleCodeName.FH4.toLowerCase()],
      },
    ];
  }
}
