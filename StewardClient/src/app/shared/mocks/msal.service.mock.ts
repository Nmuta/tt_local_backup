import { Provider } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

/** Defines the MSAL Service mock. */
export class MockMsalService {
  public logout = jasmine.createSpy('logout');
  public flush = jasmine.createSpy('flush');
  public loginPopup = jasmine.createSpy('loginPopup').and.returnValue(Promise.resolve({}));
  public trackPageView = jasmine.createSpy('trackPageView');
  public trackTrace = jasmine.createSpy('trackTrace');
  public trackException = jasmine.createSpy('trackException');
  public trackEvent = jasmine.createSpy('trackEvent');
}

/** Creates an injectable mock for MSAL Service. */
export function createMockMsalService(): Provider {
  return { provide: MsalService, useValue: new MockMsalService() };
}
