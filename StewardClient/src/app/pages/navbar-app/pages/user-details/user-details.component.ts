import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base-component.component';
import { takeUntil } from 'rxjs/operators';
import { createNavbarPath, NavbarTools } from '../../navbar-tool-list';

import { SunriseComponent } from './sunrise/sunrise.component';

/** User Details page. */
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent extends BaseComponent implements OnInit {
  public gamertag: string;

  public sunriseRouterLink = [
    ...createNavbarPath(NavbarTools.UserDetailsPage).routerLink,
    'sunrise',
  ];

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {
    super();
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
      this.gamertag = params.get('gamertag');
    });
  }

  /** Update the routed component. */
  public navigate(): void {
    const childComponent = this.route.snapshot.firstChild.component;
    if (childComponent === SunriseComponent) {
      this.router.navigate(this.sunriseRouterLink, {
        queryParams: { gamertag: this.gamertag },
      });
    }
  }
}
