import { Provider } from '@angular/core';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { ReplaySubject } from 'rxjs';
import { WoodstockCarsCacheService } from './cars-cache.service';

/** Mock Woodstock CarsCache Service. */
export class MockWoodstockCarsCacheService {
  public monitor: ActionMonitor = new ActionMonitor('fake');
  public lookupHasChanged$: ReplaySubject<void> = new ReplaySubject<void>();
  public getDetails = jasmine.createSpy('getDetails');
  public getDetails$ = jasmine.createSpy('getDetails$');
  public updateLookup = jasmine.createSpy('updateLookup');
}

/** Creates an injectable mock for Woodstock CarsCache Service. */
export function createMockWoodstockCarsCacheService(): Provider {
  return {
    provide: WoodstockCarsCacheService,
    useValue: new MockWoodstockCarsCacheService(),
  };
}