import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base-component.component';
import { environment } from '@environments/environment';
import { GameTitleCodeNames } from '@models/enums';
import { Store } from '@ngxs/store';
import { ApolloService } from '@services/apollo';
import { GravityService } from '@services/gravity/gravity.service';
import { OpusService } from '@services/opus';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { UserModel } from '@shared/models/user.model';
import { WindowService } from '@shared/services/window';
import {
  ResetAccessToken,
  ResetUserProfile,
} from '@shared/state/user/user.actions';
import { Observable } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';

/** Defines the player details component. */
export abstract class PlayerDetailsComponentBase<T>
  extends BaseComponent
  implements OnChanges {
  /** Gamertag to lookup for player details. */
  @Input() public gamertag: string;
  /** Emits xuid when it is found. */
  @Output() public xuidFoundEvent = new EventEmitter<string>();

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: any;
  /** The player details */
  public playerDetails: T;

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
    details$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        details => {
          this.isLoading = false;
          this.playerDetails = details;
          this.xuidFoundEvent.emit((this.playerDetails as any).xuid);
        },
        error => {
          this.isLoading = false;
          this.loadError = error;
        }
      );
  }
}
