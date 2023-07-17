import { Component } from '@angular/core';
import { WoodstockBanHistoryComponent } from '../woodstock-ban-history.component';

/** Retreives and displays Apollo Ban history by XUID. */
@Component({
  selector: 'woodstock-ban-history-compact',
  templateUrl: '../../ban-history-compact.component.html',
  styleUrls: ['../../ban-history-compact.component.scss'],
})
export class WoodstockBanHistoryCompactComponent extends WoodstockBanHistoryComponent {}
