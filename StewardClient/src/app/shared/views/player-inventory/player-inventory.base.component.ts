import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { ApolloPlayerInventory } from '@models/apollo';
import { ApolloInventoryItem } from '@models/apollo/inventory-items';
import { GravityPlayerInventory } from '@models/gravity';
import { GravityInventoryItem } from '@models/gravity/inventory-items';
import { IdentityResultUnion } from '@models/identity-query.model';
import { OpusPlayerInventory } from '@models/opus';
import { SunrisePlayerInventory } from '@models/sunrise';
import { SunriseInventoryItem } from '@models/sunrise/inventory-items';
import { NEVER, Observable, Subject, zip } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';

export type AcceptablePlayerInventoryTypeUnion =
  | SunrisePlayerInventory
  | OpusPlayerInventory
  | ApolloPlayerInventory
  | GravityPlayerInventory;
export type AcceptablePlayerInventoryItemTypeUnion =
  | SunriseInventoryItem
  | ApolloInventoryItem
  | GravityInventoryItem;

/** A model for identifying a property of an object and mapping that to a title & description for a simple expando. */
export interface PropertyToExpandoData<T> {
  property: keyof T;
  title: string;
  description: string;
}

/** Displays the sunrise user's player inventory. */
@Component({
  selector: 'sunrise-player-inventory',
  template: '',
})
export abstract class PlayerInventoryBaseComponent<
    PlayerInventoryType extends AcceptablePlayerInventoryTypeUnion,
    InventoryItemType extends AcceptablePlayerInventoryItemTypeUnion,
    IdentityResultType extends IdentityResultUnion
  >
  extends BaseComponent
  implements OnInit, OnChanges {
  @Input() public identity: IdentityResultType;
  @Input() public profileId: bigint | undefined | null;

  /** The located inventory. */
  public inventory: PlayerInventoryType;
  /** The computed total number of cars. */
  public totalCars = BigInt(0);
  /** True while loading. */
  public get isLoading(): boolean {
    return !this.inventory;
  }
  /** The last error. */
  public error: unknown;

  /** The properties to display in a standard fashion. */
  public whatToShow: PropertyToExpandoData<PlayerInventoryType>[] = [];

  /** Intermediate event that is fired when @see identity changes. */
  private identity$ = new Subject<IdentityResultType>();

  /** Intermediate event that is fired when @see profileId changes. */
  private profileId$ = new Subject<bigint | undefined | null>();

  /** Implement in order to retrieve concrete identity instance. */
  protected abstract getPlayerInventoryByIdentity(
    identity: IdentityResultType,
  ): Observable<PlayerInventoryType>;

  /** Implement in order to retrieve concrete identity instance. */
  protected abstract getPlayerInventoryByIdentityAndProfileId(
    identity: IdentityResultType,
    profileId: bigint,
  ): Observable<PlayerInventoryType>;

  /** Implement to specify the expando tables to show. */
  protected abstract makeWhatToShow(): PropertyToExpandoData<PlayerInventoryType>[];

  /** Lifecycle hook. */
  public ngOnInit(): void {
    const identityOrProfile$ = zip(this.identity$, this.profileId$).pipe(
      takeUntil(this.onDestroy$),
      map(([identity, profileId]) => {
        return { identity: identity, profileId: profileId };
      }),
    );

    identityOrProfile$
      .pipe(
        tap(() => {
          this.inventory = null;
          this.error = null;
        }),
        filter(v => !!v.identity),
        switchMap(v => {
          if (v.profileId) {
            return this.getPlayerInventoryByIdentityAndProfileId(v.identity, v.profileId);
          } else {
            return this.getPlayerInventoryByIdentity(v.identity);
          }
        }),
        catchError((error, _observable) => {
          this.error = error;
          return NEVER;
        }),
      )
      .subscribe(inventory => {
        this.inventory = inventory;
        this.whatToShow = this.makeWhatToShow();
      });

    this.identity$.next(this.identity);
  }

  /** Lifecycle hook. */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['identity']) {
      this.identity$.next(this.identity);
    }

    if (changes['profileId']) {
      this.profileId$.next(this.profileId);
    }
  }

  /** Utility method for generating the expandos to show. */
  protected makeEntry(
    property: keyof PlayerInventoryType,
    title: string,
  ): PropertyToExpandoData<PlayerInventoryType> {
    const count = ((this.inventory[property] as unknown) as InventoryItemType[]).reduce(
      (accumulator, entry) => accumulator + entry.quantity,
      BigInt(0),
    );
    return {
      property: property,
      title: title,
      description: `${count} Total`,
    };
  }
}
