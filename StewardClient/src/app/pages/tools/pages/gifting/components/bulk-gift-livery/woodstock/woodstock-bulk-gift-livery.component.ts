import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BackgroundJob } from '@models/background-job';
import { GameTitleCodeName } from '@models/enums';
import { GiftResponse } from '@models/gift-response';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcType } from '@models/ugc-filters';
import { WoodstockGroupGiftService } from '@services/api-v2/woodstock/group/woodstock-group-gift.service';
import { WoodstockPlayersGiftService } from '@services/api-v2/woodstock/players/woodstock-players-gift.service';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { WoodstockService } from '@services/woodstock';
import BigNumber from 'bignumber.js';
import { Observable, throwError } from 'rxjs';
import { BulkGiftLiveryBaseComponent } from '../bulk-gift-livery.base.component';

/** Woodstock gift livery. */
@Component({
  selector: 'woodstock-bulk-gift-livery',
  templateUrl: '../bulk-gift-livery.component.html',
  styleUrls: ['../bulk-gift-livery.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WoodstockBulkGiftLiveryComponent),
      multi: true,
    },
  ],
})
export class WoodstockBulkGiftLiveryComponent extends BulkGiftLiveryBaseComponent<IdentityResultAlpha> {
  public gameTitle = GameTitleCodeName.FH5;

  constructor(
    private readonly woodstockService: WoodstockService,
    backgroundJobService: BackgroundJobService,
    private readonly playersGiftService: WoodstockPlayersGiftService,
    private readonly groupGiftService: WoodstockGroupGiftService,
  ) {
    super(backgroundJobService);
  }

  /** Gets a player's livery. */
  public getLivery$(liveryId: string): Observable<PlayerUgcItem> {
    return this.woodstockService.getPlayerUgcItem$(liveryId, UgcType.Livery);
  }

  /** Gifts liveries to group of players. */
  public giftLiveriesToPlayers$(
    liveryIds: string[],
    xuids: BigNumber[],
    giftReason: string,
  ): Observable<BackgroundJob<unknown>> {
    if (!xuids || xuids.length <= 0) {
      return throwError(
        new Error('Failed to gift livery: playerIdentities is invalid or empty array'),
      );
    }

    return this.playersGiftService.giftLiveriesByXuids$(giftReason, liveryIds, xuids);
  }

  /** Gifts liveries to a LSP user group. */
  public giftLiveriesToLspGroup$(
    liveryIds: string[],
    lspGroup: LspGroup,
    giftReason: string,
  ): Observable<GiftResponse<BigNumber>> {
    if (!lspGroup) {
      return throwError(new Error('Failed to gift livery: user group was not provided'));
    }

    return this.groupGiftService.giftLiveriesByUserGroup$(giftReason, liveryIds, lspGroup.id);
  }
}
