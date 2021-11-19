import { Component, Input } from '@angular/core';
import BigNumber from 'bignumber.js';
import { ObjectEntry } from '../../helpers';

/**
 * Renders a table of the given set of values as if they were large numbers (comma-grouped).
 */
@Component({
  selector: 'model-dump-number-table',
  templateUrl: './model-dump-number-table.component.html',
  styleUrls: ['./model-dump-number-table.component.scss'],
})
export class ModelDumpNumberTableComponent {
  @Input() public values: ObjectEntry<BigNumber>[];
}
