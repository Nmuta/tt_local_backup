import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { BackgroundJob } from '@models/background-job';
import { GiftResponse } from '@models/gift-response';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { BigNumber } from 'bignumber.js';
import { Observable } from 'rxjs';

export interface SpecialLiveryData {
  date: string;
  id: string;
  notes: string;
}

export interface GiftSpecialLiveriesContract {
  liveryIds: string[];
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

  constructor() {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(_changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

}
