import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';
import { JsonTableResult } from '@models/json-table-result';
import { jsonBigIntSafeSerialize } from '@helpers/json-bigint';
import { DateTime } from 'luxon';
import BigNumber from 'bignumber.js';
import { isNull, isUndefined } from 'lodash';

type TemplateNames =
  | 'unknown'
  | 'unknown-object'
  | 'empty'
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
  /** REVIEW-COMMENT: Json table results. */
  @Input() public results: JsonTableResult<unknown>[];
  /** REVIEW-COMMENT: Download filename. */
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
          const template = this.determineTemplate(result, key);
          switch (template) {
            case 'unknown-object':
              const serialized = jsonBigIntSafeSerialize(result[key]);
              const serializedDoubleQuote = serialized.replace(/"/g, '""');
              resultRow.push(`"${serializedDoubleQuote}"`);
              break;
            default:
              resultRow.push(result[key]);
              break;
          }
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
    // name-based typings
    if (column.toLowerCase().endsWith('timestamp')) {
      return 'datetime';
    }

    if (column.toLowerCase().endsWith('utc')) {
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

    // advanced types
    if (row[column] instanceof DateTime) {
      return 'datetime';
    }

    if (row[column] instanceof BigNumber) {
      return 'unknown';
    }

    if (isNull(row[column]) || isUndefined(row[column])) {
      return 'empty';
    }

    // primitives
    switch (typeof row[column]) {
      case 'object':
        return 'unknown-object';
      default:
        return 'unknown';
    }
  }
}
