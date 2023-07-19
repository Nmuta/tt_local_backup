import { Provider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadMessageOfTheDayService } from './steelhead-message-of-the-day.service';

/** Defines the mock for the API Service. */
export class MockSteelheadMessageOfTheDayService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getMessagesOfTheDay$ = jasmine
    .createSpy('getMessagesOfTheDay$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));

  public getMessageOfTheDayDetail$ = jasmine
    .createSpy('getMessageOfTheDayDetail$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));

  public submitModification$ = jasmine
    .createSpy('submitModification$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));
}

/** Creates an injectable mock for Woodstock Service. */
export function createMockSteelheadMessageOfTheDayService(): Provider {
  return {
    provide: SteelheadMessageOfTheDayService,
    useValue: new MockSteelheadMessageOfTheDayService(),
  };
}
