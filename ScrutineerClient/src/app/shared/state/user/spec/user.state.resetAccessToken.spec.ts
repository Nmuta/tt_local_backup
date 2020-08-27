import { async, TestBed } from "@angular/core/testing";
import {
  Store,
  NgxsModule,
  Actions,
  ofActionSuccessful,
  ofActionErrored,
  ofActionDispatched,
} from "@ngxs/store";
import { UserState } from "../user.state";
import { ResetAccessToken } from "../user.actions";
import { of, throwError } from "rxjs";
import { createMockMsalService } from "@shared/mocks/msal.service.mock";
import { MsalService } from "@azure/msal-angular";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("State: User", () => {
  let store: Store;
  let actions$: Actions;
  let mockAuthService: MsalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([UserState])],
      providers: [createMockMsalService()],
    }).compileComponents();

    store = TestBed.get(Store);
    actions$ = TestBed.get(Actions);
    mockAuthService = TestBed.get(MsalService);

    mockAuthService.acquireTokenSilent = jasmine
      .createSpy("acquireTokenSilent")
      .and.returnValue(of({}));
  }));
  describe("[ResetAccessToken] Action", () => {
    let action;
    beforeEach(() => {
      action = new ResetAccessToken();
      store.reset({
        user: {
          accessToken: "testing-access-token",
        },
      });
    });
    it("should patch access token to undefined", () => {
      // Action
      store.dispatch(action);

      // Assert
      store
        .selectOnce((state) => state.user.accessToken)
        .subscribe((accessToken) => {
          expect(accessToken).toBeUndefined();
        });
    });
  });
});
