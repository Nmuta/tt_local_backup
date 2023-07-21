import { ValueProvider } from '@angular/core';
import { of } from 'rxjs';
import { SteelheadLspTaskService } from './steelhead-lsp-tasks.service';

/** Defines the mock for the API Service. */
export class MockSteelheadTaskService {
  public getLspTasks$ = jasmine.createSpy('getLspTasks').and.returnValue(of());

  public updateLspTask$ = jasmine.createSpy('updateLspTask').and.returnValue(of());

  constructor(private readonly generator$: () => unknown) {}
}

/** Creates an injectable mock for Steelhead Task Service. */
export function createMockSteelheadTaskService(
  returnValueGenerator: () => unknown = () => new Object(),
): ValueProvider {
  return {
    provide: SteelheadLspTaskService,
    useValue: new MockSteelheadTaskService(returnValueGenerator),
  };
}
