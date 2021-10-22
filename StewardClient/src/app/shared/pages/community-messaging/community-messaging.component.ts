import { Component, OnInit } from '@angular/core';
import { GameTitleCodeName, GameTitleAbbreviation } from '@models/enums';

/** The community messaging component. */
@Component({
  templateUrl: './community-messaging.component.html',
  styleUrls: ['./community-messaging.component.scss'],
})
export class CommunityMessagingComponent implements OnInit {
  public navbarRouterLinks = [];

  /** Lifecycle hook */
  public ngOnInit(): void {
    this.navbarRouterLinks = [
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
    ];
  }
}
