import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { ApolloMasterInventory } from '@models/apollo';
import { GravityPlayerInventoryBeta } from '@models/gravity';
import { IdentityResultUnion } from '@models/identity-query.model';
import { MasterInventoryItem } from '@models/master-inventory-item';
import { OpusMasterInventory } from '@models/opus';
import { SunriseMasterInventory } from '@models/sunrise';
import { combineLatest, NEVER, Observable, Subject } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';

export type AcceptablePlayerInventoryTypeUnion =
  | GravityPlayerInventoryBeta
  | SunriseMasterInventory
  | ApolloMasterInventory
  | OpusMasterInventory;

/** A model for identifying a property of an object and mapping that to a title & description for a simple expando. */
export interface PropertyToExpandoData<T> {
  property: keyof T;
  title: string;
  description: string;
}

/** Displays the sunrise user's player inventory. */
@Component({
  template: '',
})
export abstract class PlayerInventoryBaseComponent<
    PlayerInventoryType extends AcceptablePlayerInventoryTypeUnion,
    IdentityResultType extends IdentityResultUnion
  >
  extends BaseComponent
  implements OnInit, OnChanges {
  @Input() public identity: IdentityResultType;
  @Input() public profileId: bigint | undefined | null;
  @Output() public inventoryFound = new EventEmitter<PlayerInventoryType>();

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
    const identityOrProfile$ = combineLatest([this.identity$, this.profileId$]).pipe(
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
          debugger;
          const request$ = v.profileId
            ? this.getPlayerInventoryByIdentityAndProfileId(v.identity, v.profileId)
            : this.getPlayerInventoryByIdentity(v.identity);
          return request$.pipe(
            catchError((error, _observable) => {
              this.error = error;
              return NEVER;
            }),
          );
        }),
        catchError((error, _observable) => {
          this.error = error;
          return NEVER;
        }),
      )
      .subscribe(inventory => {
        this.inventory = inventory;
        this.inventoryFound.emit(inventory);
        this.whatToShow = this.makeWhatToShow();
      });

    this.identity$.next(this.identity);
    this.profileId$.next(this.profileId);
  }

  /** Lifecycle hook. */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['identity']) {
      if (changes.identity.currentValue !== changes.identity.previousValue) {
        this.identity$.next(this.identity);
      }
    }

    if (changes['profileId']) {
      if (changes.profileId.currentValue !== changes.profileId.previousValue) {
        this.profileId$.next(this.profileId);
      }
    }
  }

  /** Utility method for generating the expandos to show. */
  protected makeEntry(
    property: keyof PlayerInventoryType,
    title: string,
  ): PropertyToExpandoData<PlayerInventoryType> {
    let description = '';
    if (property !== 'creditRewards') {
      const count = ((this.inventory[property] as unknown) as MasterInventoryItem[]).reduce(
        (accumulator, entry) => accumulator + BigInt(entry.quantity),
        BigInt(0),
      );
      description = `${count} Total`;
    }

    return {
      property: property,
      title: title,
      description: description,
    };
  }
}
