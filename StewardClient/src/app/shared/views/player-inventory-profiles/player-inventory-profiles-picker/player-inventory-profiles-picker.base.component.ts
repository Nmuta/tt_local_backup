import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatChipListChange } from '@angular/material/chips';
import { BaseComponent } from '@components/base-component/base.component';
import { ApolloPlayerInventoryProfile } from '@models/apollo';
import { IdentityResultUnion } from '@models/identity-query.model';
import { OpusPlayerInventoryProfile } from '@models/opus';
import { SunrisePlayerInventoryProfile } from '@models/sunrise';
import { SteelheadPlayerInventoryProfile } from '@models/steelhead';
import { WoodstockPlayerInventoryProfile } from '@models/woodstock';
import { isEmpty, sortBy } from 'lodash';
import { EMPTY, Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { catchError, filter, switchMap, takeUntil, tap, map } from 'rxjs/operators';
import { BetterSimpleChanges } from '@helpers/simple-changes';

export type AcceptableInventoryProfileTypes =
  | WoodstockPlayerInventoryProfile
  | SteelheadPlayerInventoryProfile
  | SunrisePlayerInventoryProfile
  | OpusPlayerInventoryProfile
  | ApolloPlayerInventoryProfile;

type AcceptableInventoryProfileTypesIntersectionIntermediate = WoodstockPlayerInventoryProfile &
  SteelheadPlayerInventoryProfile &
  SunrisePlayerInventoryProfile &
  OpusPlayerInventoryProfile &
  ApolloPlayerInventoryProfile;

type AcceptableInventoryProfileTypesIntersection =
  Partial<AcceptableInventoryProfileTypesIntersectionIntermediate> &
    AcceptableInventoryProfileTypes;

/** Base component for picking player profiles. */
@Component({
  template: '',
})
export abstract class PlayerInventoryProfilesPickerBaseComponent<
    IdentityResultType extends IdentityResultUnion,
    InventoryProfileType extends AcceptableInventoryProfileTypes,
  >
  extends BaseComponent
  implements OnInit, OnChanges
{
  /** REVIEW-COMMENT: Player identity. */
  @Input() public identity: IdentityResultType;
  /** REVIEW-COMMENT: Output when profile change happens. */
  @Output() public profileChange = new EventEmitter<InventoryProfileType>();

  public profiles: AcceptableInventoryProfileTypesIntersection[] = [];
  /** True while loading. */
  public get isLoading(): boolean {
    return isEmpty(this.profiles);
  }
  public error: unknown;

  /** Intermediate event that is fired when @see identity changes. */
  private identity$ = new Subject<IdentityResultType>();

  /** Implement in order to retrieve concrete identity instance. */
  protected abstract getPlayerProfilesByIdentity$(
    identity: IdentityResultType,
  ): Observable<InventoryProfileType[]>;

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.identity$
      .pipe(
        tap(_ => {
          this.profiles = [];
          this.error = null;
        }),
        filter(i => !!i),
        switchMap(i =>
          this.getPlayerProfilesByIdentity$(i).pipe(
            catchError((error, _observable) => {
              this.error = error;
              return EMPTY;
            }),
          ),
        ),
        map(profiles => sortBy(profiles, profile => profile.isCurrent).reverse()),
        takeUntil(this.onDestroy$),
      )
      .subscribe(profiles => {
        this.profiles = profiles as unknown as AcceptableInventoryProfileTypesIntersection[];

        if (!!profiles[0]) {
          this.profileChange.emit(profiles[0]);
        }
      });

    this.identity$.next(this.identity);
  }

  /** Lifecycle hook. */
  public ngOnChanges(
    changes: BetterSimpleChanges<
      PlayerInventoryProfilesPickerBaseComponent<IdentityResultType, InventoryProfileType>
    >,
  ): void {
    if (changes['identity']) {
      this.identity$.next(this.identity);
    }
  }

  /** Handle chip-list selection change. */
  public onSelectionChange(newSelection: MatChipListChange): void {
    const newProfile = newSelection?.value as InventoryProfileType;
    this.profileChange.emit(newProfile);
  }
}
