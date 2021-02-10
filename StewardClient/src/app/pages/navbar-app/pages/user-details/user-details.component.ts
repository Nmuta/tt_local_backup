import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@components/base-component/base-component.component';
import { IdentityQueryBetaIntersection } from '@models/identity-query.model';
import { AugmentedCompositeIdentity } from '@navbar-app/components/player-selection-single/player-selection-base.component';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { first } from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { createNavbarPath, NavbarTools } from '../../navbar-tool-list';

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

  /** Generates a nav tooltip */
  public get sunriseTooltip(): string {
    if (!this.identity) {
      return null;
    }
    if (this.identity.extra.hasSunrise) {
      return null;
    }
    return `Player ${first(this.lookupList)} does not have a Sunrise account`;
  }

  /** Generates a nav tooltip */
  public get opusTooltip(): string {
    if (!this.identity) {
      return null;
    }
    if (this.identity.extra.hasOpus) {
      return null;
    }
    return `Player ${first(this.lookupList)} does not have an Opus account`;
  }

  /** Generates a nav tooltip */
  public get gravityTooltip(): string {
    if (!this.identity) {
      return null;
    }
    if (this.identity.extra.hasGravity) {
      return null;
    }
    return `Player ${first(this.lookupList)} does not have a Gravity account`;
  }

  /** Generates a nav tooltip */
  public get apolloTooltip(): string {
    if (!this.identity) {
      return null;
    }
    if (this.identity.extra.hasApollo) {
      return null;
    }
    return `Player ${first(this.lookupList)} does not have a Apollo account`;
  }

  constructor(private readonly store: Store, private readonly route: ActivatedRoute) {
    super();
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
      if (params.has('lookupType')) {
        this.lookupType = params.get('lookupType') as keyof IdentityQueryBetaIntersection;
      }
      if (params.has('lookupName')) {
        const lookupName = params.get('lookupName');
        if (!!lookupName.trim()) {
          this.lookupList = [lookupName];
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
    this.store.dispatch(
      new Navigate([...this.sunriseRouterLink], null, {
        queryParams: {
          lookupType: this.lookupType,
          lookupName: name,
        },
        replaceUrl: replaceUrl,
      }),
    );
  }

  /** Handles the identity-found */
  public found(compositeIdentity: AugmentedCompositeIdentity): void {
    this.identity = compositeIdentity;
  }
}
