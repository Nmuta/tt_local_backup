import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatChipListChange } from '@angular/material/chips';
import { BaseComponent } from '@components/base-component/base-component.component';
import { faHistory, faPassport, faUserCheck, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { ApolloPlayerInventoryProfile } from '@models/apollo';
import { GravityPseudoPlayerInventoryProfile } from '@models/gravity';
import { IdentityResultUnion } from '@models/identity-query.model';
import { OpusPlayerInventoryProfile } from '@models/opus';
import { SunrisePlayerInventoryProfile } from '@models/sunrise';
import { chain, isEmpty } from 'lodash';
import { NEVER, Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { catchError, filter, switchMap, takeUntil, tap } from 'rxjs/operators';

export type AcceptableInventoryProfileTypes =
  | SunrisePlayerInventoryProfile
  | OpusPlayerInventoryProfile
  | GravityPseudoPlayerInventoryProfile
  | ApolloPlayerInventoryProfile;

type AcceptableInventoryProfileTypesIntersectionIntermediate = SunrisePlayerInventoryProfile &
  OpusPlayerInventoryProfile &
  GravityPseudoPlayerInventoryProfile &
  ApolloPlayerInventoryProfile;

type AcceptableInventoryProfileTypesIntersection = Partial<
  AcceptableInventoryProfileTypesIntersectionIntermediate
> &
  AcceptableInventoryProfileTypes;

/** Base component for picking player profiles. */
@Component({
  template: '',
})
export abstract class PlayerInventoryProfilesPickerBaseComponent<
    IdentityResultType extends IdentityResultUnion,
    InventoryProfileType extends AcceptableInventoryProfileTypes
  >
  extends BaseComponent
  implements OnInit, OnChanges {
  @Input() public identity: IdentityResultType;
  @Input() public profileId: string | bigint;
  @Output() public profileIdChange = new EventEmitter<string | bigint>();

  public profiles: AcceptableInventoryProfileTypesIntersection[] = [];
  /** True while loading. */
  public get isLoading(): boolean {
    return isEmpty(this.profiles);
  }
  public error: unknown;

  public currentUserIcon = faUserCheck;
  public unusedUserIcon = faUserSlash;
  public externalIdIcon = faPassport;
  public lastUsedTimeIcon = faHistory;

  /** Intermediate event that is fired when @see identity changes. */
  private identity$ = new Subject<IdentityResultType>();

  /** Implement in order to retrieve concrete identity instance. */
  protected abstract getPlayerProfilesByIdentity(
    identity: IdentityResultType,
  ): Observable<InventoryProfileType[]>;

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.identity$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(_ => {
          this.profiles = [];
          this.error = null;
        }),
        filter(i => !!i),
        switchMap(i => this.getPlayerProfilesByIdentity(i)),
        catchError((error, _observable) => {
          this.error = error;
          return NEVER;
        }),
      )
      .subscribe(profiles => {
        this.profiles = (profiles as unknown) as AcceptableInventoryProfileTypesIntersection[];

        // clear selected profile if the currently set ID does not exist
        if (
          chain(profiles)
            .filter(p => p.profileId === this.profileId)
            .isEmpty()
        ) {
          this.profileId = null;
        }
      });

    this.identity$.next(this.identity);
  }

  /** Lifecycle hook. */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['identity']) {
      this.identity$.next(this.identity);
    }
  }

  /** Handle chip-list selection change. */
  public onSelectionChange(newSelection: MatChipListChange): void {
    const newProfile = newSelection?.value as InventoryProfileType;
    this.profileIdChange.next(newProfile?.profileId);
  }
}
