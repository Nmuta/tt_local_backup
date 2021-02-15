import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { faPassport, faUserCheck, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { IdentityResultUnion } from '@models/identity-query.model';
import { SunrisePlayerInventoryProfile } from '@models/sunrise';
import { chain, first, isEmpty } from 'lodash';
import { NEVER, Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { catchError, filter, switchMap, takeUntil, tap } from 'rxjs/operators';

export type AcceptableInventoryProfileTypes = SunrisePlayerInventoryProfile;

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

  public profiles: InventoryProfileType[] = [];
  /** True while loading. */
  public get isLoading(): boolean {
    return isEmpty(this.profiles);
  }
  public error: unknown;

  public selectedProfileId: bigint = null;

  public currentUserIcon = faUserCheck;
  public unusedUserIcon = faUserSlash;
  public externalIdIcon = faPassport;

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
          this.selectedProfileId = null;
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
        this.profiles = profiles;
        this.selectedProfileId = (chain(profiles).filter(p => p.isCurrent).first().value() ?? first(profiles)).profileId;
      });

    this.identity$.next(this.identity);
  }

  /** Lifecycle hook. */
  public ngOnChanges(_changes: SimpleChanges): void {
    this.identity$.next(this.identity);
  }
}
