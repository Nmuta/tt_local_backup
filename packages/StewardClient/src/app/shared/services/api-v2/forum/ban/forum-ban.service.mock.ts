import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { ForumBanService } from './forum-ban.service';

/** Defines the mock for the API Service. */
export class MockForumBanService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public postBanPlayers$ = jasmine
    .createSpy('postBanPlayers$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of())));

  public getBanSummariesByXuids$ = jasmine
    .createSpy('getBanSummariesByXuids$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Forum Ban Service. */
export function createMockForumBanService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: ForumBanService,
    useValue: new MockForumBanService(returnValueGenerator),
  };
}
