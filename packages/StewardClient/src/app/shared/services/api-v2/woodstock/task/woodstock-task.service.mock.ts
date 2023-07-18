import { ValueProvider } from '@angular/core';
import { of } from 'rxjs';
import { WoodstockTaskService } from './woodstock-task.service';

/** Defines the mock for the API Service. */
export class MockWoodstockTaskService {
  public getTasks$ = jasmine.createSpy('getTasks').and.returnValue(of());

  public updateTask$ = jasmine.createSpy('updateTask').and.returnValue(of());

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Task Service. */
export function createMockWoodstockTaskService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: WoodstockTaskService,
    useValue: new MockWoodstockTaskService(returnValueGenerator),
  };
}
