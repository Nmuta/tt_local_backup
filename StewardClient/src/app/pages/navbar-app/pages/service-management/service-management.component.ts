import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameTitleCodeName } from '@models/enums';
import { createNavbarPath, NavbarTools } from '@navbar-app/navbar-tool-list';

/**
 *
 */
@Component({
  selector: 'app-service-management',
  templateUrl: './service-management.component.html',
  styleUrls: ['./service-management.component.scss'],
})
export class ServiceManagementComponent implements OnInit {
  public navbarRouterLinks = [];

  constructor(private readonly router: Router) {}

  /** Lifecycle hook */
  public ngOnInit(): void {
    const rootRouterLink = createNavbarPath(NavbarTools.ServiceManagementPage).routerLink;
    this.navbarRouterLinks = [
      {
        name: GameTitleCodeName.FH4,
        route: [...rootRouterLink, GameTitleCodeName.FH4.toLowerCase()],
      },
    ];
  }
}
