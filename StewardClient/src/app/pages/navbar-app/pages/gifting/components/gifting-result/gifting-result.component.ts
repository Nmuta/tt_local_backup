import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { GiftResponse } from '@models/gift-response';
import { GiftIdentityAntecedent } from '@shared/constants';
import { sortBy } from 'lodash';

/** The item-selection component. */
@Component({
  selector: 'gifting-result',
  templateUrl: './gifting-result.component.html',
  styleUrls: ['./gifting-result.component.scss'],
})
export class GiftingResultComponent extends BaseComponent implements OnInit {
  @Input() public giftingResult: GiftResponse<bigint | string>[];

  public giftingCsvData: string[][];
  public GiftHistoryAntecedent = GiftIdentityAntecedent;
  public giftingErrorCount: number = 0;

  /** Test */
  public ngOnInit(): void {
    this.giftingResult = sortBy(this.giftingResult, result => !!result.error);
    this.giftingErrorCount = this.giftingResult.filter(data => !!data.error).length;

    this.buildCsvData();
  }

  /** Builds the gifting results into CSV data that can be downloaded. */
  public buildCsvData(): void {
    this.giftingCsvData = [['PlayerOrLspGroup', 'IdentityType', 'Error']];

    for (const result of this.giftingResult) {
      this.giftingCsvData[this.giftingCsvData.length] = [
        `'${result.playerOrLspGroup}`,
        GiftIdentityAntecedent[result.identityAntecedent],
        JSON.stringify(result?.error),
      ];
    }
  }
}
