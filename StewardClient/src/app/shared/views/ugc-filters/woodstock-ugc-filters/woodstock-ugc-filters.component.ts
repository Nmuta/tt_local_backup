import { Component } from '@angular/core';
import { GameTitle } from '@models/enums';
import { UgcFiltersBaseComponent } from '../ugc-filters.base.component';

/** Component for Woodstock UGC filters. */
@Component({
  selector: 'woodstock-ugc-filters',
  templateUrl: './woodstock-ugc-filters.component.html',
  styleUrls: ['./woodstock-ugc-filters.component.scss'],
})
export class WoodstockUgcFiltersComponent extends UgcFiltersBaseComponent {
  public gameTitle = GameTitle.FH5;
}
