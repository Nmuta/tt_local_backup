import { TestBed, waitForAsync } from '@angular/core/testing';
import { Store, NgxsModule, Actions } from '@ngxs/store';
import { UserState } from '../user.state';
import { ResetAccessToken } from '../user.actions';
import { of } from 'rxjs';
import { createMockMsalService } from '@shared/mocks/msal.service.mock';
import { MsalService } from '@azure/msal-angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('State: User', () => {
  let store: Store;
  let actions$: Actions;
  let mockAuthService: MsalService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, NgxsModule.forRoot([UserState])],
        providers: [createMockMsalService()],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();

      store = TestBed.inject(Store);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      actions$ = TestBed.inject(Actions);
      mockAuthService = TestBed.inject(MsalService);

      mockAuthService.acquireTokenSilent = jasmine
        .createSpy('acquireTokenSilent')
        .and.returnValue(of({}));
    }),
  );
  describe('[ResetAccessToken] Action', () => {
    let action;
    beforeEach(() => {
      action = new ResetAccessToken();
      store.reset({
        user: {
          accessToken: 'testing-access-token',
        },
      });
    });
    it('should patch access token to undefined', () => {
      // Action
      store.dispatch(action);

      // Assert
      store
        .selectOnce(state => state.user.accessToken)
        .subscribe(accessToken => {
          expect(accessToken).toBeUndefined();
        });
    });
  });
});
