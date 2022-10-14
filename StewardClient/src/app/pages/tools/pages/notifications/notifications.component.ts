import { Component, OnInit } from '@angular/core';
import { getMessagingRoute } from '@helpers/route-links';
import { GameTitle, GameTitleAbbreviation } from '@models/enums';

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
        name: GameTitleAbbreviation.FM8,
        codename: GameTitle.FM8,
        route: getMessagingRoute(GameTitle.FM8),
      },
      {
        name: GameTitleAbbreviation.FH5,
        codename: GameTitle.FH5,
        route: getMessagingRoute(GameTitle.FH5),
      },
      {
        name: GameTitleAbbreviation.FH4,
        codename: GameTitle.FH4,
        route: getMessagingRoute(GameTitle.FH4),
      },
    ];
  }
}
