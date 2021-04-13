import { Component } from '@angular/core';
import { CommunityAppTools, createCommunityNavbarPath } from '@community-app/community-tool-list';
import { GameTitleCodeName } from '@models/enums';

/** The community messaging component. */
@Component({
  templateUrl: './community-messaging.component.html',
  styleUrls: ['./community-messaging.component.scss'],
})
export class CommunityMessagingComponent {
  public rootRouterLink = createCommunityNavbarPath(CommunityAppTools.MessagingPage).routerLink;
  public navbarRouterLinks = [
    {
      name: GameTitleCodeName.FH4,
      route: [...this.rootRouterLink, GameTitleCodeName.FH4.toLowerCase()],
    },
  ];
}
