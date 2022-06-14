import BigNumber from 'bignumber.js';
import { Injectable } from '@angular/core';
import { BackgroundJob } from '@models/background-job';
import { GiftResponse } from '@models/gift-response';
import { LspGroup } from '@models/lsp-group';
import { ApiService } from '@services/api';
import { Observable } from 'rxjs';
import { Gift, GroupGift } from '@models/gift';

/** Handles calls to Sunrise API routes. */
@Injectable({
  providedIn: 'root',
})
export class ApolloGiftingService {
  public basePath: string = 'v2/title/apollo/gifting';

  constructor(private readonly apiService: ApiService) {}

  /** Gifts livery to players.  */
  public postGiftLiveryToPlayersUsingBackgroundJob$(
    liveryId: string,
    groupGift: GroupGift,
  ): Observable<BackgroundJob<void>> {
    return this.apiService.postRequest$<BackgroundJob<void>>(
      `${this.basePath}/livery/${liveryId}/players/useBackgroundProcessing`,
      groupGift,
    );
  }

  /** Gifts livery to an LSP group.  */
  public postGiftLiveryToLspGroup$(
    liveryId: string,
    lspGroup: LspGroup,
    gift: Gift,
  ): Observable<GiftResponse<BigNumber>> {
    return this.apiService.postRequest$<GiftResponse<BigNumber>>(
      `${this.basePath}/livery/${liveryId}/groupId/${lspGroup.id}`,
      gift,
    );
  }
}
