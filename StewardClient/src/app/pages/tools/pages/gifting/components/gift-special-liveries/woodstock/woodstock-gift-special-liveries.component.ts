import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { BackgroundJob } from '@models/background-job';
import { GiftResponse } from '@models/gift-response';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { BigNumber } from 'bignumber.js';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

export interface SpecialLiveryData {
  date: DateTime;
  id: string;
  notes: string;
}

export interface GiftSpecialLiveriesContract {
  liveries: SpecialLiveryData[];
  getLivery$(liveryId: string): Observable<PlayerUgcItem>;
  giftLiveryToPlayers$(
    liveryId: string,
    xuids: BigNumber[],
    giftReason: string,
  ): Observable<BackgroundJob<unknown>>;
  giftLiveryToLspGroup$(
    liveryId: string,
    lspGroup: LspGroup,
    giftReason: string,
  ): Observable<GiftResponse<BigNumber>>;
}

interface SpecialLiveryModel {
  data: SpecialLiveryData;
  checked: boolean;
  monitor: ActionMonitor;
  ugcData?: PlayerUgcItem;
}

@Component({
  selector: 'woodstock-gift-special-liveries',
  templateUrl: './woodstock-gift-special-liveries.component.html',
  styleUrls: ['./woodstock-gift-special-liveries.component.scss']
})
export class WoodstockGiftSpecialLiveriesComponent extends BaseComponent implements OnChanges {
  @Input() public playerIdentities: IdentityResultAlpha[];
  @Input() public lspGroup: LspGroup;
  @Input() public usingPlayerIdentities: boolean;
  @Input() public contract: GiftSpecialLiveriesContract;

  public liveries: SpecialLiveryModel[];

  constructor() {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(_changes: SimpleChanges): void {
    this.liveries = this.contract.liveries.map(v => ({ data: v, checked: false, monitor: new ActionMonitor('GET '  + v.id) }));
    for (const livery of this.liveries) {
      this.contract.getLivery$(livery.data.id).pipe(livery.monitor.monitorSingleFire()).subscribe(r => livery.ugcData = r);
    }
  }

  /** Called when a checkbox is clicked. */
  public checkboxChanged(): void { }

}
