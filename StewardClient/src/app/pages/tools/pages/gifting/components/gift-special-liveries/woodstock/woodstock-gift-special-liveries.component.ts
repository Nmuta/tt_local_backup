import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { BackgroundJob } from '@models/background-job';
import { GiftResponse } from '@models/gift-response';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { BigNumber } from 'bignumber.js';
import { DateTime } from 'luxon';
import { Observable, takeUntil } from 'rxjs';

export interface SpecialLiveryData {
  date: DateTime;
  id: string;
  label: string;
}
export interface GiftSpecialLiveriesContract {
  liveries: SpecialLiveryData[];
  getLivery$(liveryId: string): Observable<PlayerUgcItem>;
  giftLiveryToPlayers$(
    giftReason: string,
    liveryIds: string[],
    xuids: BigNumber[],
  ): Observable<BackgroundJob<unknown>>;
  giftLiveriesToLspGroup$(
    giftReason: string,
    liveryIds: string[],
    lspGroup: LspGroup,
  ): Observable<GiftResponse<BigNumber>>;
}

interface SpecialLiveryModel {
  data: SpecialLiveryData;
  checked: boolean;
  monitor: ActionMonitor;
  ugcData?: PlayerUgcItem;
}

/**
 *
 */
@Component({
  selector: 'woodstock-gift-special-liveries',
  templateUrl: './woodstock-gift-special-liveries.component.html',
  styleUrls: ['./woodstock-gift-special-liveries.component.scss'],
})
export class WoodstockGiftSpecialLiveriesComponent extends BaseComponent implements OnInit {
  @Input() public playerIdentities: IdentityResultAlpha[];
  @Input() public lspGroup: LspGroup;
  @Input() public usingPlayerIdentities: boolean;
  @Input() public contract: GiftSpecialLiveriesContract;

  public liveries: SpecialLiveryModel[];
  public allMonitors: ActionMonitor[];
  public sendGiftMonitor = new ActionMonitor('Send liveries');

  constructor() {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.liveries = this.contract.liveries.map(v => ({
      data: v,
      checked: true,
      monitor: new ActionMonitor('GET ' + v.id),
    }));
    this.allMonitors = this.liveries.map(l => l.monitor);
    for (const livery of this.liveries) {
      this.contract
        .getLivery$(livery.data.id)
        .pipe(livery.monitor.monitorSingleFire())
        .subscribe(r => (livery.ugcData = r));
    }
  }

  /** Sends gift liveries to players. */
  public sendGiftLiveries(): void {
    this.sendGiftMonitor = this.sendGiftMonitor.repeat();
    const liveryIdsToSend = this.liveries.filter(l => l.checked).map(l => l.data.id);
    const xuidsToSendTo = this.playerIdentities.map(p => p.xuid);

    this.contract
      .giftLiveryToPlayers$('Gift Livery', liveryIdsToSend, xuidsToSendTo)
      .pipe(this.sendGiftMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe();
  }
}
