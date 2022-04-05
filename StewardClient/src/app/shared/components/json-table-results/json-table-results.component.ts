import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';
import { JsonTableResult } from '@models/json-table-result';

type TemplateNames =
  | 'unknown'
  | 'xuid'
  | 'gamertag'
  | 'xuid-direct'
  | 'gamertag-direct'
  | 'datetime'
  | 'auctionId';

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
  private templateCache = new Map<JsonTableResult<unknown>, Map<string, TemplateNames>>();

  constructor(private readonly humanizePipe: HumanizePipe) {}

  /** Lifecycle hook. */
  public ngOnChanges(changes: SimpleChanges): void {
    this.resultKeys = [];
    this.downloadResults = [];
    this.templateCache = new Map<JsonTableResult<unknown>, Map<string, TemplateNames>>();

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

  /** Produces the title for row, if it exists. */
  public getTitle(row: JsonTableResult<unknown>): string {
    return row['Title'];
  }

  /** Returns a cached template determined by the row and column contents. */
  public determineTemplate(row: JsonTableResult<unknown>, column: string): TemplateNames {
    const cacheResult = this.templateCache.get(row)?.get(column);
    if (cacheResult) {
      return cacheResult;
    }

    const template = this.determineTemplateInternal(row, column);
    if (!this.templateCache.has(row)) {
      this.templateCache.set(row, new Map<string, TemplateNames>());
    }

    this.templateCache.get(row).set(column, template);

    return template;
  }

  private determineTemplateInternal(row: JsonTableResult<unknown>, column: string): TemplateNames {
    if (column.toLowerCase().endsWith('timestamp')) {
      return 'datetime';
    }

    // these templates additionally require a title to produce a link
    if (this.getTitle(row)) {
      if (column.toLowerCase().endsWith('xuid')) {
        return 'xuid-direct';
      }

      if (column.toLowerCase().endsWith('gamertag')) {
        return 'gamertag-direct';
      }

      if (column.toLowerCase().endsWith('auctionid')) {
        return 'auctionId';
      }
    } else {
      if (column.toLowerCase().endsWith('xuid')) {
        return 'xuid';
      }

      if (column.toLowerCase().endsWith('gamertag')) {
        return 'gamertag';
      }
    }

    return 'unknown';
  }
}
