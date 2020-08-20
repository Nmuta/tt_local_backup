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
import { RouterTestingModule } from '@angular/router/testing';

// Helpers
import { createMockClipboard, createMockScrutineerDataParser } from '@shared/helpers';

// Components
import { TicketSidebarComponent } from './ticket-sidebar.cmpt';
import { createMockZendeskService } from '@shared/services/zendesk';

// State
import { UserState } from '@shared/state/user/user.state';
import { createMockMsalService } from '@shared/mocks/msal.service.mock';

describe('TicketSidebarComponent', () => {
    let fixture: ComponentFixture<TicketSidebarComponent>;
    let component: TicketSidebarComponent;
    let mockStore: Store;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([]),
                HttpClientTestingModule,
                NgxsModule.forRoot([UserState])
            ],
            declarations: [TicketSidebarComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                createMockZendeskService(),
                createMockScrutineerDataParser(),
                createMockClipboard(),
                createMockMsalService()
            ]
        }).compileComponents();

        const injector = getTestBed();
        mockStore = injector.get(Store);

        fixture = TestBed.createComponent(TicketSidebarComponent);
        component = fixture.debugElement.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
