import { Component } from '@angular/core';
import { SteelheadBanHistoryComponent } from '../steelhead-ban-history.component';

/** Retreives and displays Steelhead Ban history by XUID. Compact. */
@Component({
  selector: 'steelhead-ban-history-compact',
  templateUrl: '../../ban-history-compact.component.html',
  styleUrls: ['../../ban-history-compact.component.scss'],
})
export class SteelheadBanHistoryCompactComponent extends SteelheadBanHistoryComponent {}
