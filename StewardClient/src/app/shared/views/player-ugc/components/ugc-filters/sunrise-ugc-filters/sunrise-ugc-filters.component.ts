import { Component } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { UGCFiltersBaseComponent } from '../ugc-filters.base.component';

/** Component for Sunrise UGC filters. */
@Component({
  selector: 'sunrise-ugc-filters',
  templateUrl: './sunrise-ugc-filters.component.html',
  styleUrls: ['./sunrise-ugc-filters.component.scss'],
})
export class SunriseUGCFiltersComponent extends UGCFiltersBaseComponent {
  public gameTitle = GameTitleCodeName.FH4;
}
