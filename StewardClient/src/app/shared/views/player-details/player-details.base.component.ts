import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { ApolloPlayerDetails } from '@models/apollo';
import { GravityPlayerDetails } from '@models/gravity';
import { OpusPlayerDetails } from '@models/opus';
import { SunrisePlayerDetails } from '@models/sunrise';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

type PlayerDetailsTitleIntersection =
  | OpusPlayerDetails
  | GravityPlayerDetails
  | ApolloPlayerDetails
  | SunrisePlayerDetails;
type RequiredPlayerDetailsFields = { xuid: BigInt };
type PlayerDetailsIntersection = RequiredPlayerDetailsFields & PlayerDetailsTitleIntersection;

type PlayerDetailsTitleUnion = OpusPlayerDetails &
  GravityPlayerDetails &
  ApolloPlayerDetails &
  SunrisePlayerDetails;
type PlayerDetailsUnion = PlayerDetailsIntersection & Partial<PlayerDetailsTitleUnion>;

/** Defines the player details component. */
@Component({
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.scss'],
})
export abstract class PlayerDetailsBaseComponent<T extends PlayerDetailsIntersection>
  extends BaseComponent
  implements OnChanges {
  /** Gamertag to lookup for player details. */
  @Input() public gamertag: string;
  /** Emits xuid when it is found. May emit null/undefined for Gravity. */
  @Output() public xuidFoundEvent = new EventEmitter<BigInt>();

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: unknown;
  /** The player details */
  public playerDetails: T;
  /** A loosely typed version of @see playerDetails */
  public get playerDetailsUnion(): PlayerDetailsUnion {
    return <PlayerDetailsUnion>(<unknown>this.playerDetails);
  }

  constructor() {
    super();
  }

  /** Child class should implement. */
  public abstract makeRequest$(): Observable<T>;

  /** Initialization hook. */
  public ngOnChanges(): void {
    this.isLoading = true;
    this.loadError = undefined;

    const details$ = this.makeRequest$();
    details$.pipe(takeUntil(this.onDestroy$)).subscribe(
      details => {
        this.isLoading = false;
        this.playerDetails = details;
        this.xuidFoundEvent.emit(this.playerDetails.xuid);
      },
      error => {
        this.isLoading = false;
        this.loadError = error;
      },
    );
  }
}
