import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { KustoQuery } from '@models/kusto';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

export type KustoQueryGroup = {
  category: string;
  items: KustoQuery[];
};
/** The query-results component. */
@Component({
  selector: 'kusto-query-results',
  templateUrl: './kusto-query-results.component.html',
  styleUrls: ['./kusto-query-results.component.scss'],
  providers: [HumanizePipe],
})
export class KustoQueryResultsComponent implements OnChanges {
  @Input() public results: unknown[];

  public resultKeys: string[];
  public downloadResults: string[][];

  public downloadIcon = faDownload;

  constructor(private readonly humanizePipe: HumanizePipe) {}

  /** Lifecycle hook. */
  public ngOnChanges(changes: SimpleChanges): void {
    this.resultKeys = [];
    this.downloadResults = [];

    if (!!changes?.results && this.results?.length > 0) {
      // Create the download results object based on the unknown[] of results
      this.resultKeys = Object.keys(this.results[0]);
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
