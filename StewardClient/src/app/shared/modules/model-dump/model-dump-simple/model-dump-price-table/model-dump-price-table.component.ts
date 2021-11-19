import { Component, Input } from '@angular/core';
import BigNumber from 'bignumber.js';
import { ObjectEntry } from '../../helpers';

/**
 * Renders a table of the given set of values as if they were prices (leading $ and comma-grouped).
 */
@Component({
  selector: 'model-dump-price-table',
  templateUrl: './model-dump-price-table.component.html',
  styleUrls: ['./model-dump-price-table.component.scss'],
})
export class ModelDumpPriceTableComponent {
  @Input() public values: ObjectEntry<BigNumber>[];
}
