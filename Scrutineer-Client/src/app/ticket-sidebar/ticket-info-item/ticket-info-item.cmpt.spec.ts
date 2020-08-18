// -----------------------------------------------------------------------
// <copyright company='Microsoft Corporation'>
//   Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

// General
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject, getTestBed } from '@angular/core/testing';

// Components
import { TicketInfoItemCmpt } from './ticket-info-item.cmpt';import { createMockClipboard } from '@shared/helpers';
;

describe('TicketSidebarCmpt', () => {
    let fixture: ComponentFixture<TicketInfoItemCmpt>;
    let component: TicketInfoItemCmpt;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [TicketInfoItemCmpt],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                createMockClipboard()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TicketInfoItemCmpt);
        component = fixture.debugElement.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
