import { Component, OnInit } from '@angular/core';
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
        route: ['.', GameTitle.FM8.toLowerCase()],
      },
      {
        name: GameTitleAbbreviation.FH5,
        codename: GameTitle.FH5,
        route: ['.', GameTitle.FH5],
      },
      {
        name: GameTitleAbbreviation.FH4,
        codename: GameTitle.FH4,
        route: ['.', GameTitle.FH4],
      },
    ];
  }
}
