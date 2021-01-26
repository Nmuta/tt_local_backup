import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { SunriseGiftHistories } from '@models/sunrise/sunrise-gift-history.model';
import { SunriseService } from '@services/sunrise/sunrise.service';

/** Retreives and displays Sunrise Gift history by XUID. */
@Component({
  selector: 'sunrise-gift-history-results',
  templateUrl: './sunrise-gift-history-results.component.html',
  styleUrls: ['./sunrise-gift-history-results.component.scss']
})
export class SunriseGiftHistoryResultsComponent extends BaseComponent implements OnChanges {
  @Input() public selectedPlayer: IdentityResultAlpha;
  @Input() public selectedGroup: LspGroup;
  @Input() public usingPlayerIdentities: boolean;

  /** True while waiting on a request. */
  public isLoading = false;
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
    this.loadError = undefined;

    if (this.usingPlayerIdentities)
    {
      if(this.selectedPlayer === undefined) {
        return
      }

      this.isLoading = true;
      console.log("You are on individual player gifting.")
      this.sunrise.getGiftHistoryByXuid(this.selectedPlayer.xuid).subscribe(
        giftHistories => {
          this.isLoading = false;
          this.giftHistoryList = giftHistories;
        },
        _error => {
          this.isLoading = false;
          this.loadError = _error; // TODO: Display something useful to the user
        },
      );
    }
    else
    {
      if(this.selectedGroup === undefined || this.selectedGroup === null) {
        return
      }

      this.isLoading = true;
      console.log("You are on LSP group gifting.")
      this.sunrise.getGiftHistoryByLspGroup(this.selectedGroup.id).subscribe(
        giftHistories => {
          this.isLoading = false;
          this.giftHistoryList = giftHistories;
        },
        _error => {
          this.isLoading = false;
          this.loadError = _error; // TODO: Display something useful to the user
        },
      );
    }
  }

}
