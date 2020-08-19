// -----------------------------------------------------------------------
// <copyright company='Microsoft Corporation'>
//   Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

// General
import { NO_ERRORS_SCHEMA } from '@angular/core'; // <- goal is to do shallow test, so not going to care about child components.
import { ActivatedRoute } from '@angular/router';
import { Store, NgxsModule } from '@ngxs/store';
import { async, ComponentFixture, TestBed, inject, getTestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// Components
import { AuthCmpt } from './auth.cmpt';

// Services
import { createMockZendeskService, ZendeskService } from '@shared/services/zendesk';
import { createMockMsalService } from '@shared/mocks/msal.service.mock';

// States
import { UserState } from '@shared/state/user/user.state';
import { MsalService } from '@azure/msal-angular';
import { of } from 'rxjs';

// Models
import { UserModel } from '@shared/models/user.model';
import { delay } from 'rxjs/operators';
import { createMockWindowService, WindowService } from '@shared/services/window';

describe('AuthComponent', () => {
    let mockWindowService: WindowService;
    let mockMsalService: MsalService;
    let mockStore: Store;

    let fixture: ComponentFixture<AuthCmpt>;
    let component: AuthCmpt;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                NgxsModule.forRoot([UserState])
            ],
            declarations: [AuthCmpt],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                createMockZendeskService(),
                createMockMsalService(),
                createMockWindowService()
            ]
        }).compileComponents();

        let injector = getTestBed();
        mockStore = injector.get(Store);
        mockWindowService = injector.get(WindowService);
        mockMsalService = injector.get(MsalService);

        fixture = TestBed.createComponent(AuthCmpt);
        component = fixture.debugElement.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Method: ngOnInit', () => {
        var testProfile: UserModel = { emailAddress: 'test.email@microsoft.com' };
        beforeEach(() => {
            mockWindowService.zafClient = jasmine.createSpy('zafClient').and.returnValue({});
        });
        describe('When windowService.zafClient returns an object', () => {
            it('Should set inZendesk to true', () => {
                component.ngOnInit();
                expect(component.inZendesk).toBeTruthy();
            });
        });
        describe('When windowService.zafClient returns false', () => {
            beforeEach(() => {
                mockWindowService.zafClient = jasmine.createSpy('zafClient').and.returnValue(false);
            });
            it('Should set inZendesk to false', () => {
                component.ngOnInit();
                expect(component.inZendesk).toBeFalsy();
            });
        });
        describe('If subscribing to profile returns a value', () => {
            beforeEach(() => {
                Object.defineProperty(component, 'profile$', { writable: true });
                component.profile$ = of(testProfile);
                component.ngOnInit();
            });
            it('Should set profile', () => {
                expect(component.profile).toEqual(testProfile);
            });
            it('Should set loading to false', () => {
                expect(component.loading).toBeFalsy();
            });
        });
        describe('If subscribing to profile times out', () => {
            let delayTime = 20000;
            beforeEach(() => {
                Object.defineProperty(component, 'profile$', { writable: true });
                component.profile$ = of(testProfile).pipe(delay(delayTime));
            });
            it('Should set profile to null', fakeAsync(() => { 
                component.ngOnInit();   
                tick(delayTime);
                expect(component.profile).toEqual(null);
            }));
            it('Should set loading to false', fakeAsync(() => {
                component.ngOnInit();  
                tick(delayTime); 
                expect(component.loading).toBeFalsy();
            }));
        });
    });
});
