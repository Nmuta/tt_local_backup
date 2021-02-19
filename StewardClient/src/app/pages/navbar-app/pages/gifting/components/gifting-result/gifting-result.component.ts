import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { GiftResponse } from '@models/gift-response';
import { GiftHistoryAntecedent } from '@shared/constants';
import { sortBy } from 'lodash';

/** The item-selection component. */
@Component({
  selector: 'gifting-result',
  templateUrl: './gifting-result.component.html',
  styleUrls: ['./gifting-result.component.scss'],
})
export class GiftingResultComponent extends BaseComponent implements OnInit {
  @Input() public giftingResult: GiftResponse<bigint | string>[];

  public GiftHistoryAntecedent = GiftHistoryAntecedent;
  public giftingErrorCount: number = 0;

  /** Test */
  public ngOnInit(): void {
    this.giftingResult = sortBy(this.giftingResult, result => !!result.error);
    this.giftingErrorCount = this.giftingResult.filter(data => !!data.error).length;
  }
}
