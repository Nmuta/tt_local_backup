import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { environment } from '@environments/environment';
import { IdentityQueryBetaIntersection } from '@models/identity-query.model';
import { AugmentedCompositeIdentity } from '@navbar-app/components/player-selection/player-selection-base.component';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { first } from 'lodash';
import { filter, takeUntil } from 'rxjs/operators';
import { createNavbarPath, NavbarTools } from '@navbar-app/navbar-tool-list';

/** User Details page. */
@Component({
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent extends BaseComponent implements OnInit {
  public isProduction: boolean;
  public gamertag: string;

  public lookupType: keyof IdentityQueryBetaIntersection;
  public lookupList: string[] = [];
  public identity: AugmentedCompositeIdentity;

  /** The only lookup name. */
  public get lookupName(): string {
    return first(this.lookupList) ?? '';
  }

  public woodstockRouterLink = [
    ...createNavbarPath(NavbarTools.UserDetailsPage).routerLink,
    'woodstock',
  ];

  public steelheadRouterLink = [
    ...createNavbarPath(NavbarTools.UserDetailsPage).routerLink,
    'steelhead',
  ];

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
  public get woodstockTooltip(): string {
    if (!this.identity) {
      return null;
    }
    if (this.identity?.extra?.hasWoodstock) {
      return null;
    }
    return `Player ${first(this.lookupList)} does not have a Woodstock account`;
  }

  /** Generates a nav tooltip */
  public get steelheadTooltip(): string {
    if (!this.identity) {
      return null;
    }
    if (this.identity?.extra?.hasSteelhead) {
      return null;
    }
    return `Player ${first(this.lookupList)} does not have a Steelhead account`;
  }

  /** Generates a nav tooltip */
  public get sunriseTooltip(): string {
    if (!this.identity) {
      return null;
    }
    if (this.identity?.extra?.hasSunrise) {
      return null;
    }
    return `Player ${first(this.lookupList)} does not have a Sunrise account`;
  }

  /** Generates a nav tooltip */
  public get opusTooltip(): string {
    if (!this.identity) {
      return null;
    }
    if (this.identity?.extra?.hasOpus) {
      return null;
    }
    return `Player ${first(this.lookupList)} does not have an Opus account`;
  }

  /** Generates a nav tooltip */
  public get gravityTooltip(): string {
    if (!this.identity) {
      return null;
    }
    if (this.identity?.extra?.hasGravity) {
      return null;
    }
    return `Player ${first(this.lookupList)} does not have a Gravity account`;
  }

  /** Generates a nav tooltip */
  public get apolloTooltip(): string {
    if (!this.identity) {
      return null;
    }
    if (this.identity?.extra?.hasApollo) {
      return null;
    }
    return `Player ${first(this.lookupList)} does not have a Apollo account`;
  }

  constructor(private readonly store: Store, private readonly route: ActivatedRoute) {
    super();
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    // TODO: Remove variable when steelhead becomes a permanent route in the app.
    this.isProduction = environment.production;
    this.route.queryParamMap
      .pipe(
        takeUntil(this.onDestroy$),
        filter(params => {
          const lookupName = params.get('lookupName');
          const hasLookupList = !!this.lookupList[0]?.toString();
          if (!lookupName && hasLookupList) {
            this.lookupChange(true);
            return false;
          }

          if (this.lookupList?.length > 0) {
            return lookupName?.trim() !== this.lookupList[0].toString();
          }

          return true;
        }),
      )
      .subscribe(params => {
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
    this.store.dispatch(
      new Navigate([], null, {
        queryParams: {
          lookupType: this.lookupType,
          lookupName: this.lookupName,
        },
        replaceUrl: replaceUrl,
      }),
    );
  }

  /** Handles the identity-found */
  public found(compositeIdentity: AugmentedCompositeIdentity): void {
    this.identity = compositeIdentity;
    this.lookupChange(false);
  }
}
