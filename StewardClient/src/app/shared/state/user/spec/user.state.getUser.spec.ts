import { TestBed, waitForAsync } from '@angular/core/testing';
import { Store, NgxsModule, Actions, ofActionSuccessful, ofActionErrored } from '@ngxs/store';
import { UserState } from '../user.state';
import { GetUser } from '../user.actions';
import { of, throwError } from 'rxjs';
import { createMockUserService, UserService } from '@shared/services/user';
import { createMockMsalService } from '@shared/mocks/msal.service.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppState } from '@shared/state/app-state';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserModel } from '@models/user.model';
import faker from 'faker';
import { UserRole } from '@models/enums';

describe('State: User', () => {
  let store: Store;
  let actions$: Actions;
  let mockUserService: UserService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, NgxsModule.forRoot([UserState])],
        providers: [createMockUserService(), createMockMsalService()],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();

      store = TestBed.inject(Store);
      actions$ = TestBed.inject(Actions);
      mockUserService = TestBed.inject(UserService);

      mockUserService.getUserProfile = jasmine.createSpy('getUserProfile').and.returnValue(of({}));
    }),
  );

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
          role: UserRole.LiveOpsAdmin
        };
        mockUserService.getUserProfile = jasmine
          .createSpy('getUserProfile')
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
        mockUserService.getUserProfile = jasmine
          .createSpy('getUserProfile')
          .and.returnValue(throwError({ message: '401 Unauthorized' }));
      });

      it('should patch profile with user_state_not_found', () => {
        store.dispatch(action);

        store
          .selectOnce(state => state.user.profile)
          .subscribe(profile => {
            expect(profile).toBe(UserState.NOT_FOUND);
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
