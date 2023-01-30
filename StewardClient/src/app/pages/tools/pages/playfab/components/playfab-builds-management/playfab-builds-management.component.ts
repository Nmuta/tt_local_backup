import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { BaseComponent } from '@components/base-component/base.component';
import { HCI } from '@environments/environment';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { pairwiseSkip } from '@helpers/rxjs';
import { GameTitle } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import { PlayFabBuildLock, PlayFabBuildLockRequest, PlayFabBuildSummary } from '@models/playfab';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { cloneDeep, find } from 'lodash';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import {
  BuildLockChangeDialogComponent,
  BuildLockChangeDialogData,
} from '../build-lock-change-dialog/build-lock-change-dialog.component';

/** Service contract for the PlayFabBuildsManagementComponent. */
export interface PlayFabBuildsManagementServiceContract {
  gameTitle: GameTitle;
  getPlayFabBuilds$(): Observable<PlayFabBuildSummary[]>;
  getPlayFabBuildLocks$(): Observable<PlayFabBuildLock[]>;
  addPlayFabBuildLock$(buildLockRequest: PlayFabBuildLockRequest): Observable<PlayFabBuildLock>;
  deletePlayFabBuildLock$(buildLockId: GuidLikeString): Observable<PlayFabBuildLock>;
}

interface BuildFilters {
  nameOrId: string;
  lockStatus: LockFilterType;
}

type PlayFabBuildSummaryTableEntry = PlayFabBuildSummary & {
  /** Build lock if it exists. Correlated through separate API request. */
  lock: PlayFabBuildLock;
};

enum LockFilterType {
  All,
  Locked,
  Unlocked,
}

/** Displays the playfab-builds management tool. */
@Component({
  selector: 'playfab-builds-management',
  templateUrl: './playfab-builds-management.component.html',
  styleUrls: ['./playfab-builds-management.component.scss'],
})
export class PlayFabBuildsManagementComponent
  extends BaseComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /** Component service contract. */
  @Input() public service: PlayFabBuildsManagementServiceContract;

  public getPlayFabBuildsAndLocksMonitor = new ActionMonitor('GET PlayFab builds and build locks');

  public buildsTableColumns = ['isLocked', 'buildDetails', 'lockDetails', 'actions'];
  public buildsTable = new BetterMatTableDataSource<PlayFabBuildSummaryTableEntry>([]);
  public allBuildTableEntries: PlayFabBuildSummaryTableEntry[] = [];

  public playFabBuildsPermAttribute = PermAttributeName.ManagePlayFabBuildLocks;

  public filterFormControls = {
    nameOrId: new FormControl(null),
    lockStatus: new FormControl(LockFilterType.All),
  };

  public filterFormGroup = new FormGroup(this.filterFormControls);

  public LockFilterType = LockFilterType;

  constructor(private readonly dialog: MatDialog) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.filterFormGroup.valueChanges
      .pipe(
        debounceTime(HCI.TypingToAutoSearchDebounceMillis),
        pairwiseSkip((prev, cur) => {
          return prev?.nameOrId === cur?.nameOrId && prev?.lockStatus === cur?.lockStatus;
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe((formFilters: BuildFilters) => {
        this.filterBuilds(formFilters);
      });
  }

  /** Lifecycle hook. */
  public ngOnChanges(_changes: SimpleChanges): void {
    if (!this.service) {
      throw new Error('No service contract was provided for PlayFabBuildsManagementComponent');
    }

    const getBuilds$ = this.service.getPlayFabBuilds$();

    const getBuildLocks$ = this.service.getPlayFabBuildLocks$();

    this.getPlayFabBuildsAndLocksMonitor = this.getPlayFabBuildsAndLocksMonitor.repeat();
    combineLatest([getBuilds$, getBuildLocks$])
      .pipe(this.getPlayFabBuildsAndLocksMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(([builds, buildLocks]) => {
        const tableBulds = builds.map(build => {
          const mappedBuld = build as PlayFabBuildSummaryTableEntry;
          const buildLock = find(buildLocks, lock => lock.id === build.id && !!lock.isLocked);
          mappedBuld.lock = buildLock;

          return mappedBuld;
        });

        this.allBuildTableEntries = tableBulds;
        this.buildsTable.data = this.allBuildTableEntries;
      });
  }

  /** Lifecycle  hook. */
  public ngAfterViewInit(): void {
    this.buildsTable.paginator = this.paginator;
  }

  /** Opens the build lock change dialog.. */
  public openBuildLockChangeDialog(item: PlayFabBuildSummaryTableEntry, lockBuild: boolean): void {
    const dialogRef = this.dialog.open(BuildLockChangeDialogComponent, {
      data: {
        gameTitle: this.service.gameTitle,
        build: item as PlayFabBuildSummary,
        lockBuild: lockBuild,
        lockAction$: (buildId: GuidLikeString, lockReason: string) =>
          this.lockPlayFabBuild$(buildId, lockReason),
        unlockAction$: (buildId: GuidLikeString) => this.deletePlayFabBuildLock$(buildId),
      } as BuildLockChangeDialogData,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((lock: PlayFabBuildLock) => {
        // Undefined means nothing happened in dialog
        if (lock !== undefined) {
          item.lock = lock;
        }
      });
  }

  /** Locks the PlayFab build. */
  private lockPlayFabBuild$(
    buildId: GuidLikeString,
    lockReason: string,
  ): Observable<PlayFabBuildLock> {
    const requestData = {
      id: buildId,
      reason: lockReason,
      isLocked: true,
    } as PlayFabBuildLockRequest;

    return this.service.addPlayFabBuildLock$(requestData);
  }

  /** Deletes the PlayFab build lock. */
  private deletePlayFabBuildLock$(buildId: GuidLikeString): Observable<PlayFabBuildLock> {
    return this.service.deletePlayFabBuildLock$(buildId);
  }

  private filterBuilds(filters: BuildFilters): void {
    let filteredBuilds = cloneDeep(this.allBuildTableEntries);

    const nameOrIdFilter = filters?.nameOrId?.trim()?.toLowerCase();
    if (!!nameOrIdFilter && nameOrIdFilter !== '') {
      filteredBuilds = filteredBuilds.filter(
        build =>
          build.id.toLowerCase().includes(nameOrIdFilter) ||
          build.name.toLowerCase().includes(nameOrIdFilter),
      );
    }

    if (filters.lockStatus !== LockFilterType.All) {
      const filterToLocked = filters.lockStatus === LockFilterType.Locked;
      filteredBuilds = filteredBuilds.filter(build => !!build.lock === filterToLocked);
    }

    this.buildsTable.data = filteredBuilds;
  }
}
