// -----------------------------------------------------------------------
// <copyright company='Microsoft Corporation'>
//   Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

// General
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject, getTestBed } from '@angular/core/testing';
import { Store, NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// Components
import { TicketSidebarCmpt } from './ticket-sidebar.cmpt';import { createMockClipboard, createMockScrutineerDataParser } from '@shared/helpers';
import { createMockZendeskService } from '@shared/services/zendesk';

// State
import { UserState } from '@shared/state/user/user.state';
import { createMockMsalService } from '@shared/mocks/msal.service.mock';

describe('TicketSidebarCmpt', () => {
    let fixture: ComponentFixture<TicketSidebarCmpt>;
    let component: TicketSidebarCmpt;
    let mockStore: Store;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                NgxsModule.forRoot([UserState])
            ],
            declarations: [TicketSidebarCmpt],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                createMockZendeskService(),
                createMockScrutineerDataParser(),
                createMockClipboard(),
                createMockMsalService()
            ]
        }).compileComponents();

        let injector = getTestBed();
        mockStore = injector.get(Store);
        
        fixture = TestBed.createComponent(TicketSidebarCmpt);
        component = fixture.debugElement.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
