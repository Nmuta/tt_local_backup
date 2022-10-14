import { Component } from '@angular/core';
import { GameTitleAbbreviation, GameTitleCodeName } from '@models/enums';
import { PermAttributesService } from '@services/perm-attributes/perm-attributes.service';
import { find } from 'lodash';
import { BaseComponent } from './base.component';

export interface NavbarLink {
  name: GameTitleAbbreviation;
  codename: GameTitleCodeName;
  route: string[];
  disabled?: boolean;
}

/** A base component class. */
@Component({ template: '' })
export abstract class BaseNavbarComponent extends BaseComponent {
  /** All available navbar router links. This will be filtered based on user perm attributes. */
  public navbarRouterLinks: NavbarLink[] = [];
  public readonly disabledRouteTooltip = 'You do not have permission to access this title';

  constructor(private readonly permAttributesService: PermAttributesService) {
    super();

    this.permAttributesService.initializationGuard$.subscribe(() => {
      this.restrictTitlesBasedOnPerms();
    });
  }

  /** Removes titles from the navbarRouterLinks if the user does not have access to them. */
  private restrictTitlesBasedOnPerms(): void {
    const steelheadNavbar = find(this.navbarRouterLinks, { name: GameTitleAbbreviation.FM8 });
    if (!!steelheadNavbar && !this.permAttributesService.hasSteelheadAccess) {
      steelheadNavbar.disabled = true;
    }

    const apolloNavbar = find(this.navbarRouterLinks, { name: GameTitleAbbreviation.FM7 });
    if (!!apolloNavbar && !this.permAttributesService.hasApolloAccess) {
      apolloNavbar.disabled = true;
    }

    const woodstockNavbar = find(this.navbarRouterLinks, { name: GameTitleAbbreviation.FH5 });
    if (!!woodstockNavbar && !this.permAttributesService.hasWoodstockAccess) {
      woodstockNavbar.disabled = true;
    }

    const sunriseNavbar = find(this.navbarRouterLinks, { name: GameTitleAbbreviation.FH4 });
    if (!!sunriseNavbar && !this.permAttributesService.hasSunriseAccess) {
      sunriseNavbar.disabled = true;
    }
  }
}
