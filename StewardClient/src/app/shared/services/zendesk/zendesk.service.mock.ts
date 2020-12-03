import { Injectable, Provider } from '@angular/core';
import { of } from 'rxjs';

import { ZendeskService } from './zendesk.service';

/** Defines the mock for the Zendesk Service. */
@Injectable()
export class MockZendeskService {
  public getTicketDetails$ = jasmine.createSpy('getTicketDetails$').and.returnValue(of({}));
  public getTicketRequestor$ = jasmine.createSpy('getTicketRequestor$').and.returnValue(of({}));
  public getTicketFields$ = jasmine.createSpy('getTicketFields$').and.returnValue(of({}));
  public getTicketCustomField$ = jasmine.createSpy('getTicketCustomField$').and.returnValue(of({}));
  public sendRequest$ = jasmine.createSpy('sendRequest$').and.returnValue(of({}));
  public context$ = jasmine.createSpy('context$').and.returnValue(of({}));
  public resize$ = jasmine.createSpy('resize$').and.returnValue(of({}));
  public goToApp$ = jasmine.createSpy('goToApp$').and.returnValue(of({}));
}

/** Creates an injectable mock for Zendesk Service. */
export function createMockZendeskService(): Provider {
  return { provide: ZendeskService, useValue: new MockZendeskService() };
}
