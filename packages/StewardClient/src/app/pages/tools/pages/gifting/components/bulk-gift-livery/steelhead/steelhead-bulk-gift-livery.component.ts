import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { GameTitle } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { UgcType } from '@models/ugc-filters';
import { SteelheadGroupGiftService } from '@services/api-v2/steelhead/group/gift/steelhead-group-gift.service';
import { SteelheadLocalizationService } from '@services/api-v2/steelhead/localization/steelhead-localization.service';
import { SteelheadPlayersGiftService } from '@services/api-v2/steelhead/players/gift/steelhead-players-gift.service';
import { SteelheadUgcLookupService } from '@services/api-v2/steelhead/ugc/lookup/steelhead-ugc-lookup.service';
import BigNumber from 'bignumber.js';
import { throwError } from 'rxjs';
import { BulkGiftLiveryContract } from '../bulk-gift-livery.component';

/** Steelhead gift livery. */
@Component({
  selector: 'steelhead-bulk-gift-livery',
  templateUrl: 'steelhead-bulk-gift-livery.component.html',
  styleUrls: ['steelhead-bulk-gift-livery.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SteelheadBulkGiftLiveryComponent),
      multi: true,
    },
  ],
})
export class SteelheadBulkGiftLiveryComponent {
  /** Player identities to gift the liveries to. */
  @Input() public playerIdentities: IdentityResultAlpha[];
  /** Lsp Group to gift the liveries to. */
  @Input() public lspGroup: LspGroup;
  /** Whether component is using player identities. False means LSP group. */
  @Input() public usingPlayerIdentities: boolean;

  public service: BulkGiftLiveryContract;

  constructor(
    private readonly steelheadLocalizationService: SteelheadLocalizationService,
    steelheadUgcLookupService: SteelheadUgcLookupService,
    playersGiftService: SteelheadPlayersGiftService,
    groupGiftService: SteelheadGroupGiftService,
  ) {
    this.service = {
      gameTitle: GameTitle.FM8,
      allowSettingExpireDate: true,
      allowSettingLocalizedMessage: true,
      getLocalizedStrings$: () => steelheadLocalizationService.getLocalizedStrings$(),
      /** Gets a player's livery. */
      getLivery$: (liveryId: string) =>
        steelheadUgcLookupService.getPlayerUgcItem$(liveryId, UgcType.Livery),
      /** Gifts liveries to group of players. */
      giftLiveriesToPlayers$: (
        liveryIds: string[],
        xuids: BigNumber[],
        giftReason: string,
        expireAfterDays: BigNumber,
        titleMessageId: GuidLikeString,
        bodyMessageId: GuidLikeString,
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
          titleMessageId,
          bodyMessageId,
        );
      },
      /** Gifts liveries to a LSP user group. */
      giftLiveriesToLspGroup$: (
        liveryIds: string[],
        lspGroup: LspGroup,
        giftReason: string,
        expireAfterDays: BigNumber,
        titleMessageId: GuidLikeString,
        bodyMessageId: GuidLikeString,
      ) => {
        if (!lspGroup) {
          return throwError(new Error('Failed to gift livery: user group was not provided'));
        }

        return groupGiftService.giftLiveriesByUserGroup$(
          giftReason,
          liveryIds,
          lspGroup.id,
          expireAfterDays,
          titleMessageId,
          bodyMessageId,
        );
      },
    };
  }
}
