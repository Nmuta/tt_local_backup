import { Component } from '@angular/core';
import { GameTitle, PegasusProjectionSlot } from '@models/enums';
import { UgcFiltersBaseComponent } from '../ugc-filters.base.component';

/** Component for Steelhead UGC filters. */
@Component({
  selector: 'steelhead-ugc-filters',
  templateUrl: './steelhead-ugc-filters.component.html',
  styleUrls: ['./steelhead-ugc-filters.component.scss'],
})
export class SteelheadUgcFiltersComponent extends UgcFiltersBaseComponent {
  public gameTitle = GameTitle.FM8;
  public PegasusProjectionSlot = PegasusProjectionSlot;
}
