import { Provider } from '@angular/core';
import { MsalBroadcastService, MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { AccountInfo, EventMessage, IPublicClientApplication } from '@azure/msal-browser';
import { EMPTY, NEVER, Observable } from 'rxjs';

/** Defines the MSAL Service mock. */
export class MockMsalService {
  public logout = jasmine.createSpy('logout');
  public flush = jasmine.createSpy('flush');
  public loginPopup = jasmine.createSpy('loginPopup').and.returnValue(EMPTY);
  public trackPageView = jasmine.createSpy('trackPageView');
  public trackTrace = jasmine.createSpy('trackTrace');
  public trackException = jasmine.createSpy('trackException');
  public trackEvent = jasmine.createSpy('trackEvent');
}

/** Defines a mock of the upstream MSAL service. */
export class MockMsalServiceUpstream implements Partial<IPublicClientApplication> {
  public accounts: Partial<AccountInfo>[] = [{}];
  public activeAccount: Partial<AccountInfo> = null;
  public getActiveAccount = jasmine
    .createSpy('getActiveAccount')
    .and.callFake(() => this.activeAccount);
  public setActiveAccount = jasmine.createSpy('setActiveAccount').and.callFake(v => {
    this.activeAccount = v;
  });
  public getAllAccounts = jasmine.createSpy('getAllAccounts').and.callFake(() => this.accounts);
}

/** Defines a mock of the upstream MSAL Broadcast service. */
export class MockMsalBroadcastService implements Partial<MsalBroadcastService> {
  public msalSubject$: Observable<EventMessage> = NEVER;
}

/** Creates an injectable mock for MSAL Service. */
export function createMockMsalServices(): Provider[] {
  return [
    { provide: MSAL_INSTANCE, useValue: new MockMsalServiceUpstream() },
    { provide: MsalService, useValue: new MockMsalService() },
    { provide: MsalBroadcastService, useValue: new MockMsalBroadcastService() },
  ];
}
