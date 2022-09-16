import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadPlayersMessagesService } from './steelhead-players-messages.service';

/** Defines the mock for the API Service. */
export class MockSteelheadPlayersMessagesService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public postSendCommunityMessageToXuids$ = jasmine
    .createSpy('postSendCommunityMessageToXuids$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for steelhead players messages service. */
export function createMockSteelheadPlayersMessagesService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadPlayersMessagesService,
    useValue: new MockSteelheadPlayersMessagesService(returnValueGenerator),
  };
}
