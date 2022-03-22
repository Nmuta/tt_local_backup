import { Component, Input } from '@angular/core';
import { GameTitle } from '@models/enums';
import { GiftHistoryResultAndView } from '@models/gift-history';

/** Comapct gift history result component. */
@Component({
  selector: 'gift-history-results-compact',
  templateUrl: './gift-history-results-compact.component.html',
  styleUrls: ['./gift-history-results-compact.component.scss'],
})
export class GiftHistoryResultsCompactComponent {
  @Input() public giftHistoryList: GiftHistoryResultAndView[];
  @Input() public gameTitle: GameTitle;
}
