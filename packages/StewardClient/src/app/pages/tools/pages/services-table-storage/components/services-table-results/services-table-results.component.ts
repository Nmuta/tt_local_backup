import { Component, Input } from '@angular/core';
import { JsonTableResult } from '@models/json-table-result';
import { MatColumnDef } from '@angular/material/table';
import { state, style, trigger } from '@angular/animations';

export const SERVICES_TABLE_COLUMNS = ['expandButton', 'rowKey', 'partitionKey', 'timestampUtc'];

/** Displays services table results component. */
@Component({
  selector: 'services-table-results',
  templateUrl: './services-table-results.component.html',
  styleUrls: ['./services-table-results.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
    ]),
  ],
})
export class ServicesTableResultsComponent {
  /** Table lookup results to display. */
  @Input() public results: JsonTableResult<unknown>[];

  public columnsToDisplay: string[] = SERVICES_TABLE_COLUMNS;
  public expandedElement: MatColumnDef;
}
