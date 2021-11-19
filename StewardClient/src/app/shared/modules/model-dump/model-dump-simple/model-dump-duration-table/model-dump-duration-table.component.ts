import { Component, Input } from '@angular/core';
import { Duration } from 'luxon';
import { ObjectEntry } from '../../helpers';

/**
 * Renders a table of the given set of values as Durations.
 */
@Component({
  selector: 'model-dump-duration-table',
  templateUrl: './model-dump-duration-table.component.html',
  styleUrls: ['./model-dump-duration-table.component.scss'],
})
export class ModelDumpDurationTableComponent {
  @Input() public values: ObjectEntry<Duration>[];
}
