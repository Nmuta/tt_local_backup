import { Provider } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

/** Defines the MSAL Service mock. */
export class MockMsalService {
  public flush = jasmine.createSpy('flush');
  public trackPageView = jasmine.createSpy('trackPageView');
  public trackTrace = jasmine.createSpy('trackTrace');
  public trackException = jasmine.createSpy('trackException');
  public trackEvent = jasmine.createSpy('trackEvent');
}

export function createMockMsalService(): Provider {
  return { provide: MsalService, useValue: new MockMsalService() };
}
