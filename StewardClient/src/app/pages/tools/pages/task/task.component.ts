import { Component, OnInit } from '@angular/core';
import { getTasksRoute } from '@helpers/route-links';
import { GameTitle, GameTitleAbbreviation } from '@models/enums';

/**
 * Routed component which displays the Task Management.
 */
@Component({
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  public navbarRouterLinks = [];

  /** Lifecycle hook */
  public ngOnInit(): void {
    this.navbarRouterLinks = [
      {
        name: GameTitleAbbreviation.FM8,
        codename: GameTitle.FM8,
        route: getTasksRoute(GameTitle.FM8),
      },
      {
        name: GameTitleAbbreviation.FH5,
        codename: GameTitle.FH5,
        route: getTasksRoute(GameTitle.FH5),
      },
    ];
  }
}
