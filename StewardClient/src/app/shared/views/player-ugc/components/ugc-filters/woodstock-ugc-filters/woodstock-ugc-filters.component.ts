import { Component } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { UGCFiltersBaseComponent } from '../ugc-filters.base.component';

/** Component for Woodstock UGC filters. */
@Component({
  selector: 'woodstock-ugc-filters',
  templateUrl: './woodstock-ugc-filters.component.html',
  styleUrls: ['./woodstock-ugc-filters.component.scss'],
})
export class WoodstockUGCFiltersComponent extends UGCFiltersBaseComponent {
  public gameTitle = GameTitleCodeName.FH5;
}
