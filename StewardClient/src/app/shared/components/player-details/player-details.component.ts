import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
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

/** Defines the player details component. */
@Component({
  selector: 'player-details',
  templateUrl: './player-details.html',
  styleUrls: ['./player-details.scss'],
})
export class PlayerDetailsComponent implements OnChanges {
  @Input() public gameTitle: string;
  @Input() public gamertag: string;

  /** True while waiting on a request. */
  public isLoading = true;
  /** The error received while loading. */
  public loadError: any;
  /** The player details */
  public playerDetails: any;

  constructor(
    public readonly gravityService: GravityService,
    public readonly sunriseService: SunriseService,
    public readonly apolloService: ApolloService,
    public readonly opusService: OpusService
  ) {}

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (!this.gamertag || !this.gameTitle) {
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;
    let details$: Observable<any>;

    if (this.gameTitle === GameTitleCodeNames.Street) {
      details$ = this.gravityService.getPlayerDetailsByGamertag(this.gamertag);
    } else if (this.gameTitle === GameTitleCodeNames.FH4) {
      details$ = this.sunriseService.getPlayerDetailsByGamertag(this.gamertag);
    } else if (this.gameTitle === GameTitleCodeNames.FM7) {
      details$ = this.apolloService.getPlayerDetailsByGamertag(this.gamertag);
    } else if (this.gameTitle === GameTitleCodeNames.FH3) {
      details$ = this.opusService.getPlayerDetailsByGamertag(this.gamertag);
    } else {
      this.isLoading = false;
      this.loadError = 'Invalid game title.';
      return;
    }

    details$.subscribe(
      details => {
        this.isLoading = false;
        this.playerDetails = details;
      },
      error => {
        this.isLoading = false;
        this.loadError = error;
      }
    );
  }
}
