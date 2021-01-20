import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { ApolloGiftHistory } from '@models/apollo/apollo-gift-history.model';
import { ApolloService } from '@services/apollo/apollo.service';

/** Retreives and displays Apollo Gift history by XUID. */
@Component({
  selector: 'apollo-gift-history-results',
  templateUrl: './apollo-gift-history-results.component.html',
  styleUrls: ['./apollo-gift-history-results.component.scss']
})
export class ApolloGiftHistoryResultsComponent extends BaseComponent implements OnChanges {
  @Input() public xuid?: number;

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;

  /** The ban list to display. */
  public giftHistoryList: ApolloGiftHistory[];

  public isActiveIcon = faCheck;

  /** The columns + order to display. */
  public columnsToDisplay = ['isActive', 'reason', 'featureArea', 'startTimeUtc', 'expireTimeUtc'];
  
  constructor(public readonly apollo: ApolloService) {
    super();
  }

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (this.xuid === undefined) {
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;
    this.apollo.getGiftHistoryByXuid(this.xuid).subscribe(
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
