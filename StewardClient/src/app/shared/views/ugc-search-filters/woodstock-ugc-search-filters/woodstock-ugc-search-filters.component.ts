import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { UgcSearchFilters } from '@models/ugc-filters';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';

/** Component for Woodstock UGC search filters. */
@Component({
  selector: 'woodstock-ugc-search-filters',
  templateUrl: 'woodstock-ugc-search-filters.component.html',
  styleUrls: ['woodstock-ugc-search-filters.component.scss'],
})
export class WoodstockUgcSearchFiltersComponent extends BaseComponent {
  @Output() changes = new EventEmitter<UgcSearchFilters>();
  @Input() public searchMonitor: ActionMonitor;
  public gameTitle = GameTitleCodeName.FH5;

  /** Produces a rejection message from a given identity, if it is rejected. */
  public identityRejectionFn(identity: AugmentedCompositeIdentity): string {
    if (!identity?.extra?.hasWoodstock) {
      return 'Player does not have a woodstock account at the selected endpoint. Player will be ignored.';
    }

    return null;
  }

  /** Player identity selected */
  public playerIdentityFound(newIdentity: AugmentedCompositeIdentity): IdentityResultAlpha {
    if (newIdentity?.woodstock?.error) {
      return null;
    }

    return newIdentity?.woodstock;
  }
}
