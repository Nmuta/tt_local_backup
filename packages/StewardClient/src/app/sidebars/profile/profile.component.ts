import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { Clipboard } from '@helpers/clipboard';
import { GameTitle, UserRole } from '@models/enums';
import { Select, Store } from '@ngxs/store';
import { V2UsersService } from '@services/api-v2/users/users.service';
import { WoodstockPlayerNotificationsService } from '@services/api-v2/woodstock/player/notifications/woodstock-player-notifications.service';
import { WindowService } from '@services/window';
import { EmailAddresses } from '@shared/constants';
import { UserModel } from '@shared/models/user.model';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import {
  ApplyProfileOverrides,
  BreakAccessToken,
  LogoutUser,
  RecheckAuth,
} from '@shared/state/user/user.actions';
import { UserState } from '@shared/state/user/user.state';
import { keys } from 'lodash';
import { combineLatest, Observable } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

/** Defines the profile component. */
@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent extends BaseComponent implements OnInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;

  public user: UserModel;
  public teamLead: UserModel;
  public loading: boolean;
  public accessToken: string;

  public profileTabVisible = false;
  public showDevTools: boolean;

  public syncAuthUrl: string;

  public deleteNotificationsActionMonitor = new ActionMonitor('DELETE player notifications');
  public deleteNotificationsFormControls = {
    xuid: new UntypedFormControl(null, Validators.required),
  };
  public deleteNotificationsFormGroup = new UntypedFormGroup(this.deleteNotificationsFormControls);

  public readonly adminTeamLead = 'Live Ops Admins';
  public readonly adminTeamLeadEmail = EmailAddresses.LiveOpsAdmins;

  public getTeamLeadMonitor = new ActionMonitor(`GET user's team lead`);

  public guestAccountStatus: undefined | boolean = undefined;
  public activeRole: UserRole;
  public showProfileOverrideOptions: boolean;
  public roleList: UserRole[] = keys(UserRole).map(key => UserRole[key]);

  constructor(
    private readonly router: Router,
    private readonly store: Store,
    private readonly clipboard: Clipboard,
    private readonly woodstockPlayerNotificationsService: WoodstockPlayerNotificationsService,
    private readonly v2UsersService: V2UsersService,
    private readonly windowService: WindowService,
  ) {
    super();
  }

  /** Logic for the OnInit component lifecycle. */
  public ngOnInit(): void {
    this.accessToken = this.store.selectSnapshot<string | null | undefined>(UserState.accessToken);
    this.loading = true;

    UserState.latestValidProfile$(this.profile$)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        profile => {
          this.loading = false;
          this.user = profile;
          this.showDevTools = profile.role === UserRole.LiveOpsAdmin;
          this.syncAuthUrl = [
            `/auth/sync-state?accessToken=${this.accessToken}`,
            `emailAddress=${profile.emailAddress}`,
            `role=${profile.role}`,
            `name=${profile.name}`,
            `objectId=${profile.objectId}`,
          ].join('&');

          this.getTeamLead(this.user);
        },
        _error => {
          this.loading = false;
        },
      );

    const profile = this.store.selectSnapshot<UserModel>(UserState.profileForceTrueData); // Force true data so live ops admins can change their settings around
    this.showProfileOverrideOptions = profile.role === UserRole.LiveOpsAdmin;
    if (this.showProfileOverrideOptions) {
      this.activeRole = profile.overrides?.role;
      this.guestAccountStatus = profile.overrides?.isMicrosoftEmail;
    }
  }

  /** Copys the state access token to clipboard */
  public copyAccessToken(): void {
    this.clipboard.copyMessage(this.accessToken);
  }

  /** Copys the sync path to the clipboard. */
  public copySyncPath(): void {
    this.clipboard.copyMessage(this.syncAuthUrl);
  }

  /** Opens the auth page in a new tab. */
  public logout(): void {
    this.store.dispatch(new LogoutUser(this.router.routerState.snapshot.url));
  }

  /** Breaks the user's access token. */
  public break(): void {
    this.store.dispatch(new BreakAccessToken());
  }

  /** Changes the profile tab visiblity. */
  public changeProfileTabVisibility(): void {
    this.profileTabVisible = !this.profileTabVisible;
  }

  /** Refresh the user role */
  public refreshLoginToken(): void {
    this.store
      .dispatch(new RecheckAuth())
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(_ => {
        this.user = this.store.selectSnapshot<UserModel>(UserState.profile);
      });
  }

  /** Delete a player's notifications. */
  public deletePlayerNotifications(): void {
    if (!this.deleteNotificationsFormGroup.valid) {
      return;
    }

    this.deleteNotificationsActionMonitor = this.deleteNotificationsActionMonitor.repeat();
    const failedTitles: GameTitle[] = [];
    const woodstock = this.woodstockPlayerNotificationsService
      .deleteAllPlayerNotifications$(this.deleteNotificationsFormControls.xuid.value)
      .pipe(
        catchError(e => {
          failedTitles.push(GameTitle.FH5);
          throw e;
        }),
      );

    combineLatest([woodstock])
      .pipe(this.deleteNotificationsActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        if (failedTitles.length > 0) {
          this.deleteNotificationsActionMonitor.status.error = `Failed to delete notifications for titles: ${failedTitles.join(
            ', ',
          )}`;
          return;
        }

        this.deleteNotificationsFormControls.xuid.setValue(null);
      });
  }

  /** Sets the new active role to the live ops secondary role in state profile. */
  public changeActiveRole($event: MatSelectChange): void {
    this.store.dispatch(new ApplyProfileOverrides({ role: $event.value })).subscribe(() => {
      this.windowService.location().reload();
    });
  }

  /** Sets the new active role to the live ops secondary role in state profile. */
  public changeGuestAccountStatus($event: MatSelectChange): void {
    this.store
      .dispatch(new ApplyProfileOverrides({ isMicrosoftEmail: $event.value }))
      .subscribe(() => {
        this.windowService.location().reload();
      });
  }

  private getTeamLead(user: UserModel): void {
    this.getTeamLeadMonitor = this.getTeamLeadMonitor.repeat();
    this.v2UsersService
      .getTeamLead$(user.objectId)
      .pipe(this.getTeamLeadMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(teadLead => {
        this.teamLead = teadLead;
      });
  }
}
