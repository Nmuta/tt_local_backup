import { Injectable, Provider } from '@angular/core';
import { MockZafClient } from '@shared/definitions/zaf-client.mock';
import { Observable, of } from 'rxjs';
import { ZafClientService } from './zaf-client.service';

/** Defines the mock for the Zendesk Service. */
@Injectable()
export class MockZafClientService extends ZafClientService {
  public client = new MockZafClient();

  /** Returns this.client */
  public get client$(): Observable<ZAFClient.ZafClientActual> { return of(this.client); }

  constructor() { super(null); }

  /** Nuking the init function so we don't get the actual object; otherwise we are using this class as-is */
  protected async init(): Promise<void> { /* empty */ }
}

/** Creates an injectable mock for Zendesk Service. */
export function createMockZafClientService(): Provider {
  return { provide: ZafClientService, useValue: new MockZafClientService() };
}
