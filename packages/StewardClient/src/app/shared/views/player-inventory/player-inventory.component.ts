import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { ApolloMasterInventory } from '@models/apollo';
import { IdentityResultUnion } from '@models/identity-query.model';
import { OpusMasterInventory } from '@models/opus';
import { SunriseMasterInventory } from '@models/sunrise';
import { combineLatest, EMPTY, Observable, Subject } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PlayerInventoryItemListWithService } from '@models/master-inventory-item-list';
import { GameTitle } from '@models/enums';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { WoodstockMasterInventory } from '@models/woodstock';
import { SteelheadMasterInventory } from '@models/steelhead';
import { OldPlayerInventoryProfile } from '@models/player-inventory-profile';

export type AcceptablePlayerInventoryTypeUnion =
  | SunriseMasterInventory
  | ApolloMasterInventory
  | OpusMasterInventory
  | WoodstockMasterInventory
  | SteelheadMasterInventory;

/** A model for identifying a property of an object and mapping that to a title & description for a simple expando. */
export interface PropertyToExpandoData<T> {
  property: keyof T;
  title: string;
  description: string;
}

/** Service contract for PlayerInventoryComponent */
export interface PlayerInventoryComponentContract<
  PlayerInventoryType extends AcceptablePlayerInventoryTypeUnion,
  IdentityResultType extends IdentityResultUnion,
> {
  gameTitle: GameTitle;
  getPlayerInventoryByIdentity$(identity: IdentityResultType): Observable<PlayerInventoryType>;
  getPlayerInventoryByIdentityAndProfileId$(
    identity: IdentityResultType,
    profileId: BigNumber | string,
  ): Observable<PlayerInventoryType>;
  makewhatToShowList(inventory: PlayerInventoryType): PlayerInventoryItemListWithService[];
  inventoryFound(inventory: PlayerInventoryType): void;
}

/** Displays the sunrise user's player inventory. */
@Component({
  selector: 'player-inventory',
  templateUrl: './player-inventory.component.html',
  styleUrls: ['./player-inventory.component.scss'],
})
export class PlayerInventoryComponent extends BaseComponent implements OnInit, OnChanges {
  /** Service contract for PlayerInventoryComponentContract. */
  @Input() public service: PlayerInventoryComponentContract<
    AcceptablePlayerInventoryTypeUnion,
    IdentityResultUnion
  >;
  /** Player Identity. */
  @Input() public identity: IdentityResultUnion;
  /** Inventory profile. */
  @Input() public profile: OldPlayerInventoryProfile;

  /** The located inventory. */
  public inventory: AcceptablePlayerInventoryTypeUnion;
  /** The computed total number of cars. */
  public totalCars = new BigNumber(0);
  /** True while loading. */
  public get isLoading(): boolean {
    return !this.inventory;
  }
  /** The last error. */
  public error: unknown;

  /** The properties to display in a standard fashion. */
  public itemsToShow: PlayerInventoryItemListWithService[] = [];

  /** Intermediate event that is fired when @see identity changes. */
  private identity$ = new Subject<IdentityResultUnion>();

  /** Intermediate event that is fired when @see profile changes. */
  private profile$ = new Subject<OldPlayerInventoryProfile>();

  /** The game title from service contract. */
  public get gameTitle(): GameTitle {
    return this.service.gameTitle;
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    const identityOrProfile$ = combineLatest([this.identity$, this.profile$]).pipe(
      map(([identity, profile]) => {
        return { identity: identity, profile: profile };
      }),
      takeUntil(this.onDestroy$),
    );

    identityOrProfile$
      .pipe(
        tap(() => {
          this.inventory = null;
          this.error = null;
        }),
        filter(v => !!v.identity),
        switchMap(v => {
          const request$ = v.profile
            ? this.service.getPlayerInventoryByIdentityAndProfileId$(
                v.identity,
                v.profile.profileId,
              )
            : this.service.getPlayerInventoryByIdentity$(v.identity);
          return request$.pipe(
            catchError((error, _observable) => {
              this.error = error;
              return EMPTY;
            }),
          );
        }),
        catchError((error, _observable) => {
          this.error = error;
          return EMPTY;
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(inventory => {
        this.inventory = inventory;
        this.service.inventoryFound(inventory);
        this.itemsToShow = this.service.makewhatToShowList(this.inventory);
      });

    this.identity$.next(this.identity);
    this.profile$.next(this.profile);
  }

  /** Lifecycle hook. */
  public ngOnChanges(changes: BetterSimpleChanges<PlayerInventoryComponent>): void {
    if (!this.service) {
      throw new Error('No service provided for PlayerInventoryComponent');
    }

    if (changes?.identity) {
      if (changes.identity.currentValue !== changes.identity.previousValue) {
        this.identity$.next(this.identity);
      }
    }

    if (changes?.profile) {
      if (changes.profile.currentValue !== changes.profile.previousValue) {
        this.profile$.next(this.profile);
      }
    }
  }
}
