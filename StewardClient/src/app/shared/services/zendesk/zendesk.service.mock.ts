import { Injectable, Provider } from '@angular/core';
import { of } from 'rxjs';

import { TicketFieldsResponse, TicketRequesterResponse, ZendeskService } from './zendesk.service';

/** Defines the mock for the Zendesk Service. */
@Injectable()
export class MockZendeskService {
  public getTicketDetails$ = jasmine.createSpy('getTicketDetails$').and.returnValue(of({}));

  public getTicketRequestor$ = jasmine
    .createSpy('getTicketRequestor$')
    .and.returnValue(of(<TicketRequesterResponse>{ ['ticket.requester']: { name: 'name' } }));

  public getTicketFields$ = jasmine.createSpy('getTicketFields$').and.returnValue(
    of(<TicketFieldsResponse>{
      ticketFields: { mystery: { label: 'Forza Title', name: 'ITS_A_MYSTERY' } },
    }),
  );

  public getTicketCustomField$ = jasmine
    .createSpy('getTicketCustomField$')
    .and.returnValue(of({ ['ticket.customField:ITS_A_MYSTERY']: 'FORZA_HORIZON_5' }));

  public sendRequest$ = jasmine.createSpy('sendRequest$').and.returnValue(of({}));
  public context$ = jasmine.createSpy('context$').and.returnValue(of({}));
  public resize$ = jasmine.createSpy('resize$').and.returnValue(of({}));
  public goToApp$ = jasmine.createSpy('goToApp$').and.returnValue(of({}));
}

/** Creates an injectable mock for Zendesk Service. */
export function createMockZendeskService(): Provider {
  return { provide: ZendeskService, useValue: new MockZendeskService() };
}
