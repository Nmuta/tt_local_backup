import { Injectable, Provider } from '@angular/core';
import { BackgroundJobService } from './background-job.service';

/** Defines the mock for the Background Job Service. */
@Injectable()
export class MockBackgroundJobService {
  public getBackgroundJob = jasmine.createSpy('getBackgroundJob');
}

/** Creates an injectable mock for Background Job Service. */
export function createMockUserService(): Provider {
  return { provide: BackgroundJobService, useValue: new MockBackgroundJobService() };
}
