import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
import { GiftReason } from '../gift-basket/gift-basket.base.component';

/** Data for special liveries. */
export interface SpecialLiveryData {
  /** The date at which the livery was sent. Displayed. */
  date: DateTime;
  /** The livery ID. */
  id: string;
  /** Special label for this livery. Displayed. */
  label: string;
}

/** Upstream contract for special liveries UI. */
export interface GiftSpecialLiveriesContract {
  /** The special liveries to provide as options. */
  liveries: SpecialLiveryData[];

  /** API for retrieving livery information. */
  getLivery$(liveryId: string): Observable<PlayerUgcItem>;

  /** API for gifting the livery to specific players. */
  giftLiveryToPlayers$(
    giftReason: string,
    liveryIds: string[],
    xuids: BigNumber[],
  ): Observable<BackgroundJob<unknown>>;

  /** API for gifting hte livery to an LSP group. */
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
 * Component for gifting of special liveries.
 */
@Component({
  selector: 'gift-special-liveries',
  templateUrl: './gift-special-liveries.component.html',
  styleUrls: ['./gift-special-liveries.component.scss'],
})
export class GiftSpecialLiveriesComponent extends BaseComponent implements OnInit {
  @Input() public playerIdentities: IdentityResultAlpha[];
  @Input() public lspGroup: LspGroup;
  @Input() public usingPlayerIdentities: boolean;
  @Input() public contract: GiftSpecialLiveriesContract;

  public liveries: SpecialLiveryModel[];
  public allMonitors: ActionMonitor[];
  public sendGiftMonitor = new ActionMonitor('Send liveries');

  public formControls = {
    giftReason: new FormControl('', [Validators.required]),
  };
  public formGroup = new FormGroup(this.formControls);
  public giftReasons: string[] = [
    GiftReason.CommunityGift,
    GiftReason.LostSave,
    GiftReason.AuctionHouse,
    GiftReason.GameError,
    GiftReason.SaveRollback,
  ];

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
        .pipe(livery.monitor.monitorSingleFire(), takeUntil(this.onDestroy$))
        .subscribe(r => (livery.ugcData = r));
    }
  }

  /** Sends gift liveries to players. */
  public sendGiftLiveries(): void {
    if (!this.isGiftLiveryReady()) {
      return;
    }

    this.sendGiftMonitor = this.sendGiftMonitor.repeat();
    const liveryIdsToSend = this.liveries.filter(l => l.checked).map(l => l.data.id);
    const xuidsToSendTo = this.playerIdentities.map(p => p.xuid);
    const giftReason = this.formControls.giftReason.value;

    this.contract
      .giftLiveryToPlayers$(giftReason, liveryIdsToSend, xuidsToSendTo)
      .pipe(this.sendGiftMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe();
  }

  /** Returns true if all required info is valid to send a gift livery. */
  public isGiftLiveryReady(): boolean {
    const hasPlayerIdentities = this.usingPlayerIdentities && this.playerIdentities?.length > 0;
    const hasLiveries = this.liveries.filter(l => l.checked).length > 0;
    return this.formGroup.valid && hasPlayerIdentities && hasLiveries;
  }
}