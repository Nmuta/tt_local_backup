import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { ApolloGiftHistories } from '@models/apollo/apollo-gift-history.model';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { ApolloService } from '@services/apollo/apollo.service';

/** Retreives and displays Apollo Gift history by XUID. */
@Component({
  selector: 'apollo-gift-history-results',
  templateUrl: './apollo-gift-history-results.component.html',
  styleUrls: ['./apollo-gift-history-results.component.scss']
})
export class ApolloGiftHistoryResultsComponent extends BaseComponent implements OnChanges {
  @Input() public selectedPlayer: IdentityResultAlpha;
  @Input() public selectedGroup: LspGroup;
  @Input() public usingPlayerIdentities: boolean;

  /** True when request succeeds. */
  public isLoaded = false;
  /** The error received while loading. */
  public loadError: unknown;
  /** True while waiting on request. */
  public showSpinner = false;

  /** The gift history list to display. */
  public giftHistoryList: ApolloGiftHistories;

  public isActiveIcon = faCheck;

  /** The columns + order to display. */
  public columnsToDisplay = ['requestingAgent', 'giftSendDateUtc', 'giftInventory'];
  
  constructor(public readonly apollo: ApolloService) {
    super();
  }

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (this.usingPlayerIdentities)
    {
      if(this.selectedPlayer === undefined) {
        this.isLoaded = false;
        return
      }

      this.loadError = undefined;
      this.isLoaded = false;
      this.showSpinner = true;

      this.apollo.getGiftHistoryByXuid(this.selectedPlayer.xuid).subscribe(
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
    else
    {
      if(this.selectedGroup === undefined || this.selectedGroup === null) {
        this.isLoaded = false;
        return
      }

      this.loadError = undefined;
      this.isLoaded = false;
      this.showSpinner = true;

      this.apollo.getGiftHistoryByLspGroup(this.selectedGroup.id).subscribe(
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

}
