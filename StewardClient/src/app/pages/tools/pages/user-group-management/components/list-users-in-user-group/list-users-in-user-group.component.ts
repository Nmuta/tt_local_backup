import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { BaseComponent } from '@components/base-component/base.component';
import { hasAccessToRestrictedFeature, RestrictedFeature } from '@environments/environment';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { tryParseBigNumbers } from '@helpers/bignumbers';
import { BackgroundJob } from '@models/background-job';
import { BasicPlayer, BasicPlayerAction } from '@models/basic-player';
import { BasicPlayerList } from '@models/basic-player-list';
import { GameTitle } from '@models/enums';
import { GetUserGroupUsersResponse } from '@models/get-user-group-users-response';
import { LspGroup } from '@models/lsp-group';
import { UserModel } from '@models/user.model';
import { Store } from '@ngxs/store';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { UserState } from '@shared/state/user/user.state';
import BigNumber from 'bignumber.js';
import { chain, remove } from 'lodash';
import { Observable, takeUntil, switchMap, tap } from 'rxjs';

export interface ListUsersInGroupServiceContract {
  gameTitle: GameTitle;
  getPlayersInUserGroup$(
    userGroup: LspGroup,
    startIndex: number,
    maxResults: number,
  ): Observable<GetUserGroupUsersResponse>;
  deletePlayerFromUserGroup$(
    playerList: BasicPlayerList,
    userGroup: LspGroup,
  ): Observable<BasicPlayerAction>;
  deletePlayersFromUserGroupUsingBackgroundTask$(
    playerList: BasicPlayerList,
    userGroup: LspGroup,
  ): Observable<BackgroundJob<void>>;
  addPlayersToUserGroupUsingBackgroundTask$(
    playerList: BasicPlayerList,
    userGroup: LspGroup,
  ): Observable<BackgroundJob<void>>;
  deleteAllPlayersFromUserGroup$(userGroup: LspGroup): Observable<void>;
  // Represent user group too large to load users
  largeUserGroups: BigNumber[];
}

enum UserGroupManagementAction {
  Add = 'add',
  Remove = 'remove',
}

interface UserGroupManagementFailures {
  players: BasicPlayerAction[];
  action: UserGroupManagementAction;
  copyToClipboard?: string;
}

/** A player object within a user group. */
export interface PlayerInUserGroup {
  xuid: BigNumber;
  gamertag: string;
  /** Monitor when deleting the player from a user group. */
  deleteMonitor?: ActionMonitor;
}

/** Tool that creates new user groups. */
@Component({
  selector: 'list-users-in-user-group',
  templateUrl: './list-users-in-user-group.component.html',
  styleUrls: ['./list-users-in-user-group.component.scss'],
})
export class ListUsersInGroupComponent
  extends BaseComponent
  implements OnChanges, OnInit, AfterViewInit
{
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChildren(MatCheckbox) checkboxes: QueryList<MatCheckbox>;

  /** Service contract for create user groups component. */
  @Input() service: ListUsersInGroupServiceContract;
  /** User group to list users and manage. */
  @Input() userGroup: LspGroup;

  /** Add/remove bulk xuids or gamertags submit form */
  public formControls = {
    userIdentifications: new FormControl('', Validators.required),
    useGamertags: new FormControl(false),
  };

  public formGroup = new FormGroup(this.formControls);

  public getMonitor = new ActionMonitor('Get players in user group');
  public deleteAllMonitor = new ActionMonitor('Delete all players in user group');
  public deletePlayersMonitor = new ActionMonitor('Delete specified players in user group');
  public addPlayersMonitor = new ActionMonitor('Add specified players in user group');
  public allPlayers: PlayerInUserGroup[] = [];
  public userGamertags: boolean = false;

  public userHasWritePerms: boolean = false;
  public userHasRemoveAllPerms: boolean = false;
  public isGroupTooLarge: boolean = false;
  public readonly incorrectPermsTooltip = 'This action is restricted for your user role';
  public displayedColumns = ['xuid', 'gamertag', 'actions'];
  public playersDataSource = new BetterMatTableDataSource<PlayerInUserGroup>();
  public failedActionForUsers: UserGroupManagementFailures;
  public isAllUsersGroup: boolean = false;
  public disallowDeleteAllUsers: boolean = false;

  constructor(
    private readonly backgroundJobService: BackgroundJobService,
    private readonly store: Store,
  ) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    const user = this.store.selectSnapshot<UserModel>(UserState.profile);
    this.userHasWritePerms = hasAccessToRestrictedFeature(
      RestrictedFeature.UserGroupWrite,
      this.service.gameTitle,
      user.role,
    );
    this.userHasRemoveAllPerms = hasAccessToRestrictedFeature(
      RestrictedFeature.UserGroupRemoveAll,
      this.service.gameTitle,
      user.role,
    );
  }

  /** Lifecycle hook */
  public ngOnChanges(changes: SimpleChanges): void {
    if (!this.service) {
      throw new Error('No service contract was provided for ListUsersInGroupComponent');
    }
    this.deleteAllMonitor = this.deleteAllMonitor.repeat();
    this.deletePlayersMonitor = this.deletePlayersMonitor.repeat();
    this.addPlayersMonitor = this.addPlayersMonitor.repeat();
    this.getMonitor = this.getMonitor.repeat();

    this.allPlayers = [];
    this.playersDataSource.data = this.allPlayers;
    if (changes.userGroup && !!this.userGroup) {
      this.isAllUsersGroup = this.userGroup?.id.isEqualTo(0);
      this.disallowDeleteAllUsers = !!this.service.largeUserGroups.find(x =>
        x.isEqualTo(this.userGroup?.id),
      );
      this.isGroupTooLarge = this.isLargeUserGroup();
      this.playersDataSource.paginator = this.paginator;
      this.playersDataSource.paginator.pageIndex = 0;
      this.getPlayersInUserGroup();
    }
  }

  /** Lifecycle hook */
  public ngAfterViewInit(): void {
    this.playersDataSource.paginator = this.paginator;
  }

  /** Hook into paginator page changes. */
  public paginatorPageChange() {
    this.getPlayersInUserGroup();
  }

  /** Deletes specified users from a user group. */
  public deleteUsersInGroup(): void {
    this.deletePlayersMonitor = this.deletePlayersMonitor.repeat();
    this.failedActionForUsers = {
      players: [],
      action: UserGroupManagementAction.Remove,
    };

    const playerList = this.getBasicPlayerList(
      this.formControls.userIdentifications.value,
      this.formControls.useGamertags.value,
    );

    this.service
      .deletePlayersFromUserGroupUsingBackgroundTask$(playerList, this.userGroup)
      .pipe(
        switchMap(response => {
          return this.backgroundJobService.waitForBackgroundJobToComplete<BasicPlayer>(
            response as BackgroundJob<void>,
          );
        }),
        this.deletePlayersMonitor.monitorSingleFire(),
        takeUntil(this.onDestroy$),
      )
      .subscribe((response: BasicPlayerAction[]) => {
        this.formGroup.reset({
          useGamertags: this.formControls.useGamertags.value,
        });
        this.allPlayers = [];
        this.playersDataSource.data = this.allPlayers;
        this.playersDataSource.paginator.pageIndex = 0;
        this.getPlayersInUserGroup();

        const failedUsers = response.filter(data => !!data.error);
        this.failedActionForUsers.players = failedUsers;
        this.failedActionForUsers.copyToClipboard = failedUsers
          .map(player => player.gamertag ?? player.xuid)
          .join('\n');
        this.clearCheckboxes();
      });
  }

  /** Adds specified users to a user group. */
  public addUsersInGroup(): void {
    this.addPlayersMonitor = this.addPlayersMonitor.repeat();
    this.failedActionForUsers = {
      players: [],
      action: UserGroupManagementAction.Add,
    };

    const playerList = this.getBasicPlayerList(
      this.formControls.userIdentifications.value,
      this.formControls.useGamertags.value,
    );

    this.service
      .addPlayersToUserGroupUsingBackgroundTask$(playerList, this.userGroup)
      .pipe(
        switchMap(response => {
          return this.backgroundJobService.waitForBackgroundJobToComplete<BasicPlayer>(
            response as BackgroundJob<void>,
          );
        }),
        this.addPlayersMonitor.monitorSingleFire(),
        takeUntil(this.onDestroy$),
      )
      .subscribe((response: BasicPlayerAction[]) => {
        this.formGroup.reset({
          useGamertags: this.formControls.useGamertags.value,
        });
        this.allPlayers = [];
        this.playersDataSource.data = this.allPlayers;
        this.playersDataSource.paginator.pageIndex = 0;
        this.getPlayersInUserGroup();

        const failedUsers = response.filter(data => !!data.error);
        this.failedActionForUsers.players = failedUsers;
        this.failedActionForUsers.copyToClipboard = failedUsers
          .map(player => player.gamertag ?? player.xuid)
          .join('\n');
        this.clearCheckboxes();
      });
  }

  /** Deletes a player from a user group */
  public deletePlayerFromUserGroup(playerToDelete: PlayerInUserGroup): void {
    playerToDelete.deleteMonitor = playerToDelete.deleteMonitor.repeat();

    const playerList = {
      xuids: [playerToDelete.xuid],
      gamertags: null,
    };

    this.service
      .deletePlayerFromUserGroup$(playerList, this.userGroup)
      .pipe(
        // Utilize the action monitor error logic
        tap((result: BasicPlayerAction) => {
          if (!!result?.error) {
            throw new Error('Failed to remove player from user group');
          }
        }),
        playerToDelete.deleteMonitor.monitorSingleFire(),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        remove(this.allPlayers, player => {
          return player?.xuid.isEqualTo(playerToDelete.xuid);
        });
        this.playersDataSource.data = this.allPlayers;
      });
  }

  /** Deletes all users from a user group. */
  public deleteAllUsersInGroup(): void {
    this.deleteAllMonitor = this.deleteAllMonitor.repeat();
    this.service
      .deleteAllPlayersFromUserGroup$(this.userGroup)
      .pipe(this.deleteAllMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.allPlayers = [];
        this.playersDataSource.data = this.allPlayers;
      });
  }

  /** Return true if the currently selected group is part of the "large user groups" list. */
  public isLargeUserGroup(): boolean {
    if (!this.userGroup) {
      return false;
    }
    if (this.service.largeUserGroups.some(x => x.isEqualTo(this.userGroup.id))) {
      return true;
    }
    return false;
  }

  private getPlayersInUserGroup(): void {
    // If the user group is too large, avoid loading the users
    if (this.isLargeUserGroup()) {
      return;
    }
    this.getMonitor = this.getMonitor.repeat();

    const startIndex =
      this.playersDataSource.paginator.pageIndex * this.playersDataSource.paginator.pageSize;
    const endIndex = startIndex + this.playersDataSource.paginator.pageSize;

    // Before a call to the backend is made, check if we need to
    const isPlayerDataAlreadyLoaded = chain(this.allPlayers)
      .slice(startIndex, endIndex) // get the slice of players that are going to be loaded from the API
      .every() // checks if every value in the array is truthy. Unloaded are "undefined" which is not truthy
      .value();
    if (this.allPlayers.length > 0 && isPlayerDataAlreadyLoaded) {
      return;
    }

    this.service
      .getPlayersInUserGroup$(this.userGroup, startIndex, this.playersDataSource.paginator.pageSize)
      .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(response => {
        const players = response.playerList.map(player => {
          return {
            gamertag: player.gamertag,
            xuid: player.xuid,
            deleteMonitor: new ActionMonitor(`Delete player from user group:  ${player.xuid}`),
          };
        });

        // Pagination logic with dynamic loading.
        // If the players array is not the right size, insert an undefined value at the end to trick the ui table
        if (this.allPlayers.length != response.playerCount) {
          this.allPlayers[response.playerCount - 1] = undefined;
        }

        // Insert players into allPlayers array
        this.allPlayers.splice(startIndex, this.playersDataSource.paginator.pageSize, ...players);

        this.playersDataSource.data = this.allPlayers;
      });
  }

  private getBasicPlayerList(userIdentifications: string, useGamertags: boolean): BasicPlayerList {
    if (useGamertags) {
      const inputSplit = userIdentifications.split(/[,\n\r]/); // split on anything we consider a separator
      const gamertags = chain(inputSplit) // start a lodash chain
        .map(v => v.trim()) // get rid of surrounding white space
        .compact() // drop falsy values (empty strings) to save on parse time
        .uniq() // drop dupes now so we dodge string manipulation later
        .value();
      return {
        xuids: null,
        gamertags: gamertags,
      };
    } else {
      const xuids = tryParseBigNumbers(userIdentifications);
      return {
        xuids: xuids,
        gamertags: null,
      };
    }
  }

  private clearCheckboxes(): void {
    for (const checkbox of this.checkboxes) {
      checkbox.checked = false;
    }
  }
}
