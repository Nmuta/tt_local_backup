import { Injectable, Provider } from '@angular/core';
import { JobsGetJobFakeApi } from '@interceptors/fake-api/apis/title/jobs/jobId';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BackgroundJobService } from './background-job.service';

/** Defines the mock for the Background Job Service. */
@Injectable()
export class MockBackgroundJobService {
  public waitUntil$ = of();

  public getBackgroundJob = jasmine
    .createSpy('getBackgroundJob')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(JobsGetJobFakeApi.make()))));
}

/** Creates an injectable mock for Background Job Service. */
export function createMockUserService(): Provider {
  return { provide: BackgroundJobService, useValue: new MockBackgroundJobService() };
}
