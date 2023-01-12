import { Provider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadGitOperationService } from './steelhead-git-operation.service';

/** Defines the mock for the API Service. */
export class MockSteelheadGitOperationService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getActivePullRequests$ = jasmine
    .createSpy('getActivePullRequests$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));
}

/** Creates an injectable mock for Woodstock Service. */
export function createMockSteelheadGitOperationService(): Provider {
  return {
    provide: SteelheadGitOperationService,
    useValue: new MockSteelheadGitOperationService(),
  };
}
