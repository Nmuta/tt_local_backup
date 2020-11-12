import { TestBed, waitForAsync } from '@angular/core/testing';
import {
  Store,
  NgxsModule,
  Actions,
  ofActionSuccessful,
} from '@ngxs/store';
import { UserState } from '../user.state';
import { GetUser } from '../user.actions';
import { of, throwError } from 'rxjs';
import { createMockUserService, UserService } from '@shared/services/user';
import { createMockMsalService } from '@shared/mocks/msal.service.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('State: User', () => {
  let store: Store;
  let actions$: Actions;
  let mockUserService: UserService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, NgxsModule.forRoot([UserState])],
        providers: [createMockUserService(), createMockMsalService()],
      }).compileComponents();

      store = TestBed.inject(Store);
      actions$ = TestBed.inject(Actions);
      mockUserService = TestBed.inject(UserService);

      mockUserService.getUserProfile = jasmine
        .createSpy('getUserProfile')
        .and.returnValue(of({}));
    })
  );
  describe('[GetUser] Action', () => {
    let action;
    beforeEach(() => {
      action = new GetUser();
    });
    describe('when UserService returns a valid profile', () => {
      let expectedProfile: unknown;
      beforeEach(() => {
        expectedProfile = {
          name: 'Luke G',
        };
        mockUserService.getUserProfile = jasmine
          .createSpy('getUserProfile')
          .and.returnValue(of(expectedProfile));
      });
      it('should patch profile', () => {
        // Action
        store.dispatch(action);

        // Assert
        store
          .selectOnce(state => state.user.profile)
          .subscribe(profile => {
            expect(profile).toBe(expectedProfile);
          });
      });
      it('should succeed the action', done => {
        // Assert
        actions$.pipe(ofActionSuccessful(GetUser)).subscribe(() => {
          done();
        });

        // Action
        store.dispatch(action);
      });
    });
    describe('when UserService throws an error', () => {
      beforeEach(() => {
        mockUserService.getUserProfile = jasmine
          .createSpy('getUserProfile')
          .and.returnValue(throwError({ message: '401 Unauthorized' }));
      });
      it('should patch profile with null', () => {
        // Action
        store.dispatch(action);

        // Assert
        store
          .selectOnce(state => state.user.profile)
          .subscribe(profile => {
            expect(profile).toBeNull();
          });
      });
      it('should succeed the action', done => {
        // Assert
        actions$.pipe(ofActionSuccessful(GetUser)).subscribe(() => {
          done();
        });

        // Action
        store.dispatch(action);
      });
    });
  });
});
