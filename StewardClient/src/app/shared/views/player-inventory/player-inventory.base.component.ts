import BigNumber from 'bignumber.js';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { ApolloMasterInventory } from '@models/apollo';
import { GravityPlayerInventory } from '@models/gravity';
import { IdentityResultUnion } from '@models/identity-query.model';
import { MasterInventoryItem } from '@models/master-inventory-item';
import { OpusMasterInventory } from '@models/opus';
import { SunriseMasterInventory } from '@models/sunrise';
import { combineLatest, EMPTY, Observable, Subject } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PlayerInventoryItemList } from '@models/master-inventory-item-list';
import { GameTitle } from '@models/enums';
import { cloneDeep } from 'lodash';

export type AcceptablePlayerInventoryTypeUnion =
  | GravityPlayerInventory
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
    IdentityResultType extends IdentityResultUnion,
  >
  extends BaseComponent
  implements OnInit, OnChanges
{
  @Input() public identity: IdentityResultType;
  @Input() public profileId: BigNumber | string | undefined | null;
  @Output() public inventoryFound = new EventEmitter<PlayerInventoryType>();

  /** The located inventory. */
  public inventory: PlayerInventoryType;
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
  private identity$ = new Subject<IdentityResultType>();

  /** Intermediate event that is fired when @see profileId changes. */
  private profileId$ = new Subject<BigNumber | string | undefined | null>();

  public abstract gameTitle: GameTitle;

  /** Implement in order to retrieve concrete identity instance. */
  protected abstract getPlayerInventoryByIdentity$(
    identity: IdentityResultType,
  ): Observable<PlayerInventoryType>;

  /** Implement in order to retrieve concrete identity instance. */
  protected abstract getPlayerInventoryByIdentityAndProfileId$(
    identity: IdentityResultType,
    profileId: BigNumber | string,
  ): Observable<PlayerInventoryType>;

  /** Implement to specify the expando tables to show. */
  protected abstract makewhatToShowList(): PlayerInventoryItemList[];

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
            ? this.getPlayerInventoryByIdentityAndProfileId$(v.identity, v.profileId)
            : this.getPlayerInventoryByIdentity$(v.identity);
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
        this.inventoryFound.emit(inventory);
        this.itemsToShow = this.makewhatToShowList();
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

  /** Utility method for generating master inventory list to display. */
  protected makeItemList(title: string, items: MasterInventoryItem[]): PlayerInventoryItemList {
    return {
      title: title,
      description: `${items.length} Total`,
      items: items,
    };
  }

  /** Utility method for adding warnings to a inventory list. Creates new list. */
  protected addWarnings(
    list: PlayerInventoryItemList,
    ids: Set<string>,
    icon: string,
    color: 'warn' | 'accent' | 'primary',
    text: string,
  ): PlayerInventoryItemList {
    const newList = cloneDeep(list);
    let modifiedAny = false;
    for (const item of newList.items) {
      if (ids.has(item.id.toString())) {
        modifiedAny = true;
        item.warnings = item.warnings ?? [];
        item.warnings.push({ icon, color, text });
      }
    }

    return modifiedAny ? newList : list;
  }
}
