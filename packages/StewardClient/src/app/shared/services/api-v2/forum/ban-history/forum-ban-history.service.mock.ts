import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { ForumBanHistoryService } from './forum-ban-history.service';

/** Defines the mock for the API Service. */
export class MockForumBanHistoryService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getBanHistoryByXuid$ = jasmine
    .createSpy('getBanHistoryByXuid$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Forum Ban History Service. */
export function createMockForumBanHistoryService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: ForumBanHistoryService,
    useValue: new MockForumBanHistoryService(returnValueGenerator),
  };
}
