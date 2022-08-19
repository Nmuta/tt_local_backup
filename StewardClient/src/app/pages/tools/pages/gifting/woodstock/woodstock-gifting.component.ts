import { Component, OnInit } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IdentityResultAlphaBatch, IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { WoodstockMasterInventory, WoodstockPlayerInventoryProfile } from '@models/woodstock';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { Select, Store } from '@ngxs/store';
import { Observable, throwError } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WoodstockGiftingState } from './state/woodstock-gifting.state';
import {
  SetWoodstockGiftingMatTabIndex,
  SetWoodstockGiftingSelectedPlayerIdentities,
} from './state/woodstock-gifting.state.actions';
import BigNumber from 'bignumber.js';
import { GiftingBaseComponent } from '../base/gifting.base.component';
import { GiftSpecialLiveriesContract } from '../components/gift-special-liveries/woodstock/woodstock-gift-special-liveries.component';
import { WoodstockService } from '@services/woodstock';
import { UgcType } from '@models/ugc-filters';
import { Gift, GroupGift } from '@models/gift';
import { GiftResponse } from '@models/gift-response';
import { BackgroundJob } from '@models/background-job';

const SPECIAL_LIVERY_TABLE = [
  ['2/1/2022', 'Forza OPI Livery', 'N/A'],
  ['11/15/2021', 'Xbox 20th Anniversary Livery', ''],
  ['12/17/2021', 'Forza Ugly Sweater Livery', '7a49af23-00bf-45f5-8a1b-624ae849d6cf'],
  ['1/3/2022', 'New Year\'s 2022 Livery', '5d2def45-d902-4f83-8c49-2872da00284c'],
  ['1/31/2022', 'Lunar New Year Livery', '5c10a6b1-21ec-433b-97c8-15e0abb21e80'],
  ['4/22/2022', 'Earth Day Livery', '64b55169-b229-4a40-96b7-a5118f455f2e'],
  ['', 'Day of the Dead Livery', 'd9355079-48f2-40c2-bb78-10e765428f82'],
  ['6/16/2022', 'Forza Rainbow Livery 2022', 'a2638d38-dfe6-4ab0-bdcd-9de29dcb2805'],
  ['6/3/2022', 'FH5 Peel P50 Livery', 'a388636f-5697-4943-ae1b-f9ba4fc9b0ad'],
  ['1/21/2022', 'Master Chief is Back Livery', '11a279ed-1e6a-4a78-bce4-a71bc1fcd478'],
  ['8/5/2022', 'Benny Blanco Livery', '27819e1e-19ed-4e23-8d3a-eed531615ec5'],
];

/** The woodstock gifting page. */
@Component({
  templateUrl: './woodstock-gifting.component.html',
  styleUrls: ['./woodstock-gifting.component.scss'],
})
export class WoodstockGiftingComponent extends GiftingBaseComponent<BigNumber> implements OnInit {
  @Select(WoodstockGiftingState.selectedPlayerIdentities)
  public selectedPlayerIdentities$: Observable<IdentityResultAlphaBatch>;

  public gameTitle = GameTitle.FH5;
  /** All selected player identities from player selection tool. */
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
  /** Selected LSP group. */
  public selectedLspGroup: LspGroup;
  /** Selected player identity when user clicks on identity chip. */
  public selectedPlayerIdentity: IdentityResultAlpha;
  public selectedPlayerInventoryProfile: WoodstockPlayerInventoryProfile;
  public selectedPlayerInventory: WoodstockMasterInventory;

  public specialLiveriesContract: GiftSpecialLiveriesContract;

  constructor(
    protected readonly store: Store,
    private readonly service: WoodstockService
  ) {
    super(store);
  }

  /** Initialization hook */
  public ngOnInit(): void {
    super.ngOnInit();

    this.specialLiveriesContract = {
      liveryIds: [

      ],
      getLivery$: id => this.service.getPlayerUgcItem$(id, UgcType.Livery),
      giftLiveryToPlayers$(
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
      },
    
      giftLiveryToLspGroup$(
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

    this.matTabSelectedIndex = this.store.selectSnapshot<number>(
      WoodstockGiftingState.selectedMatTabIndex,
    );

    this.selectedPlayerIdentities$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((playerIdentities: IdentityResultAlphaBatch) => {
        this.selectedPlayerIdentities = playerIdentities;
      });
  }

  /** Tracks when the mat tab is changed  */
  public matTabSelectionChange(index: number): void {
    this.store.dispatch(new SetWoodstockGiftingMatTabIndex(index));
  }

  /** Logic when player selection outputs identities. */
  public onPlayerIdentitiesChange(identity: AugmentedCompositeIdentity[]): void {
    const newIdentities = identity.filter(i => i?.extra?.hasWoodstock).map(i => i.woodstock);
    this.store.dispatch(new SetWoodstockGiftingSelectedPlayerIdentities(newIdentities));
  }

  /** Player identity selected */
  public playerIdentitySelected(identity: AugmentedCompositeIdentity): void {
    this.selectedPlayerIdentity = identity?.extra?.hasWoodstock ? identity.woodstock : null;
  }

  /** Called when a player inventory is selected and found. */
  public onInventoryFound(inventory: WoodstockMasterInventory): void {
    this.selectedPlayerInventory = inventory;
  }

  /** Produces a rejection message from a given identity, if it is rejected. */
  public identityRejectionFn(identity: AugmentedCompositeIdentity): string {
    if (!identity?.extra?.hasWoodstock) {
      return 'Player does not have a woodstock account at the selected endpoint. Player will be ignored.';
    }

    return null;
  }

  /** Called when a new profile is picked. */
  public onProfileChange(newProfile: WoodstockPlayerInventoryProfile): void {
    this.selectedPlayerInventoryProfileId = newProfile?.profileId;
  }
}
