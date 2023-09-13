import { TestBed, waitForAsync } from '@angular/core/testing';
import { Store, NgxsModule, Actions, ofActionSuccessful, ofActionErrored } from '@ngxs/store';
import { UserState } from '../user.state';
import { GetUser } from '../user.actions';
import { of, throwError } from 'rxjs';
import { createMockUserService, UserService } from '@shared/services/user';
import { createMockMsalServices } from '@shared/mocks/msal.service.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppState } from '@shared/state/app-state';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserModel } from '@models/user.model';
import faker from '@faker-js/faker';
import { UserRole } from '@models/enums';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { createMockWindowService, WindowService } from '@services/window';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('State: User', () => {
  let store: Store;
  let actions$: Actions;
  let mockUserService: UserService;
  let mockWindowService: WindowService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule, NgxsModule.forRoot([UserState])],
        providers: [
          createMockUserService(),
          ...createMockMsalServices(),
          createMockLoggerService(),
          createMockWindowService(),
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }),
    ).compileComponents();

    store = TestBed.inject(Store);
    actions$ = TestBed.inject(Actions);
    mockUserService = TestBed.inject(UserService);
    mockWindowService = TestBed.inject(WindowService);

    mockUserService.getUserProfile$ = jasmine.createSpy('getUserProfile$').and.returnValue(of({}));
    mockWindowService.location = jasmine
      .createSpy('location')
      .and.returnValue({ origin: 'http://microsoft.test' });
  }));

  describe('[GetUser] Action', () => {
    let action;

    beforeEach(() => {
      action = new GetUser();
    });

    describe('when UserService returns a valid profile', () => {
      let expectedProfile: UserModel;

      beforeEach(() => {
        expectedProfile = {
          emailAddress: 'test.email@microsoft.com',
          name: `${faker.name.firstName()} ${faker.name.lastName()}`,
          role: UserRole.LiveOpsAdmin,
          objectId: `${faker.datatype.uuid()}`,
          isMicrosoftEmail: true,
        };
        mockUserService.getUserProfile$ = jasmine
          .createSpy('getUserProfile$')
          .and.returnValue(of(expectedProfile));
      });

      it('should patch profile', () => {
        store.dispatch(action);

        store
          .selectOnce((state: AppState) => state.user.profile)
          .subscribe(profile => {
            expect(profile).toEqual(expectedProfile);
          });
      });

      it('should succeed the action', done => {
        actions$.pipe(ofActionSuccessful(GetUser)).subscribe(() => {
          done();
        });

        store.dispatch(action);
      });
    });

    describe('when UserService throws an error', () => {
      beforeEach(() => {
        mockUserService.getUserProfile$ = jasmine
          .createSpy('getUserProfile$')
          .and.returnValue(throwError({ message: '401 Unauthorized' }));
      });

      it('should patch profile with user_state_not_found', () => {
        store.dispatch(action);

        store
          .selectOnce(state => state.user.profile)
          .subscribe(profile => {
            expect(profile).toBe(null);
          });
      });

      it('should error the action', done => {
        actions$.pipe(ofActionErrored(GetUser)).subscribe(() => {
          done();
        });

        store.dispatch(action);
      });
    });
  });
});
