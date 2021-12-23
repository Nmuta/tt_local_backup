import BigNumber from 'bignumber.js';
import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GiftResponse } from '@models/gift-response';
import { sortBy } from 'lodash';

/** The item-selection component. */
@Component({
  selector: 'gifting-result',
  templateUrl: './gifting-result.component.html',
  styleUrls: ['./gifting-result.component.scss'],
})
export class GiftingResultComponent extends BaseComponent implements OnInit {
  @Input() public giftingResult: GiftResponse<BigNumber | string>[];

  public giftingCsvData: string[][];
  public giftingErrorCount: number = 0;

  /** Test */
  public ngOnInit(): void {
    this.giftingResult = sortBy(this.giftingResult, result => !result.errors);
    this.giftingErrorCount = this.giftingResult.filter(data => !!data.errors).length;

    this.buildCsvData();
  }

  /** Builds the gifting results into CSV data that can be downloaded. */
  public buildCsvData(): void {
    this.giftingCsvData = [['PlayerOrLspGroup', 'IdentityType', 'Error']];

    for (const result of this.giftingResult) {
      this.giftingCsvData[this.giftingCsvData.length] = [
        `'${result.playerOrLspGroup}`,
        result.identityAntecedent,
        JSON.stringify(result?.errors),
      ];
    }
  }
}
