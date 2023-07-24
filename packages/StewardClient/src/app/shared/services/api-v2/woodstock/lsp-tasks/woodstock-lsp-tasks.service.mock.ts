import { ValueProvider } from '@angular/core';
import { of } from 'rxjs';
import { WoodstockLspTaskService } from './woodstock-lsp-tasks.service';

/** Defines the mock for the API Service. */
export class MockWoodstockTaskService {
  public getLspTasks$ = jasmine.createSpy('getLspTasks').and.returnValue(of());

  public updateLspTask$ = jasmine.createSpy('updateLspTask').and.returnValue(of());

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Woodstock Task Service. */
export function createMockWoodstockTaskService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: WoodstockLspTaskService,
    useValue: new MockWoodstockTaskService(returnValueGenerator),
  };
}
