// -----------------------------------------------------------------------
// <copyright company='Microsoft Corporation'>
//   Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

// General
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Store, NgxsModule } from '@ngxs/store';
import { async, ComponentFixture, TestBed, inject, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// Components
import { SidebarCmpt } from './side-bar.cmpt';

// States
import { UserState } from '@shared/state/user/user.state';
import { createMockRouter } from '@shared/mocks/router.mock';
import { createMockMsalService } from '@shared/mocks/msal.service.mock';

describe('SidebarComponent', () => {
    let mockStore: Store;

    let fixture: ComponentFixture<SidebarCmpt>;
    let component: SidebarCmpt;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                NgxsModule.forRoot([UserState])
            ],
            declarations: [SidebarCmpt],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                createMockRouter(),
                createMockMsalService()
            ]
        }).compileComponents();

        let injector = getTestBed();
        mockStore = injector.get(Store);

        fixture = TestBed.createComponent(SidebarCmpt);
        component = fixture.debugElement.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
