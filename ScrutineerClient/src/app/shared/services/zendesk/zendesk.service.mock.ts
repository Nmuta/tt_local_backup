// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//   Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { Injectable } from '@angular/core';

import { ZendeskService } from './zendesk.service';

@Injectable()
export class MockZendeskService {
    public getTicketDetails = jasmine.createSpy('getTicketDetails');
    public getTicketRequestor = jasmine.createSpy('getTicketRequestor');
    public getTicketFields = jasmine.createSpy('getTicketFields');
    public getTicketCustomField = jasmine.createSpy('getTicketCustomField');
    public sendRequest = jasmine.createSpy('sendRequest');
    public currentUser = jasmine.createSpy('currentUser');
    public context = jasmine.createSpy('context');
    public resize = jasmine.createSpy('resize');
    public goToApp = jasmine.createSpy('goToApp');
}

export function createMockZendeskService() {
    return { provide: ZendeskService, useValue: new MockZendeskService() };
}
