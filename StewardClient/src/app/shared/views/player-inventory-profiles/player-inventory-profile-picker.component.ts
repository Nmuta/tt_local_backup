import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import BigNumber from 'bignumber.js';
import {
  catchError,
  EMPTY,
  filter,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { MatChipListChange } from '@angular/material/chips';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { sortBy } from 'lodash';
import { GameTitle } from '@models/enums';
import { FullPlayerInventoryProfile } from '@models/player-inventory-profile';

export interface PlayerInventoryProfilePickerServiceContract {
  /** Game title the service contract is associated with. */
  gameTitle: GameTitle;

  /** Gets a player's report weight. */
  getPlayerInventoryProfiles$(xuid: BigNumber): Observable<FullPlayerInventoryProfile[]>;
}

/** Component to get and set a player's report weight. */
@Component({
  selector: 'player-inventory-profile-picker',
  templateUrl: './player-inventory-profile-picker.component.html',
  styleUrls: ['./player-inventory-profile-picker.component.scss'],
})
export class PlayerInventoryProfilePickerComponent
  extends BaseComponent
  implements OnInit, OnChanges
{
  /** The player inventory profile picker service contract. */
  @Input() service: PlayerInventoryProfilePickerServiceContract;
  /** The player identity. */
  @Input() public identity: IdentityResultAlpha;
  /** Output when profile change happens. */
  @Output() public profileChange = new EventEmitter<FullPlayerInventoryProfile>();

  public profiles: FullPlayerInventoryProfile[] = [];

  /** Intermediate event that is fired when @see identity changes. */
  private identity$ = new Subject<IdentityResultAlpha>();

  /** Gets the service contract game title. */
  public get gameTitle(): GameTitle {
    return this.service.gameTitle;
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.identity$
      .pipe(
        tap(_ => {
          this.profiles = [];
        }),
        filter(i => !!i),
        switchMap(i =>
          this.service.getPlayerInventoryProfiles$(i.xuid).pipe(
            catchError((_error, _observable) => {
              return EMPTY;
            }),
          ),
        ),
        map(profiles => sortBy(profiles, profile => profile.isCurrent).reverse()),
        takeUntil(this.onDestroy$),
      )
      .subscribe(profiles => {
        this.profiles = profiles;

        if (!!profiles[0]) {
          this.profileChange.emit(profiles[0]);
        }
      });

    this.identity$.next(this.identity);
  }

  /** Lifecycle hook. */
  public ngOnChanges(changes: BetterSimpleChanges<PlayerInventoryProfilePickerComponent>): void {
    if (!this.service) {
      throw new Error('No service is defined for player inventory profiles component.');
    }

    if (!!changes.identity) {
      this.identity$.next(this.identity);
    }
  }

  /** Handle chip-list selection change. */
  public onSelectionChange(newSelection: MatChipListChange): void {
    const newProfile = newSelection?.value as FullPlayerInventoryProfile;
    this.profileChange.emit(newProfile);
  }
}
