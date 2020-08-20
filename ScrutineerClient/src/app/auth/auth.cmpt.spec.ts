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
import { environment } from '@environments/environment';
import { ResetUserProfile, RequestAccessToken } from '@shared/state/user/user.actions';

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

        mockMsalService.loginRedirect = jasmine.createSpy('loginRedirect');
        mockMsalService.logout = jasmine.createSpy('logout');

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
    describe('Method: openAuthPageInNewTab', () => {
        beforeEach(() => {
            mockWindowService.open = jasmine.createSpy('open');
        });
        it('should call windowService.open correctly', () => {
            component.openAuthPageInNewTab();

            expect(mockWindowService.open).toHaveBeenCalledWith(`${environment.clientUrl}/auth`, '_blank');
        })
    });
    describe('Method: login', () => {
        beforeEach(() => {
            mockMsalService.loginRedirect = jasmine.createSpy('loginRedirect');
        });
        it('should call msalService.loginRedirect correctly', () => {
            component.login();

            expect(mockMsalService.loginRedirect).toHaveBeenCalledWith({
                extraScopesToConsent: ['api://cfe0ac3f-d0a7-4566-99f7-0c56b7a9f7d4/api_access']
            });
        })
    });
    describe('Method: login', () => {
        it('should call msalService.loginRedirect correctly', () => {
            component.login();

            expect(mockMsalService.loginRedirect).toHaveBeenCalledWith({
                extraScopesToConsent: ['api://cfe0ac3f-d0a7-4566-99f7-0c56b7a9f7d4/api_access']
            });
        })
    });
    describe('Method: logout', () => {
        it('should call msalService.logout', () => {
            component.logout();

            expect(mockMsalService.logout).toHaveBeenCalled();
        });
    });
    describe('Method: recheckAuth', () => {
        beforeEach(() => {
            mockStore.dispatch = jasmine.createSpy('dispatch').and.returnValue(of({}));
            component.ngOnInit = jasmine.createSpy('ngOnInit');
        });
        it('should dispatch store action ResetUserProfile', () => {
            component.recheckAuth();

            expect(mockStore.dispatch).toHaveBeenCalledWith(new ResetUserProfile());
        });
        it('should dispatch store action RequestAccessToken', () => {
            component.recheckAuth();

            expect(mockStore.dispatch).toHaveBeenCalledWith(new RequestAccessToken());
        });
        it('should call ngOnInit', () => {
            component.recheckAuth();

            expect(component.ngOnInit).toHaveBeenCalled();
        });
    });
});
