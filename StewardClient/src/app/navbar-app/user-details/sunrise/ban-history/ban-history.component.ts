import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import {
  LiveOpsBanDescription,
  ServicesBanDescription,
  SunriseBanHistory,
} from '@models/sunrise/sunrise-ban-history.model';
import { SunriseService } from '@services/sunrise/sunrise.service';
import _ from 'lodash';

/** Mixin type for adding correlatedLiveOpsBan to another type. */
type CorrelatedLiveOpsBanPartial = {
  correlatedLiveOpsBan: LiveOpsBanDescription;
};

/** Retreives and displays Sunrise Ban history by XUID. */
@Component({
  selector: 'sunrise-ban-history',
  templateUrl: './ban-history.component.html',
  styleUrls: ['./ban-history.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class BanHistoryComponent extends BaseComponent implements OnChanges {
  @Input() public xuid?: number;

  public data: object[];

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: any;
  /** This player's ban history. */
  public history: SunriseBanHistory;

  /** The ban list to display. */
  public banList: (ServicesBanDescription & CorrelatedLiveOpsBanPartial)[];

  public isActiveIcon = faCheck;

  /** The columns + order to display. */
  public columnsToDisplay = [
    'isActive',
    'reason',
    'featureArea',
    'startTimeUtc',
    'expireTimeUtc',
  ];

  /** The current expanded element. */
  public expandedEntry: ServicesBanDescription;

  constructor(public readonly sunrise: SunriseService) {
    super();
  }

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (this.xuid === undefined) {
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;
    this.sunrise.getBanHistoryByXuid(this.xuid).subscribe(
      history => {
        this.isLoading = false;
        this.history = history;
        this.banList = this.history.servicesBanHistory.map(servicesBan => {
          const output: ServicesBanDescription & CorrelatedLiveOpsBanPartial = _.clone(servicesBan) as any;
          output.correlatedLiveOpsBan = this.correlateLiveOps(servicesBan);
          return output;
        });
      },
      _error => {
        this.isLoading = false;
        this.loadError = _error; // TODO: Display something useful to the user
      }
    );
  }

  /** Attempts to correlate a Services ban to a Live Ops ban. */
  public correlateLiveOps(servicesBan: ServicesBanDescription) {
    const value = _.chain(this.history.liveOpsBanHistory)
      .filter(liveOpsBan => {
        const xuidMatch = liveOpsBan.xuid === servicesBan.xuid;
        const startMatch =
          liveOpsBan.startTimeUtc.getDate() ===
          servicesBan.startTimeUtc.getDate();
        const expireMatch =
          liveOpsBan.expireTimeUtc.getDate() ===
          servicesBan.expireTimeUtc.getDate();

        return xuidMatch && startMatch && expireMatch;
      })
      .first()
      .value();
    return value;
  }
}
