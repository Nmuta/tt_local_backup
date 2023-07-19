import { Component, Input } from '@angular/core';
import { ObjectEntry } from '../../helpers';

/**
 * Renders a table of the given set of values passed thru the Humanize Filter (CamelCase to Space Case).
 */
@Component({
  selector: 'model-dump-humanize-table',
  templateUrl: './model-dump-humanize-table.component.html',
  styleUrls: ['./model-dump-humanize-table.component.scss'],
})
export class ModelDumpHumanizeTableComponent {
  /** REVIEW-COMMENT: Values to render. */
  @Input() public values: ObjectEntry<string>[];
}
