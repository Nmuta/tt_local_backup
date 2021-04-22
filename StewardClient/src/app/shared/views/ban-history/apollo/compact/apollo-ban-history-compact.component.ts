import { Component, OnChanges } from '@angular/core';
import { ApolloBanHistoryComponent } from '../apollo-ban-history.component';

/** Retreives and displays Apollo Ban history by XUID. Compact. */
@Component({
  selector: 'apollo-ban-history-compact',
  templateUrl: './apollo-ban-history-compact.component.html',
  styleUrls: ['./apollo-ban-history-compact.component.scss'],
})
export class ApolloBanHistoryCompactComponent
  extends ApolloBanHistoryComponent
  implements OnChanges {}
