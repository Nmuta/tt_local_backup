import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { Store } from '@ngxs/store';
import { UserModel } from '@shared/models/user.model';
import { WindowService } from '@shared/services/window';
import {
  ResetAccessToken,
  ResetUserProfile,
} from '@shared/state/user/user.actions';

/** Defines the player details component. */
@Component({
  selector: 'player-details',
  templateUrl: './player-details.html',
  styleUrls: ['./player-details.scss'],
})
export class PlayerDetailsComponent {}
