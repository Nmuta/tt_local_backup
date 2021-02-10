import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { GiftResponse } from '@models/gift-response';
import { GiftHistoryAntecedent } from '@shared/constants';

/** The item-selection component. */
@Component({
  selector: 'gifting-result',
  templateUrl: './gifting-result.component.html',
  styleUrls: ['./gifting-result.component.scss'],
})
export class GiftingResultComponent extends BaseComponent implements OnInit{
  @Input() public giftingResult: GiftResponse<bigint | string>[];

  public GiftHistoryAntecedent = GiftHistoryAntecedent;

  /** Test */
  public ngOnInit(): void {
    this.giftingResult = this.giftingResult.sort((a, b) => (a.error === b.error ? 0 : a.error ? -1 : 1));
  }
}
