import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { BaseComponent } from '@components/base-component/base.component';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { tryParseBigNumbers } from '@helpers/bignumbers';
import { BackgroundJob } from '@models/background-job';
import { LspGroup } from '@models/lsp-group';
import { UserGroupManagementResponse } from '@models/user-group-management-response';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import BigNumber from 'bignumber.js';
import { remove } from 'lodash';
import { Observable, takeUntil, switchMap } from 'rxjs';

export interface ListUsersInGroupServiceContract {
  getPlayersInUserGroup$(userGroup: LspGroup): Observable<PlayerInUserGroup[]>;
  deletePlayerFromUserGroup$(
    xuid: BigNumber,
    userGroup: LspGroup,
  ): Observable<UserGroupManagementResponse[]>;
  deletePlayersFromUserGroupUsingBackgroundTask$(
    xuids: BigNumber[],
    userGroup: LspGroup,
  ): Observable<BackgroundJob<void>>;
  addPlayersToUserGroupUsingBackgroundTask$(
    xuids: BigNumber[],
    userGroup: LspGroup,
  ): Observable<BackgroundJob<void>>;
  deleteAllPlayersFromUserGroup$(userGroup: LspGroup): Observable<UserGroupManagementResponse[]>;
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
export class ListUsersInGroupComponent extends BaseComponent implements OnChanges, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /** Service contract for create user groups component. */
  @Input() service: ListUsersInGroupServiceContract;
  /** User group to list users and manage. */
  @Input() userGroup: LspGroup;

  /** Add/remove bulk xuids submit form */
  public formControls = {
    xuids: new FormControl('', Validators.required),
  };

  public formGroup = new FormGroup(this.formControls);

  public getMonitor = new ActionMonitor('Get players in user group.');
  public deleteAllMonitor = new ActionMonitor('Delete all players in user group.');
  public deletePlayersMonitor = new ActionMonitor('Delete specified players in user group.');
  public addPlayersMonitor = new ActionMonitor('Add specified players in user group.');
  public allPlayers: PlayerInUserGroup[];

  public displayedColumns = ['xuid', 'gamertag', 'actions'];
  public playersDataSource = new BetterMatTableDataSource<PlayerInUserGroup>();

  constructor(private readonly backgroundJobService: BackgroundJobService) {
    super();
  }

  /** Lifecycle hook */
  public ngOnChanges(changes: SimpleChanges): void {
    if (!this.service) {
      throw new Error('No service contract was provided for ListUsersInGroupComponent');
    }

    if (changes.userGroup && !!this.userGroup) {
      this.getPlayersInUserGroup();
      this.playersDataSource.paginator = this.paginator;
    }
  }

  /** Lifecycle hook */
  public ngAfterViewInit(): void {
    this.playersDataSource.paginator = this.paginator;
  }

  /** Deletes specified users from a user group. */
  public deleteUsersInGroup(): void {
    this.deletePlayersMonitor = this.deletePlayersMonitor.repeat();

    const xuids = tryParseBigNumbers(this.formControls.xuids.value);

    this.service
      .deletePlayersFromUserGroupUsingBackgroundTask$(xuids, this.userGroup)
      .pipe(
        switchMap(response => {
          return this.backgroundJobService.waitForBackgroundJobToComplete<UserGroupManagementResponse>(
            response as BackgroundJob<void>,
          );
        }),
        this.deletePlayersMonitor.monitorSingleFire(),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        this.formGroup.reset();
      });
  }

  /** Adds specified users to a user group. */
  public addUsersInGroup(): void {
    this.addPlayersMonitor = this.addPlayersMonitor.repeat();

    const xuids = tryParseBigNumbers(this.formControls.xuids.value);

    this.service
      .addPlayersToUserGroupUsingBackgroundTask$(xuids, this.userGroup)
      .pipe(
        switchMap(response => {
          return this.backgroundJobService.waitForBackgroundJobToComplete<UserGroupManagementResponse>(
            response as BackgroundJob<void>,
          );
        }),
        this.addPlayersMonitor.monitorSingleFire(),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        this.formGroup.reset();
      });
  }

  /** Deletes a player from a user group */
  public deletePlayerFromUserGroup(playerToDelete: PlayerInUserGroup): void {
    playerToDelete.deleteMonitor = playerToDelete.deleteMonitor.repeat();
    this.service
      .deletePlayerFromUserGroup$(playerToDelete.xuid, this.userGroup)
      .pipe(playerToDelete.deleteMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(result => {
        if (result[0].error === null) {
          remove(this.allPlayers, player => {
            return player.xuid.isEqualTo(playerToDelete.xuid);
          });
          this.playersDataSource.data = this.allPlayers;
        } else {
          throw new Error(result[0].error.message);
        }
      });
  }

  /** Deletes all users from a user group. */
  public deleteAllUsersInGroup(): void {
    this.deleteAllMonitor = this.deleteAllMonitor.repeat();
    this.service
      .deleteAllPlayersFromUserGroup$(this.userGroup)
      .pipe(this.deleteAllMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        // TODO: Handle success group deletion in UI.
      });
  }

  private getPlayersInUserGroup(): void {
    this.getMonitor = this.getMonitor.repeat();
    this.service
      .getPlayersInUserGroup$(this.userGroup)
      .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(players => {
        this.allPlayers = players.map(player => {
          player.deleteMonitor = new ActionMonitor(
            `Delete player from user group:  ${player.xuid}`,
          );
          return player;
        });
        this.playersDataSource.data = this.allPlayers;
      });
  }
}
