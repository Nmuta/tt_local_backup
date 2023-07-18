import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadPlayerMessagesService } from './steelhead-player-messages.service';

/** Defines the mock for the API Service. */
export class MockSteelheadPlayerMessagesService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getPlayerNotifications$ = jasmine
    .createSpy('getPlayerNotifications$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public postEditPlayerCommunityMessage$ = jasmine
    .createSpy('postEditPlayerCommunityMessage$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public deletePlayerCommunityMessage$ = jasmine
    .createSpy('deletePlayerCommunityMessage$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead player messages Service. */
export function createMockSteelheadPlayerMessagesService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadPlayerMessagesService,
    useValue: new MockSteelheadPlayerMessagesService(returnValueGenerator),
  };
}
