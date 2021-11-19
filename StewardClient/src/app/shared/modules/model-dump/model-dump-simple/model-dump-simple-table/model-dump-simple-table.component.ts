import { Component, Input } from '@angular/core';
import { ObjectEntry } from '../../helpers';

/**
 * Renders a table of the given set of values, with no output processing.
 */
@Component({
  selector: 'model-dump-simple-table',
  templateUrl: './model-dump-simple-table.component.html',
  styleUrls: ['./model-dump-simple-table.component.scss'],
})
export class ModelDumpSimpleTableComponent {
  @Input() public values: ObjectEntry<unknown>[];
}
