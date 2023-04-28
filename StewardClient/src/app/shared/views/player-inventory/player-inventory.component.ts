import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { ApolloMasterInventory } from '@models/apollo';
import { IdentityResultUnion } from '@models/identity-query.model';
import { OpusMasterInventory } from '@models/opus';
import { SunriseMasterInventory } from '@models/sunrise';
import { combineLatest, EMPTY, Observable, Subject } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PlayerInventoryItemList } from '@models/master-inventory-item-list';
import { GameTitle } from '@models/enums';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { WoodstockMasterInventory } from '@models/woodstock';
import { SteelheadMasterInventory } from '@models/steelhead';

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
  makewhatToShowList(inventory: PlayerInventoryType): PlayerInventoryItemList[];
  inventoryFound(inventory: PlayerInventoryType): void;
}

/** Displays the sunrise user's player inventory. */
@Component({
  selector: 'player-inventory',
  templateUrl: './player-inventory.component.html',
  styleUrls: ['./player-inventory.component.scss'],
})
export class PlayerInventoryComponent extends BaseComponent implements OnInit, OnChanges {
  /** PlayerInventoryComponent's service contract. */
  @Input() public service: PlayerInventoryComponentContract<
    AcceptablePlayerInventoryTypeUnion,
    IdentityResultUnion
  >;
  /** Player Identity. */
  @Input() public identity: IdentityResultUnion;
  /** Inventory profile Id. */
  @Input() public profileId: BigNumber | string | undefined | null;

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
  public itemsToShow: PlayerInventoryItemList[] = [];

  /** Intermediate event that is fired when @see identity changes. */
  private identity$ = new Subject<IdentityResultUnion>();

  /** Intermediate event that is fired when @see profileId changes. */
  private profileId$ = new Subject<BigNumber | string | undefined | null>();

  /** The game title from service contract. */
  public get gameTitle(): GameTitle {
    return this.service.gameTitle;
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    const identityOrProfile$ = combineLatest([this.identity$, this.profileId$]).pipe(
      map(([identity, profileId]) => {
        return { identity: identity, profileId: profileId };
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
          const request$ = v.profileId
            ? this.service.getPlayerInventoryByIdentityAndProfileId$(v.identity, v.profileId)
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
    this.profileId$.next(this.profileId);
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

    if (changes?.profileId) {
      if (changes.profileId.currentValue !== changes.profileId.previousValue) {
        this.profileId$.next(this.profileId);
      }
    }
  }
}
