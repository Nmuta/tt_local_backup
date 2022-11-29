import { ValueProvider } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { WoodstockCarsService } from './woodstock-cars.service';

/** Defines the mock for the API Service. */
export class MockWoodstockCarsService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getCars$ = jasmine
    .createSpy('getCars$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of([]))));

  public getCar$ = jasmine
    .createSpy('getCar$')
    .and.callFake(() => this.waitUntil$.pipe(switchMap(() => of(null))));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Service. */
export function createMockWoodstockCarsService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: WoodstockCarsService,
    useValue: new MockWoodstockCarsService(returnValueGenerator),
  };
}
