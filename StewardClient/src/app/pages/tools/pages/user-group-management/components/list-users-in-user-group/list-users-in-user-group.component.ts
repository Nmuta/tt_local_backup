import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { BaseComponent } from '@components/base-component/base.component';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { LspGroup } from '@models/lsp-group';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import BigNumber from 'bignumber.js';
import { remove } from 'lodash';
import { delay, Observable, takeUntil } from 'rxjs';

export interface ListUsersInGroupServiceContract {
  getPlayersInUserGroup$(userGroup: LspGroup): Observable<PlayerInUserGroup[]>;
  deletePlayerFromUserGroup$(xuid: BigNumber, userGroup: LspGroup): Observable<boolean>;
  deleteAllPlayersFromUserGroup$(userGroup: LspGroup): Observable<boolean>;
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

  public getmonitor = new ActionMonitor('Get players in user group.');
  public deleteAllMonitor = new ActionMonitor('Delete all players in user group.');
  public allPlayers: PlayerInUserGroup[];

  public displayedColumns = ['xuid', 'gamertag', 'actions'];
  public playersDataSource = new BetterMatTableDataSource<PlayerInUserGroup>();

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

  /** Deletes a player from a user group */
  public deletePlayerFromUserGroup(playerToDelete: PlayerInUserGroup): void {
    playerToDelete.deleteMonitor = playerToDelete.deleteMonitor.repeat();
    this.service
      .deletePlayerFromUserGroup$(playerToDelete.xuid, this.userGroup)
      .pipe(
        delay(3_000),
        playerToDelete.deleteMonitor.monitorSingleFire(),
        takeUntil(this.onDestroy$),
      )
      .subscribe(result => {
        if (result) {
          remove(this.allPlayers, player => {
            return player.xuid.isEqualTo(playerToDelete.xuid);
          });
          this.playersDataSource.data = this.allPlayers;
        }
      });
  }

  /** Deletes all users from a user group. */
  public deleteAllUsersInGroup(): void {
    this.deleteAllMonitor = this.deleteAllMonitor.repeat();
    this.service
      .deleteAllPlayersFromUserGroup$(this.userGroup)
      .pipe(delay(3_000), this.deleteAllMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        // TODO: Handle success group deletion in UI.
      });
  }

  private getPlayersInUserGroup(): void {
    this.getmonitor = this.getmonitor.repeat();
    this.service
      .getPlayersInUserGroup$(this.userGroup)
      .pipe(delay(3_000), this.getmonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
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
