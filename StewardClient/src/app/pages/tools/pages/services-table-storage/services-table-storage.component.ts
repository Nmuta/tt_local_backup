import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { IdentityQueryBetaIntersection } from '@models/identity-query.model';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { first } from 'lodash';
import { filter, takeUntil } from 'rxjs/operators';
import { GameTitleCodeName, GameTitle } from '@models/enums';
import { renderDelay } from '@helpers/rxjs';
import { SpecialIdentity } from '@models/special-identity';
import { Subject } from 'rxjs';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { InvalidPermActionType } from '@shared/modules/permissions/directives/permission-attribute.base.directive';

/** User Details page. */
@Component({
  templateUrl: './services-table-storage.component.html',
  styleUrls: ['./services-table-storage.component.scss'],
})
export class ServicesTableStorageComponent extends BaseComponent {
  public lookupType: keyof IdentityQueryBetaIntersection;
  public lookupList: string[] = [];
  public identity: AugmentedCompositeIdentity;
  public specialIdentitiesAllowed: SpecialIdentity[];

  public InvalidPermActionType = InvalidPermActionType;
  public PermAttributeName = PermAttributeName;
  public GameTitle = GameTitle;
  public gameTitleCodeName = GameTitleCodeName;

  /** Emitted when the identity changes. */
  public identity$ = new Subject<AugmentedCompositeIdentity>();

  /** The only lookup name. */
  public get lookupName(): string {
    return first(this.lookupList) ?? '';
  }

  public woodstockRouterLink = ['.', 'woodstock'];
  public steelheadRouterLink = ['.', 'steelhead'];

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

  constructor(router: Router) {
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
