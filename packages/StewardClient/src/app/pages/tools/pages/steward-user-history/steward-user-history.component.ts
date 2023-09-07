import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { BaseComponent } from '@components/base-component/base.component';
import { BackgroundJob, BackgroundJobStatus } from '@models/background-job';
import { JsonTableResult } from '@models/json-table-result';
import { UserModel } from '@models/user.model';
import { Store } from '@ngxs/store';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { UserState } from '@shared/state/user/user.state';
import { sortBy } from 'lodash';
import { Duration } from 'luxon';
import { EMPTY, Subject } from 'rxjs';
import { takeUntil, switchMap, catchError, tap, map } from 'rxjs/operators';

export type JsonTableAndBackgroundJob = BackgroundJob<unknown> & {
  jsonTableResults: JsonTableResult<unknown>[];
};

/** The community messaging component. */
@Component({
  templateUrl: './steward-user-history.component.html',
  styleUrls: ['./steward-user-history.component.scss'],
})
export class StewardUserHistoryComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public fromDurations = [
    { text: 'Last Week', value: Duration.fromObject({ days: 7 }) },
    { text: 'Last Month', value: Duration.fromObject({ month: 1 }) },
    { text: 'Last Year', value: Duration.fromObject({ year: 1 }) },
  ];

  public formControls = {
    fromDuration: new UntypedFormControl(this.fromDurations[0].value, Validators.required),
  };

  public formGroup = new UntypedFormGroup({
    fromDuration: this.formControls.fromDuration,
  });

  public profile: UserModel;
  public jobs = new MatTableDataSource<BackgroundJob<unknown>>();
  public getBackgroundJobs$ = new Subject<void>();
  public selectedBackgroundJob: JsonTableAndBackgroundJob = null;

  public displayedColumns: string[] = ['createdDateUtc', 'status', 'description', 'jobId'];

  /** True while waiting on a request. */
  public isLoading = false;
  /** The error received while loading. */
  public loadError: unknown;

  public BackgroundJobStatus = BackgroundJobStatus;

  constructor(private readonly jobsService: BackgroundJobService, private readonly store: Store) {
    super();

    this.getBackgroundJobs$
      .pipe(
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(() => {
          const duration = this.formControls.fromDuration.value;
          return this.jobsService.getBackgroundJobs$(this.profile.objectId, duration).pipe(
            catchError(error => {
              this.isLoading = false;
              this.loadError = error;
              return EMPTY;
            }),
          );
        }),
        map(jobs => sortBy(jobs, job => job.createdDateUtc).reverse()),
        takeUntil(this.onDestroy$),
      )
      .subscribe(jobs => {
        this.isLoading = false;
        this.jobs.data = jobs;
        this.paginator.firstPage();
      });
  }

  /** Lifecycle hook */
  public ngOnInit(): void {
    this.profile = this.store.selectSnapshot(UserState.profile);
    this.getBackgroundJobs$.next();
  }

  /** Lifecycle hook */
  public ngAfterViewInit(): void {
    this.jobs.paginator = this.paginator;
  }

  /** Sets the selected background job */
  public setSelectedBackgroundJob(job: BackgroundJob<unknown>): void {
    this.selectedBackgroundJob = job as JsonTableAndBackgroundJob;

    // Json Table Results always takes in an array
    if (!Array.isArray(this.selectedBackgroundJob.result)) {
      const jsonTableResult = this.selectedBackgroundJob.result as JsonTableResult<unknown>;
      this.selectedBackgroundJob.jsonTableResults = [jsonTableResult];
    } else {
      this.selectedBackgroundJob.jsonTableResults = this.selectedBackgroundJob.result
        .flat(50)
        .map(job => {
          return job as JsonTableResult<unknown>;
        });
    }
  }

  /** Clears the selected background job */
  public clearSelectedBackgroundJob(): void {
    this.selectedBackgroundJob = null;
  }

  /** New from duration is selected. */
  public newFromDuration(_$event: MatSelectChange): void {
    this.getBackgroundJobs$.next();
  }
}
