import { ValueProvider } from '@angular/core';
import { of } from 'rxjs';
import {
  BuildersCupFeaturedTour,
  SteelheadBuildersCupService,
} from './steelhead-builders-cup.service';

/** Defines the mock for the API Service. */
export class MockSteelheadBuildersCupService {
  private result: BuildersCupFeaturedTour[] = [
    {
      name: 'Name',
      description: 'Description',
      isDisabled: false,
      openTimeUtc: null,
      closeTimeUtc: null,
      championshipSeries: [],
    },
  ];

  public getBuildersCupSchedule$ = jasmine
    .createSpy('getBuildersCupSchedule')
    .and.returnValue(of(this.result));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Builders Cup Service. */
export function createMockSteelheadBuildersCupService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadBuildersCupService,
    useValue: new MockSteelheadBuildersCupService(returnValueGenerator),
  };
}
