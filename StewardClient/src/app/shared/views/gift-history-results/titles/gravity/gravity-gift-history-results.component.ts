import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { GravityGiftHistories } from '@models/gravity/gravity-gift-history.model';
import { IdentityResultBeta } from '@models/identity-query.model';
import { GravityService } from '@services/gravity/gravity.service';

/** Retreives and displays Gravity Gift history by XUID. */
@Component({
  selector: 'gravity-gift-history-results',
  templateUrl: './gravity-gift-history-results.component.html',
  styleUrls: ['./gravity-gift-history-results.component.scss']
})
export class GravityGiftHistoryResultsComponent extends BaseComponent implements OnChanges {
  @Input() public selectedPlayer: IdentityResultBeta;

  /** True when request succeeds. */
  public isLoaded = false;
  /** The error received while loading. */
  public loadError: unknown;
  /** True while waiting on request. */
  public showSpinner = false;

  /** The gift history list to display. */
  public giftHistoryList: GravityGiftHistories;

  public isActiveIcon = faCheck;

  /** The columns + order to display. */
  public columnsToDisplay = ['requestingAgent', 'giftSendDateUtc', 'giftInventory'];
  
  constructor(public readonly gravity: GravityService) {
    super();
  }

    /** Initialization hook. */
    public ngOnChanges(): void {
      if(this.selectedPlayer === undefined) {
        this.isLoaded = false;
        return
      }

      this.loadError = undefined;
      this.isLoaded = false;
      this.showSpinner = true;

      this.gravity.getGiftHistoryByT10Id(this.selectedPlayer.t10Id).subscribe(
        giftHistories => {
          this.isLoaded = true;
          this.showSpinner = false;
          this.giftHistoryList = giftHistories;
        },
        _error => {
          this.isLoaded = false;
          this.showSpinner = false;
          this.loadError = _error; // TODO: Display something useful to the user
        },
      );
    }
}
