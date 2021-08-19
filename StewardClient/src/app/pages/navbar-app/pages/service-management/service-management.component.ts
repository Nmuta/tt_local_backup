import { Component, OnInit } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';

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

  /** Lifecycle hook */
  public ngOnInit(): void {
    this.navbarRouterLinks = [
      {
        name: GameTitleCodeName.FH4,
        route: ['.', GameTitleCodeName.FH4.toLowerCase()],
      },
    ];
  }
}
