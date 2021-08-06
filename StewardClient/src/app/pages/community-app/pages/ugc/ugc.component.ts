import { Component, OnInit } from '@angular/core';
import { CommunityAppTools, createCommunityNavbarPath } from '@community-app/community-tool-list';
import { environment } from '@environments/environment';
import { GameTitleCodeName } from '@models/enums';

/** Navbar component to display user generated content component. */
@Component({
  templateUrl: './ugc.component.html',
  styleUrls: ['./ugc.component.scss'],
})
export class UGCComponent implements OnInit {
  public rootRouterLink = createCommunityNavbarPath(CommunityAppTools.UGCPage).routerLink;
  public navbarRouterLinks = [
    {
      name: GameTitleCodeName.FH4,
      route: [...this.rootRouterLink, GameTitleCodeName.FH4.toLowerCase()],
    },
  ];

  /** Lifecycle hook. */
  public ngOnInit(): void {
    // TODO: Make these into permanent routes after respective titles are fully integrated.
    if (!environment.production) {
      this.navbarRouterLinks.unshift({
        name: GameTitleCodeName.FM8,
        route: [...this.rootRouterLink, GameTitleCodeName.FM8.toLowerCase()],
      });
      this.navbarRouterLinks.unshift({
        name: GameTitleCodeName.FH5,
        route: [...this.rootRouterLink, GameTitleCodeName.FH5.toLowerCase()],
      });
    }
  }
}
