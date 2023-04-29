import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { DeviceType, GameTitle } from '@models/enums';
import BigNumber from 'bignumber.js';
import { catchError, EMPTY, filter, map, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { GuidLikeString } from '@models/extended-types';
import { MatChipListChange } from '@angular/material/chips';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { sortBy } from 'lodash';

export interface PlayerInventoryProfile {
  profileId: BigNumber;
  externalProfileId: GuidLikeString;
  isCurrent: boolean;
}

export interface SteelheadPlayerInventoryProfile extends PlayerInventoryProfile{
  profileId: BigNumber;
  externalProfileId: GuidLikeString;
  isCurrent: boolean;
  isCurrentByTitleId: boolean;
  deviceType: DeviceType;
  titleId: number
}

export type ExtendedPlayerInventoryProfile = PlayerInventoryProfile & Partial<SteelheadPlayerInventoryProfile>;

export interface PlayerInventoryProfilePickerServiceContract {
  /** Game title the service contract is associated with. */
  gameTitle: GameTitle;

  /** Gets a player's report weight. */
  getPlayerInventoryProfiles$(xuid: BigNumber): Observable<PlayerInventoryProfile[]>;
}

/** Component to get and set a player's report weight. */
@Component({
  selector: 'player-inventory-profile-picker',
  templateUrl: './player-inventory-profile-picker.component.html',
  styleUrls: ['./player-inventory-profile-picker.component.scss'],
})
export class PlayerInventoryProfilePickerComponent extends BaseComponent implements OnInit, OnChanges {
  /** REVIEW-COMMENT: The report weight service. */
  @Input() service: PlayerInventoryProfilePickerServiceContract;
  /** REVIEW-COMMENT: Player identity. */
  @Input() public identity: IdentityResultAlpha;
  /** REVIEW-COMMENT: Output when profile change happens. */
  @Output() public profileChange = new EventEmitter<ExtendedPlayerInventoryProfile>();
  
  public profiles: ExtendedPlayerInventoryProfile[] = [];

  /** Intermediate event that is fired when @see identity changes. */
  private identity$ = new Subject<IdentityResultAlpha>();
  
  /** Gets the service contract game title. */
  public get gameTitle(): GameTitle {
    return this.service.gameTitle;
  }

  constructor() {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (!this.service) {
      throw new Error('No service is defined for player inventory profiles component.');
    }

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
    if (!!changes.identity) {
      this.identity$.next(this.identity);
    }
  }

  /** Handle chip-list selection change. */
  public onSelectionChange(newSelection: MatChipListChange): void {
    const newProfile = newSelection?.value as ExtendedPlayerInventoryProfile;
    this.profileChange.emit(newProfile);
  }
}
