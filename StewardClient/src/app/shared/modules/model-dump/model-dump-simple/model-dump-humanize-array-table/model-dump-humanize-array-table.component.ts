import { Component, Input } from '@angular/core';
import { ObjectEntry } from '../../helpers';

/**
 * Renders a table of the given set of values passed thru the Humanize Filter (CamelCase to Space Case).
 */
@Component({
  selector: 'model-dump-humanize-array-table',
  templateUrl: './model-dump-humanize-array-table.component.html',
  styleUrls: ['./model-dump-humanize-array-table.component.scss'],
})
export class ModelDumpHumanizeArrayTableComponent {
  /** REVIEW-COMMENT: Values to renders. */
  @Input() public values: ObjectEntry<string[]>[];
}
