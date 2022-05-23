import { Injectable, Provider } from '@angular/core';
import { ToolsAvailability } from '@models/blob-storage';
import { Observable, of, ReplaySubject } from 'rxjs';
import { ChangelogService } from './changelog.service';

/** Defines the mock for the Blob Storage Service. */
@Injectable()
export class MockChangelogService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public readonly changed$: Observable<void> = new ReplaySubject<void>(1);

  /** Mocking property */
  public get disableAutomaticPopup(): boolean {
    return true;
  }

  /** Mocking property */
  public set disableAutomaticPopup(value: boolean) {
    return;
  }

  /** Mocking property */
  public get allArePending(): boolean {
    return true;
  }

  /** Mocking property */
  public get allAreAcknowledged(): boolean {
    return true;
  }

  public getToolAvailability$ = jasmine
    .createSpy('getToolAvailability')
    .and.returnValue(of({ allTools: true } as ToolsAvailability));

  public isPending = jasmine.createSpy('isPending').and.returnValue(true);

  public isAcknowledged = jasmine.createSpy('isAcknowledged').and.returnValue(true);

  public isIndeterminate = jasmine.createSpy('isIndeterminate').and.returnValue(true);

  public acknowledgeAll = jasmine.createSpy('acknowledgeAll');

  public markAllPending = jasmine.createSpy('markAllPending');

  public acknowledge = jasmine.createSpy('acknowledge');

  public getChangelogEntriesForTag = jasmine
    .createSpy('getChangelogEntriesForTag')
    .and.returnValue([]);
}

/** Creates an injectable mock for Blob Storage Service. */
export function createMockChangelogService(): Provider {
  return {
    provide: ChangelogService,
    useValue: new MockChangelogService(),
  };
}
