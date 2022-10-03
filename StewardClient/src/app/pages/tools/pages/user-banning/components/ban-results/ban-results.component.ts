import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { sortBy } from 'lodash';
import { BanResultsUnion } from '../../pages/base/user-banning.base.component';

/** The item-selection component. */
@Component({
  selector: 'ban-results',
  templateUrl: './ban-results.component.html',
  styleUrls: ['./ban-results.component.scss'],
})
export class BanResultsComponent extends BaseComponent implements OnInit {
  /** REVIEW-COMMENT: Ban results. */
  @Input() public banResults: BanResultsUnion[];

  public banCsvData: string[][];
  public banErrorCount: number = 0;

  /** Initialization hook. */
  public ngOnInit(): void {
    this.banResults = sortBy(this.banResults, result => !result.error); //Failures to the top
    this.banErrorCount = this.banResults.filter(data => data.error).length;

    this.buildCsvData();
  }

  /** Builds the gifting results into CSV data that can be downloaded. */
  public buildCsvData(): void {
    this.banCsvData = [['Xuid', 'Success']];

    for (const result of this.banResults) {
      this.banCsvData[this.banCsvData.length] = [
        `'${result.xuid}`,
        result.error ? 'True' : 'False',
      ];
    }
  }
}
