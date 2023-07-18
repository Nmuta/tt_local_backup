import { ValueProvider } from '@angular/core';
import { of } from 'rxjs';
import { SteelheadTaskService } from './steelhead-task.service';

/** Defines the mock for the API Service. */
export class MockSteelheadTaskService {
  public getTasks$ = jasmine.createSpy('getTasks').and.returnValue(of());

  public updateTask$ = jasmine.createSpy('updateTask').and.returnValue(of());

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Task Service. */
export function createMockSteelheadTaskService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadTaskService,
    useValue: new MockSteelheadTaskService(returnValueGenerator),
  };
}
