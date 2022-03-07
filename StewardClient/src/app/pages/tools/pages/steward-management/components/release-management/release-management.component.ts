import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { BaseComponent } from '@components/base-component/base.component';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { BackgroundJob } from '@models/background-job';
import { ToolsAvailability } from '@models/blob-storage';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { BlobStorageService } from '@services/blob-storage';
import { SettingsService } from '@services/settings/settings';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { sortBy } from 'lodash';
import { DateTime } from 'luxon';
import { EMPTY, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, map, tap } from 'rxjs/operators';

/** Displays the release management tool. */
@Component({
  selector: 'release-management',
  templateUrl: './release-management.component.html',
  styleUrls: ['./release-management.component.scss'],
})
export class ReleaseManagementComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private readonly getToolsAvailability$ = new Subject<void>();
  private readonly getInProgressJobs$ = new Subject<void>();

  public toolsAvailability: ToolsAvailability;
  public getToolsAvailabilityMonitor = new ActionMonitor('GET tools availability');
  public setToolsAvailabilityMonitor = new ActionMonitor('POST tools availability');

  public jobsTableColumns = ['date', 'reason', 'creator', 'status'];
  public jobsTable = new BetterMatTableDataSource<BackgroundJob<unknown>>([]);
  public jobsTableLastUpdated: DateTime;
  public getInProgressJobsMonitor = new ActionMonitor('GET in progress jobs');

  constructor(
    private readonly blobStorageService: BlobStorageService,
    private readonly settingsService: SettingsService,
    private readonly backgroundJobService: BackgroundJobService,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.setupGetInProgressJobs();
    this.getInProgressJobs$.next();

    this.setupGetToolsAvailability();
    this.getToolsAvailability$.next();
  }

  /** Lifecycle hook */
  public ngAfterViewInit(): void {
    this.jobsTable.paginator = this.paginator;
  }

  /** Change event when all tools availability changes */
  public toggleAllToolsAvailability(event: MatSlideToggleChange): void {
    this.setToolsAvailabilityMonitor = new ActionMonitor(
      this.setToolsAvailabilityMonitor.dispose().label,
    );

    this.settingsService
      .setToolAvailability$({ allTools: event.checked })
      .pipe(
        this.setToolsAvailabilityMonitor.monitorSingleFire(),
        catchError(_error => {
          this.getToolsAvailability$.next();
          return EMPTY;
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(updatedToolsAvailability => {
        this.toolsAvailability = updatedToolsAvailability;
      });
  }

  /** Gets the latest job data. */
  public getLatestJobData(): void {
    this.getInProgressJobs$.next();
  }

  private setupGetInProgressJobs(): void {
    this.getInProgressJobs$
      .pipe(
        switchMap(() => {
          this.getInProgressJobsMonitor = new ActionMonitor(
            this.getInProgressJobsMonitor.dispose().label,
          );
          return this.backgroundJobService
            .getInProgressBackgroundJob$()
            .pipe(this.getInProgressJobsMonitor.monitorSingleFire());
        }),
        tap(() => (this.jobsTableLastUpdated = DateTime.local())),
        map(jobs =>
          jobs.filter(
            job => job?.createdDateUtc?.isValid && !!job.reason && !job.reason.includes('Fake Job'),
          ),
        ),
        map(jobs => sortBy(jobs, j => j.createdDateUtc).reverse()),
        takeUntil(this.onDestroy$),
      )
      .subscribe(jobs => {
        this.jobsTable.data = jobs;
      });
  }

  private setupGetToolsAvailability(): void {
    this.getToolsAvailability$
      .pipe(
        switchMap(() => {
          this.getToolsAvailabilityMonitor = new ActionMonitor(
            this.getToolsAvailabilityMonitor.dispose().label,
          );
          return this.blobStorageService
            .getToolAvailability$()
            .pipe(this.getToolsAvailabilityMonitor.monitorSingleFire());
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(toolsAvailability => {
        this.toolsAvailability = toolsAvailability;
      });
  }
}
