import { Component } from '@angular/core';
import { GameTitle } from '@models/enums';
import { UgcFiltersBaseComponent } from '../ugc-filters.base.component';

/** Component for Sunrise UGC filters. */
@Component({
  selector: 'sunrise-ugc-filters',
  templateUrl: './sunrise-ugc-filters.component.html',
  styleUrls: ['./sunrise-ugc-filters.component.scss'],
})
export class SunriseUgcFiltersComponent extends UgcFiltersBaseComponent {
  public gameTitle = GameTitle.FH4;
}
