import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  getTestBed,
  waitForAsync,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { createMockWindowService } from '@shared/services/window';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, NgxsModule } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createMockMsalService } from '@shared/mocks/msal.service.mock';
import { LogoutUser } from '@shared/state/user/user.actions';
import { of } from 'rxjs';
import { UserModel } from '@models/user.model';
import { delay } from 'rxjs/operators';
import { UserRole } from '@models/enums';
import faker from 'faker';
import { createMockLoggerService } from '@services/logger/logger.service.mock';

describe('ProfileComponent', () => {
  let mockRouter: Router;
  let mockStore: Store;

  let fixture: ComponentFixture<ProfileComponent>;
  let component: ProfileComponent;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState]),
        ],
        declarations: [ProfileComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockWindowService(), createMockMsalService(), createMockLoggerService()],
      }).compileComponents();

      const injector = getTestBed();
      mockRouter = injector.inject(Router);
      mockStore = injector.inject(Store);

      fixture = TestBed.createComponent(ProfileComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: logout', () => {
    beforeEach(() => {
      mockStore.dispatch = jasmine.createSpy('dispatch').and.returnValue(of({}));
    });

    it('should dispatch LogoutUser', () => {
      component.logout();

      expect(mockStore.dispatch).toHaveBeenCalledWith(new LogoutUser(''));
    });
  });

  describe('Method: changeProfileTabVisibility', () => {
    describe('When profileTabVisible is false', () => {
      it('should call set profileTabVisible to true', () => {
        component.profileTabVisible = false;
        component.changeProfileTabVisibility();

        expect(component.profileTabVisible).toBeTruthy();
      });
    });

    describe('When profileTabVisible is true', () => {
      it('should call set profileTabVisible to false', () => {
        component.profileTabVisible = true;
        component.changeProfileTabVisibility();

        expect(component.profileTabVisible).toBeFalsy();
      });
    });
  });

  describe('Method: ngOnInit', () => {
    const testProfile: UserModel = {
      emailAddress: 'test.email@microsoft.com',
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      role: UserRole.LiveOpsAdmin,
      objectId: `${faker.datatype.uuid()}`,
      liveOpsAdminSecondaryRole: undefined,
    };

    describe('When subscribing to profile returns a value', () => {
      beforeEach(() => {
        mockRouter.navigate = jasmine.createSpy('navigate');
        Object.defineProperty(component, 'profile$', { writable: true });
        component.profile$ = of(testProfile);
      });

      it('Should set profile', () => {
        component.ngOnInit();
        expect(component.user).toEqual(testProfile);
      });

      it('Should set loading to false', () => {
        component.ngOnInit();
        expect(component.loading).toBeFalsy();
      });

      describe('If profile is valid', () => {
        beforeEach(() => {
          component.profile$ = of(testProfile);
        });

        it('Should not redirect to auth page', () => {
          component.ngOnInit();
          expect(mockRouter.navigate).not.toHaveBeenCalledWith([`/auth`], {
            queryParams: { from: 'navbar-app' },
          });
        });
      });
    });

    describe('If subscribing to profile times out', () => {
      const delayTime = 20000;

      beforeEach(() => {
        mockRouter.navigate = jasmine.createSpy('navigate');
        Object.defineProperty(component, 'profile$', { writable: true });
        component.profile$ = of(testProfile).pipe(delay(delayTime));
      });

      it('Should set loading to false', fakeAsync(() => {
        component.ngOnInit();
        tick(delayTime);
        expect(component.loading).toBeFalsy();
      }));
    });
  });
});
