import { Component, OnChanges } from '@angular/core';
import { SunriseBanHistoryComponent } from '../sunrise-ban-history.component';

/** Retreives and displays Apollo Ban history by XUID. */
@Component({
  selector: 'sunrise-ban-history-compact',
  templateUrl: '../../ban-history-compact.component.html',
  styleUrls: ['../../ban-history-compact.component.scss'],
})
export class SunriseBanHistoryCompactComponent
  extends SunriseBanHistoryComponent
  implements OnChanges {}
