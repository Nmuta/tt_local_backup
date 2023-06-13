import { ValueProvider } from '@angular/core';
import faker from '@faker-js/faker';
import { Observable, of, switchMap } from 'rxjs';
import { WoodstockUgcSharecodeService } from './woodstock-ugc-sharecode.service';

/** Defines the mock for the API Service. */
export class MockWoodstockUgcSharecodeService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public reportUgc$ = jasmine
    .createSpy('ugcGenerateSharecode$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(faker.random.number()))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Ugc Report Service. */
export function createMockWoodstockUgcSharecodeService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: WoodstockUgcSharecodeService,
    useValue: new MockWoodstockUgcSharecodeService(returnValueGenerator),
  };
}
