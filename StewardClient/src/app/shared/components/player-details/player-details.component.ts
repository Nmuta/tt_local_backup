import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { GameTitleCodeNames } from '@models/enums';
import { Store } from '@ngxs/store';
import { GravityService } from '@services/gravity/gravity.service';
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
    public readonly sunriseService: SunriseService
  ) {}

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (!this.gamertag || !this.gameTitle) {
      return;
    }

    this.isLoading = true;
    this.loadError = undefined;
    let details$: Observable<any>;
    switch (this.gameTitle) {
      case GameTitleCodeNames.Street:
        details$ = this.gravityService.getPlayerDetailsByGamertag(
          this.gamertag
        );
        break;
      case GameTitleCodeNames.FH4:
        details$ = this.sunriseService.getPlayerDetailsByGamertag(
          this.gamertag
        );
        break;
      case GameTitleCodeNames.FM7:
        break;
      case GameTitleCodeNames.FH3:
        break;
      default:
        this.isLoading = false;
        this.loadError = 'Invalid game title.';
        return;
    }

    details$.subscribe(
      details => {
        console.log('here');
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
