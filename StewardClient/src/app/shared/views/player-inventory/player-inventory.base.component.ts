import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { ApolloMasterInventory } from '@models/apollo';
import { GravityPlayerInventoryBeta } from '@models/gravity';
import { IdentityResultUnion } from '@models/identity-query.model';
import { MasterInventoryItem } from '@models/master-inventory-item';
import { OpusMasterInventory } from '@models/opus';
import { SunriseMasterInventory } from '@models/sunrise/sunrise-master-inventory.model';
import { NEVER, Observable, Subject } from 'rxjs';
import { catchError, filter, switchMap, takeUntil, tap } from 'rxjs/operators';

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

  /** Implement in order to retrieve concrete identity instance. */
  protected abstract getPlayerInventoryByIdentity(
    identity: IdentityResultType,
  ): Observable<PlayerInventoryType>;

  /** Implement to specify the expando tables to show. */
  protected abstract makeWhatToShow(): PropertyToExpandoData<PlayerInventoryType>[];

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.identity$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(() => {
          this.inventory = null;
          this.error = null;
        }),
        filter(i => !!i),
        switchMap(identity =>
          this.getPlayerInventoryByIdentity(identity).pipe(
            catchError((error, _observable) => {
              this.error = error;
              return NEVER;
            }),
          ),
        ),
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
  public ngOnChanges(_changes: SimpleChanges): void {
    this.identity$.next(this.identity);
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
