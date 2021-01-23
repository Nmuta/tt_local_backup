import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SunriseGiftHistories } from '@models/sunrise/sunrise-gift-history.model';
import { SunriseService } from '@services/sunrise/sunrise.service';

/** Retreives and displays Sunrise Gift history by XUID. */
@Component({
  selector: 'sunrise-gift-history-results',
  templateUrl: './sunrise-gift-history-results.component.html',
  styleUrls: ['./sunrise-gift-history-results.component.scss']
})
export class SunriseGiftHistoryResultsComponent extends BaseComponent implements OnChanges {
  @Input() public currentPlayer: IdentityResultAlpha;

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;

  /** The ban list to display. */
  public giftHistoryList: SunriseGiftHistories;

  public isActiveIcon = faCheck;

  /** The columns + order to display. */
  public columnsToDisplay = ['requestingAgent', 'giftSendDateUtc', 'giftInventory'];
  
  constructor(public readonly sunrise: SunriseService) {
    super();
  }

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (this.currentPlayer === undefined) {
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;
    this.sunrise.getGiftHistoryByXuid(this.currentPlayer.xuid).subscribe(
      giftHistories => {
        this.isLoading = false;
        this.giftHistoryList = giftHistories;
        console.log(giftHistories);
      },
      _error => {
        this.isLoading = false;
        this.loadError = _error; // TODO: Display something useful to the user
      },
    );
  }

}
