import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';
import { JsonTableResult } from '@models/json-table-result';

/** Displays json table results component. */
@Component({
  selector: 'json-table-results',
  templateUrl: './json-table-results.component.html',
  styleUrls: ['./json-table-results.component.scss'],
  providers: [HumanizePipe],
})
export class JsonTableResultsComponent implements OnChanges {
  @Input() public results: JsonTableResult<unknown>[];
  @Input() public downloadFilename: string = 'Unknown';

  public resultKeys: string[];
  public downloadResults: string[][];

  constructor(private readonly humanizePipe: HumanizePipe) {}

  /** Lifecycle hook. */
  public ngOnChanges(changes: SimpleChanges): void {
    this.resultKeys = [];
    this.downloadResults = [];

    if (!!changes?.results && this.results?.length > 0) {
      // Create the download results object based on the unknown[] of results
      this.resultKeys = Object.keys(this.results[0]).filter(key => key !== 'showErrorInTable'); // showErrorInTable is only to know what elements to hightlight warnings for
      this.downloadResults[0] = this.resultKeys.map(key => this.humanizePipe.transform(key));
      for (const result of this.results) {
        const resultRow = [];
        for (const key of this.resultKeys) {
          resultRow.push(result[key]);
        }

        this.downloadResults[this.downloadResults.length] = resultRow;
      }
    }
  }
}
