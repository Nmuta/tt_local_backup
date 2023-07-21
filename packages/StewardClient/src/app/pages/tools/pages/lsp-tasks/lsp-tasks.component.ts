import { Component, OnInit } from '@angular/core';
import { getLspTasksRoute } from '@helpers/route-links';
import { GameTitle, GameTitleAbbreviation } from '@models/enums';

/**
 * Routed component which displays the Lsp Task Management.
 */
@Component({
  templateUrl: './lsp-tasks.component.html',
  styleUrls: ['./lsp-tasks.component.scss'],
})
export class LspTasksComponent implements OnInit {
  public navbarRouterLinks = [];

  /** Lifecycle hook */
  public ngOnInit(): void {
    this.navbarRouterLinks = [
      {
        name: GameTitleAbbreviation.FM8,
        codename: GameTitle.FM8,
        route: getLspTasksRoute(GameTitle.FM8),
      },
      {
        name: GameTitleAbbreviation.FH5,
        codename: GameTitle.FH5,
        route: getLspTasksRoute(GameTitle.FH5),
      },
    ];
  }
}
