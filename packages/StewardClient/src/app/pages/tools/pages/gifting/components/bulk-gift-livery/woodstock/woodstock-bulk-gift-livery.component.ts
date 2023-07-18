import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { GameTitle } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { UgcType } from '@models/ugc-filters';
import { WoodstockGroupGiftService } from '@services/api-v2/woodstock/group/gift/woodstock-group-gift.service';
import { WoodstockPlayersGiftService } from '@services/api-v2/woodstock/players/gift/woodstock-players-gift.service';
import { WoodstockService } from '@services/woodstock';
import BigNumber from 'bignumber.js';
import { throwError } from 'rxjs';
import { BulkGiftLiveryContract } from '../bulk-gift-livery.component';

/** Woodstock gift livery. */
@Component({
  selector: 'woodstock-bulk-gift-livery',
  templateUrl: 'woodstock-bulk-gift-livery.component.html',
  styleUrls: ['woodstock-bulk-gift-livery.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WoodstockBulkGiftLiveryComponent),
      multi: true,
    },
  ],
})
export class WoodstockBulkGiftLiveryComponent {
  /** Player identities to gift the liveries to. */
  @Input() public playerIdentities: IdentityResultAlpha[];
  /** Lsp Group to gift the liveries to. */
  @Input() public lspGroup: LspGroup;
  /** Whether component is using player identities. False means LSP group. */
  @Input() public usingPlayerIdentities: boolean;

  public service: BulkGiftLiveryContract;

  constructor(
    woodstockService: WoodstockService,
    playersGiftService: WoodstockPlayersGiftService,
    groupGiftService: WoodstockGroupGiftService,
  ) {
    this.service = {
      gameTitle: GameTitle.FH5,
      allowSettingExpireDate: true,
      allowSettingLocalizedMessage: false,
      getLocalizedStrings$: () => {
        return throwError(new Error('getLocalizedStrings$ is not supported in Woodstock'));
      },
      /** Gets a player's livery. */
      getLivery$: (liveryId: string) => {
        return woodstockService.getPlayerUgcItem$(liveryId, UgcType.Livery);
      },
      /** Gifts liveries to group of players. */
      giftLiveriesToPlayers$: (
        liveryIds: string[],
        xuids: BigNumber[],
        giftReason: string,
        expireAfterDays: BigNumber,
      ) => {
        if (!xuids || xuids.length <= 0) {
          return throwError(
            new Error('Failed to gift livery: playerIdentities is invalid or empty array'),
          );
        }

        return playersGiftService.giftLiveriesByXuids$(
          giftReason,
          liveryIds,
          xuids,
          expireAfterDays,
        );
      },
      /** Gifts liveries to a LSP user group. */
      giftLiveriesToLspGroup$: (
        liveryIds: string[],
        lspGroup: LspGroup,
        giftReason: string,
        expireAfterDays: BigNumber,
      ) => {
        if (!lspGroup) {
          return throwError(new Error('Failed to gift livery: user group was not provided'));
        }

        return groupGiftService.giftLiveriesByUserGroup$(
          giftReason,
          liveryIds,
          lspGroup.id,
          expireAfterDays,
        );
      },
    };
  }
}
