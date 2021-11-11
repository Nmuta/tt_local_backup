import { Injectable, Provider } from '@angular/core';
import { ToolsAvailability } from '@models/blob-storage';
import { Observable, of } from 'rxjs';
import { BlobStorageService } from '.';

/** Defines the mock for the Blob Storage Service. */
@Injectable()
export class MockBlobStorageService {
  /** Override with a Subject to have all methods wait until the next emission to emit. */
  public waitUntil$: Observable<unknown> = of(true);

  public getToolAvailability$ = jasmine
    .createSpy('getToolAvailability')
    .and.returnValue(of({ allTools: true } as ToolsAvailability));
}

/** Creates an injectable mock for Blob Storage Service. */
export function createMockBlobStorageService(): Provider {
  return {
    provide: BlobStorageService,
    useValue: new MockBlobStorageService(),
  };
}
