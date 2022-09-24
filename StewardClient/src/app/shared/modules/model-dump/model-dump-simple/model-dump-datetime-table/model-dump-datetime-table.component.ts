import { Component, Input } from '@angular/core';
import { DateTime } from 'luxon';
import { ObjectEntry } from '../../helpers';

/**
 * Renders a table of the given set of values as Date Times.
 */
@Component({
  selector: 'model-dump-datetime-table',
  templateUrl: './model-dump-datetime-table.component.html',
  styleUrls: ['./model-dump-datetime-table.component.scss'],
})
export class ModelDumpDatetimeTableComponent {
  /** REVIEW-COMMENT: Date times to render. */
  @Input() public values: ObjectEntry<DateTime>[];
}
