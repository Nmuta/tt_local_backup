// General
import { NO_ERRORS_SCHEMA } from '@angular/core'; // <- goal is to do shallow test, so not going to care about child components.
import { Router } from '@angular/router';
import { Store, NgxsModule } from '@ngxs/store';
import {
  ComponentFixture,
  TestBed,
  getTestBed,
  fakeAsync,
  tick,
  flush,
  waitForAsync,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@environments/environment';
import { delay } from 'rxjs/operators';

// Components
import { AuthComponent } from './auth.component';

// Services
import { createMockZendeskService } from '@shared/services/zendesk';
import { createMockMsalService } from '@shared/mocks/msal.service.mock';

// States
import { UserState } from '@shared/state/user/user.state';
import { MsalService } from '@azure/msal-angular';
import { of } from 'rxjs';

// Models
import { UserModel } from '@shared/models/user.model';
import { createMockWindowService, WindowService } from '@shared/services/window';
import { ResetUserProfile, RequestAccessToken } from '@shared/state/user/user.actions';
import { createMockLoggerService } from '@services/logger/logger.service.mock';

describe('AuthComponent', () => {
  let mockWindowService: WindowService;
  let mockMsalService: MsalService;
  let mockStore: Store;
  let mockRouter: Router;

  let fixture: ComponentFixture<AuthComponent>;
  let component: AuthComponent;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState]),
        ],
        declarations: [AuthComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          createMockZendeskService(),
          createMockMsalService(),
          createMockWindowService(),
          createMockLoggerService(),
        ],
      }).compileComponents();

      const injector = getTestBed();
      mockStore = injector.inject(Store);
      mockWindowService = injector.inject(WindowService);
      mockMsalService = injector.inject(MsalService);
      mockRouter = injector.inject(Router);

      mockMsalService.loginRedirect = jasmine.createSpy('loginRedirect');
      mockMsalService.logout = jasmine.createSpy('logout');

      fixture = TestBed.createComponent(AuthComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    const testProfile: UserModel = { emailAddress: 'test.email@microsoft.com' };

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
        mockRouter.navigate = jasmine.createSpy('navigate');
        Object.defineProperty(component, 'profile$', { writable: true });
        component.profile$ = of(testProfile);
      });

      it('Should set profile', () => {
        component.ngOnInit();
        expect(component.profile).toEqual(testProfile);
      });

      it('Should set loading to false', () => {
        component.ngOnInit();
        expect(component.loading).toBeFalsy();
      });

      describe('If profile is valid and app is running in zendesk', () => {
        const fromApp = 'test-app';
        beforeEach(() => {
          component.fromRoute = fromApp;
        });

        it('Should call router.navigate correctly', () => {
          component.ngOnInit();
          expect(mockRouter.navigate).toHaveBeenCalledWith([`/${fromApp}`]);
        });
      });

      describe('If profile is valid', () => {
        beforeEach(() => {
          component.autoCloseWindow = jasmine.createSpy('autoCloseWindow');
        });

        describe('fromAadLogin is true', () => {
          it('Should call autoCloseWindow', () => {
            component.fromAadLogin = true;
            component.ngOnInit();
            expect(component.autoCloseWindow).toHaveBeenCalledWith(10);
          });
        });

        describe('fromAadLogin is false', () => {
          it('Should not call autoCloseWindow', () => {
            component.fromAadLogin = false;
            component.ngOnInit();
            expect(component.autoCloseWindow).not.toHaveBeenCalled();
          });
        });
      });

      describe('If profile is null', () => {
        beforeEach(() => {
          component.autoCloseWindow = jasmine.createSpy('autoCloseWindow');
          component.profile$ = of(null);
        });

        it('Should not call router.navigate', () => {
          component.ngOnInit();
          expect(mockRouter.navigate).not.toHaveBeenCalled();
        });

        describe('fromAadLogout is true', () => {
          it('Should call autoCloseWindow', () => {
            component.fromAadLogout = true;
            component.ngOnInit();
            expect(component.autoCloseWindow).toHaveBeenCalledWith(10);
          });
        });

        describe('fromAadLogout is false', () => {
          it('Should not call autoCloseWindow', () => {
            component.fromAadLogout = false;
            component.ngOnInit();
            expect(component.autoCloseWindow).not.toHaveBeenCalled();
          });
        });
      });

      describe('If app is not running in zendesk', () => {
        beforeEach(() => {
          mockWindowService.zafClient = jasmine.createSpy('zafClient').and.returnValue(false);
        });

        it('Should not call router.navigate', () => {
          component.ngOnInit();
          expect(mockRouter.navigate).not.toHaveBeenCalled();
        });
      });
    });

    describe('If subscribing to profile times out', () => {
      const delayTime = 20000;
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

      describe('If component.fromAadLogout is true', () => {
        beforeEach(() => {
          component.fromAadLogout = true;
          component.autoCloseWindow = jasmine.createSpy('autoCloseWindow');
        });

        it('should call autoCloseWindow', fakeAsync(() => {
          component.ngOnInit();

          tick(delayTime);
          expect(component.autoCloseWindow).toHaveBeenCalledWith(10);
        }));
      });

      describe('If component.fromAadLogout is false', () => {
        beforeEach(() => {
          component.fromAadLogout = false;
          component.autoCloseWindow = jasmine.createSpy('autoCloseWindow');
        });

        it('should call autoCloseWindow', fakeAsync(() => {
          component.ngOnInit();

          tick(delayTime);
          expect(component.autoCloseWindow).not.toHaveBeenCalled();
        }));
      });
    });
  });

  describe('Method: loginWithNewTab', () => {
    it('should call windowService.open correctly', () => {
      component.loginWithNewTab();

      expect(mockWindowService.open).toHaveBeenCalledWith(
        `${environment.stewardUiUrl}/auth?action=login`,
        '_blank',
      );
    });
  });

  describe('Method: login', () => {
    beforeEach(() => {
      mockMsalService.loginRedirect = jasmine.createSpy('loginRedirect');
    });

    it('should call msalService.loginRedirect correctly', () => {
      component.login();

      expect(mockMsalService.loginRedirect).toHaveBeenCalledWith({
        extraScopesToConsent: [environment.azureAppScope],
      });
    });
  });

  describe('Method: logout', () => {
    beforeEach(() => {
      mockMsalService.logout = jasmine.createSpy('logout');
    });

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

  describe('Method: autoCloseWindow', () => {
    it('should autoCloseTimeSecsLeft to the input param', () => {
      component.autoCloseWindow(10);
      expect(component.autoCloseTimeSecsLeft).toEqual(10);
    });

    describe('After waiting a second and the timer hits above 0', () => {
      it('should not call window.close', fakeAsync(() => {
        component.autoCloseWindow(10);
        tick(1500);
        expect(mockWindowService.close).not.toHaveBeenCalled();
        flush();
      }));
    });

    describe('After waiting a second and the timer hits 0', () => {
      it('should call window.close', fakeAsync(() => {
        component.autoCloseWindow(1);
        tick(1500);
        expect(mockWindowService.close).toHaveBeenCalled();
        flush();
      }));
    });
  });
});
