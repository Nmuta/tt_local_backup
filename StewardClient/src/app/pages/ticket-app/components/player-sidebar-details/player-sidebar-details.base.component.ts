import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { ApolloPlayerDetails } from '@models/apollo';
import { GameTitleCodeName } from '@models/enums';
import { GravityPlayerDetails } from '@models/gravity';
import { OpusPlayerDetails } from '@models/opus';
import { SunrisePlayerDetails } from '@models/sunrise';
import BigNumber from 'bignumber.js';
import { EMPTY, Observable } from 'rxjs';
import { catchError, take, takeUntil, tap } from 'rxjs/operators';

type PlayerDetailsTitleUnion =
  | OpusPlayerDetails
  | GravityPlayerDetails
  | ApolloPlayerDetails
  | SunrisePlayerDetails;
type RequiredPlayerDetailsFields = { xuid: BigNumber };

/**
 * **Any** (read: exactly one) of the valid *PlayerDetails model types;
 *
 * Any implementing type must have some additional required fields @see RequiredPlayerDetailsFields
 */
type PlayerDetailsUnion = RequiredPlayerDetailsFields & PlayerDetailsTitleUnion;

type PlayerDetailsTitleIntersection = OpusPlayerDetails &
  GravityPlayerDetails &
  ApolloPlayerDetails &
  SunrisePlayerDetails;

/**
 * **All** of the valid *PlayerDetails model types, merged together.
 *
 * Fields common to all model types will be Required;
 * Fields *not* common to all model types will be Nullable;
 * Some fields are Required regardless.
 */
type PlayerDetailsIntersection = PlayerDetailsUnion & Partial<PlayerDetailsTitleIntersection>;

/** Defines the player details component. */
@Component({
  template: '',
})
export abstract class PlayerSidebarDetailsBaseComponent<T extends PlayerDetailsUnion>
  extends BaseComponent
  implements OnChanges
{
  /** Gamertag to lookup for player details. */
  @Input() public gamertag: string;

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;
  /** The player details */
  public playerDetails: T;
  /** A loosely typed version of @see playerDetails */
  public get playerDetailsComposite(): PlayerDetailsIntersection {
    return <PlayerDetailsIntersection>(<unknown>this.playerDetails);
  }

  public abstract gameTitle: GameTitleCodeName;

  constructor() {
    super();
  }

  /** Child class should implement. */
  public abstract makeRequest$(): Observable<T>;

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (!this.gamertag) {
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;

    const details$ = this.makeRequest$();
    details$
      .pipe(
        catchError(error => {
          this.isLoading = false;
          this.loadError = error;
          return EMPTY;
        }),
        take(1),
        tap(details => {
          this.isLoading = false;
          this.playerDetails = details;
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe();
  }
}
