import { Component, OnInit } from '@angular/core';
import { GameTitle } from '@models/enums';

@Component({
  //selector: 'notification-management',
  templateUrl: './notification-management.component.html',
  styleUrls: ['./notification-management.component.scss'],
})
/**
 *
 */
export class NotificationManagementComponent implements OnInit {
  public navbarRouterLinks = [];

  /** Lifecycle hook */
  public ngOnInit(): void {
    this.navbarRouterLinks = [
      {
        name: GameTitle.FH5,
        route: ['.', GameTitle.FH5],
      },
      {
        name: GameTitle.FH4,
        route: ['.', GameTitle.FH4],
      },
    ];
  }
}
