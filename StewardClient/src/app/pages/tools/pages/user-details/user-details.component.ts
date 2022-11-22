import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { IdentityQueryBetaIntersection } from '@models/identity-query.model';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { Store } from '@ngxs/store';
import { first } from 'lodash';
import { filter, takeUntil } from 'rxjs/operators';
import { GameTitleCodeName } from '@models/enums';
import { renderDelay } from '@helpers/rxjs';
import { SpecialIdentity } from '@models/special-identity';
import { Subject } from 'rxjs';

/** User Details page. */
@Component({
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent extends BaseComponent {
  public lookupType: keyof IdentityQueryBetaIntersection;
  public lookupList: string[] = [];
  public identity: AugmentedCompositeIdentity;
  public specialIdentitiesAllowed: SpecialIdentity[];

  public gameTitleCodeName = GameTitleCodeName;

  /** Emitted when the identity changes. */
  public identity$ = new Subject<AugmentedCompositeIdentity>();

  /** The only lookup name. */
  public get lookupName(): string {
    return first(this.lookupList) ?? '';
  }

  public generalRouterLink = ['.', 'general'];
  public woodstockRouterLink = ['.', 'woodstock'];
  public steelheadRouterLink = ['.', 'steelhead'];
  public sunriseRouterLink = ['.', 'sunrise'];
  public opusRouterLink = ['.', 'opus'];
  public apolloRouterLink = ['.', 'apollo'];

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
  public get apolloTooltip(): string {
    if (!this.identity) {
      return null;
    }

    if (this.identity?.extra?.hasApollo) {
      return null;
    }

    return `Player ${first(this.lookupList)} does not have a Apollo account`;
  }

  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    router: Router,
  ) {
    super();

    router.events
      .pipe(
        renderDelay(),
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        window.dispatchEvent(new Event('resize'));
      });
  }

  /** Handles the identity-found */
  public found(compositeIdentity: AugmentedCompositeIdentity): void {
    this.identity = compositeIdentity;
    this.identity$.next(compositeIdentity);
  }
}
