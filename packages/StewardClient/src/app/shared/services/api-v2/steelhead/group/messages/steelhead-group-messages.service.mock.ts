import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadGroupMessagesService } from './steelhead-group-messages.service';

/** Defines the mock for the API Service. */
export class MockSteelheadGroupMessagesService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getGroupNotifications$ = jasmine
    .createSpy('getGroupNotifications$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public postSendCommunityMessageToLspGroup$ = jasmine
    .createSpy('postSendCommunityMessageToLspGroup$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public postEditLspGroupCommunityMessage$ = jasmine
    .createSpy('postEditLspGroupCommunityMessage$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public deleteLspGroupCommunityMessage$ = jasmine
    .createSpy('deleteLspGroupCommunityMessage$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead group messages Service. */
export function createMockSteelheadGroupMessagesService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadGroupMessagesService,
    useValue: new MockSteelheadGroupMessagesService(returnValueGenerator),
  };
}
