import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { MsTeamsService } from './ms-teams.service';

/** Defines the mock for the MsTeams Service. */
export class MockMsTeamsService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public sendBugReportMessage$ = jasmine
    .createSpy('sendBugReportMessage$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));

  public sendFeatureRequestMessage$ = jasmine
    .createSpy('sendFeatureRequestMessage$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Users Service. */
export function createMockMsTeamsService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: MsTeamsService,
    useValue: new MockMsTeamsService(returnValueGenerator),
  };
}
