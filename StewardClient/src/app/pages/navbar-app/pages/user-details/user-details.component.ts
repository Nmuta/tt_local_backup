import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base-component.component';
import { IdentityQueryBetaIntersection } from '@models/identity-query.model';
import { AugmentedCompositeIdentity } from '@navbar-app/components/player-selection-single/player-selection-base.component';
import { first } from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { createNavbarPath, NavbarTools } from '../../navbar-tool-list';

import { SunriseComponent } from './sunrise/sunrise.component';

/** User Details page. */
@Component({
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent extends BaseComponent implements OnInit {
  public gamertag: string;

  public lookupType: keyof IdentityQueryBetaIntersection;
  public lookupList: string[] = [];
  public identity: AugmentedCompositeIdentity;

  public sunriseRouterLink = [
    ...createNavbarPath(NavbarTools.UserDetailsPage).routerLink,
    'sunrise',
  ];

  public opusRouterLink = [...createNavbarPath(NavbarTools.UserDetailsPage).routerLink, 'opus'];

  public apolloRouterLink = [...createNavbarPath(NavbarTools.UserDetailsPage).routerLink, 'apollo'];

  public gravityRouterLink = [
    ...createNavbarPath(NavbarTools.UserDetailsPage).routerLink,
    'gravity',
  ];

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {
    super();
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
      if (params.has('lookupType')) {
        this.lookupType = params.get('lookupType') as keyof IdentityQueryBetaIntersection;
      }
      if (params.has('lookupName')) {
        if (params.get('lookupName')) {
          this.lookupList = [params.get('lookupName')];
        }
      }
      if (!this.lookupType) {
        this.lookupType = 'gamertag';
        this.lookupChange(true);
      }
    });
    this.route.queryParamMap.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
      this.gamertag = params.get('gamertag');
    });
  }

  /** Handles when the lookup list changes. */
  public lookupChange(replaceUrl: boolean = false): void {
    const name = first(this.lookupList) ?? '';
    this.router.navigate(
      [
        ...this.sunriseRouterLink,
      ],
      {
        queryParams: {
          lookupType: this.lookupType,
          lookupName: name,
        },
        replaceUrl: replaceUrl,
      }
    );
  }

  /** Handles the identity-found */
  public found(compositeIdentity: AugmentedCompositeIdentity): void {
    this.identity = compositeIdentity;
  }
}
