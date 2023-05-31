import { ValueProvider } from '@angular/core';
import faker from '@faker-js/faker';
import { Observable, of, switchMap } from 'rxjs';
import { SteelheadUgcGenerateSharecodeService } from './steelhead-ugc-generate-sharecode.service';

/** Defines the mock for the API Service. */
export class MockSteelheadUgcGenerateSharecodeService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public reportUgc$ = jasmine
    .createSpy('ugcGenerateSharecode$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(faker.random.number()))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Ugc Report Service. */
export function createMockSteelheadUgcGenerateSharecodeService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadUgcGenerateSharecodeService,
    useValue: new MockSteelheadUgcGenerateSharecodeService(returnValueGenerator),
  };
}
