import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BackgroundJob } from '@models/background-job';
import { GameTitle } from '@models/enums';
import { Gift, GroupGift } from '@models/gift';
import { GiftResponse } from '@models/gift-response';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcType } from '@models/ugc-filters';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { WoodstockService } from '@services/woodstock';
import BigNumber from 'bignumber.js';
import { Observable, throwError } from 'rxjs';
import { GiftLiveryBaseComponent } from '../gift-livery.base.component';

/** Woodstock gift livery. */
@Component({
  selector: 'woodstock-gift-livery',
  templateUrl: '../gift-livery.component.html',
  styleUrls: ['../gift-livery.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WoodstockGiftLiveryComponent),
      multi: true,
    },
  ],
})
export class WoodstockGiftLiveryComponent extends GiftLiveryBaseComponent<IdentityResultAlpha> {
  public gameTitle = GameTitle.FH5;

  constructor(
    private readonly woodstockService: WoodstockService,
    backgroundJobService: BackgroundJobService,
    route: ActivatedRoute,
  ) {
    super(backgroundJobService, route);
  }

  /** Gets a player's livery. */
  public getLivery$(liveryId: string): Observable<PlayerUgcItem> {
    return this.woodstockService.getPlayerUgcItem$(liveryId, UgcType.Livery);
  }

  /** Gifts a livery to group of players. */
  public giftLiveryToPlayers$(
    liveryId: string,
    xuids: BigNumber[],
    giftReason: string,
  ): Observable<BackgroundJob<unknown>> {
    if (!xuids || xuids.length <= 0) {
      return throwError(
        new Error('Failed to gift livery: playerIdentities is invalid or empty array'),
      );
    }

    return this.woodstockService.postGiftLiveryToPlayersUsingBackgroundJob$(liveryId, {
      xuids: xuids,
      giftReason: giftReason,
    } as GroupGift);
  }

  /** Gifts a livery to a LSP user group. */
  public giftLiveryToLspGroup$(
    liveryId: string,
    lspGroup: LspGroup,
    giftReason: string,
  ): Observable<GiftResponse<BigNumber>> {
    if (!lspGroup) {
      return throwError(new Error('Failed to gift livery: lspGroup is null or undefined'));
    }

    return this.woodstockService.postGiftLiveryToLspGroup$(liveryId, lspGroup, {
      giftReason: giftReason,
    } as Gift);
  }
}
