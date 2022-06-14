import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitleCodeName } from '@models/enums';
import { UgcSearchFilters } from '@models/ugc-filters';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';

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
}
