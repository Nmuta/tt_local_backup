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

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;

  /** The ban list to display. */
  public giftHistoryList: GravityGiftHistories;

  public isActiveIcon = faCheck;

  /** The columns + order to display. */
  public columnsToDisplay = ['requestingAgent', 'giftSendDateUtc', 'giftInventory'];
  
  constructor(public readonly gravity: GravityService) {
    super();
  }

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (this.selectedPlayer === undefined) {
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;

    console.log('selected player ids:');
    console.log(this.selectedPlayer.t10ids);

    var lookupt10id = this.selectedPlayer.t10id ? 
      this.selectedPlayer.t10id :
      this.selectedPlayer.t10ids.sort((a,b) => {return a.lastAccessedUtc.getTime() - b.lastAccessedUtc.getTime()})[0];

    console.log('lookup T10ID:')
    console.log(lookupt10id)

    this.gravity.getGiftHistoryByT10Id(this.selectedPlayer.t10id).subscribe(
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
