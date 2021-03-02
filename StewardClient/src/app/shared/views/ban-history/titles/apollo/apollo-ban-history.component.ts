import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { ApolloBanHistoryEntry } from '@models/apollo';
import { ApolloService } from '@services/apollo/apollo.service';

/** Retreives and displays Apollo Ban history by XUID. */
@Component({
  selector: 'apollo-ban-history',
  templateUrl: './apollo-ban-history.component.html',
  styleUrls: ['./apollo-ban-history.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ApolloBanHistoryComponent extends BaseComponent implements OnChanges {
  @Input() public xuid?: bigint;

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;

  /** The ban list to display. */
  public banList: ApolloBanHistoryEntry[];

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
    this.apollo.getBanHistoryByXuid(this.xuid).subscribe(
      banHistory => {
        this.isLoading = false;
        this.banList = banHistory;
      },
      _error => {
        this.isLoading = false;
        this.loadError = _error; // TODO: Display something useful to the user
      },
    );
  }
}
