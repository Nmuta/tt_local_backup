import { ValueProvider } from '@angular/core';
import { of } from 'rxjs';
import { SteelheadShowroomService } from './steelhead-showroom.service';

/** Defines the mock for the API Service. */
export class MockSteelheadShowroomService {
  public getCarFeaturedShowcases$ = jasmine
    .createSpy('getCarFeaturedShowcases')
    .and.returnValue(of(null));

  public getDivisionFeaturedShowcases$ = jasmine
    .createSpy('getDivisionFeaturedShowcases')
    .and.returnValue(of(null));

  public getManufacturerFeaturedShowcases$ = jasmine
    .createSpy('getManufacturerFeaturedShowcases')
    .and.returnValue(of(null));

  public getSales$ = jasmine.createSpy('getCarSales').and.returnValue(of(null));

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Showroom Service. */
export function createMockSteelheadShowroomService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadShowroomService,
    useValue: new MockSteelheadShowroomService(returnValueGenerator),
  };
}
