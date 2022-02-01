import { Component, OnInit } from '@angular/core';
import { GameTitle, GameTitleAbbreviation, GameTitleCodeName } from '@models/enums';

/**
 * Routed component which displays the Notifications toolbar.
 */
@Component({
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  public navbarRouterLinks = [];

  /** Lifecycle hook */
  public ngOnInit(): void {
    this.navbarRouterLinks = [
      {
        name: GameTitleAbbreviation.FH5,
        codename: GameTitleCodeName.FH5,
        route: ['.', GameTitle.FH5],
      },
      {
        name: GameTitleAbbreviation.FH4,
        codename: GameTitleCodeName.FH4,
        route: ['.', GameTitle.FH4],
      },
    ];
  }
}
