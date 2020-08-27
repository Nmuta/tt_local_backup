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
import { GetUser } from "../user.actions";
import { of, throwError } from "rxjs";
import { createMockUserService, UserService } from "@shared/services/user";
import { createMockMsalService } from "@shared/mocks/msal.service.mock";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("State: User", () => {
  let store: Store;
  let actions$: Actions;
  let mockUserService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([UserState])],
      providers: [createMockUserService(), createMockMsalService()],
    }).compileComponents();

    store = TestBed.get(Store);
    actions$ = TestBed.get(Actions);
    mockUserService = TestBed.get(UserService);

    mockUserService.getUserProfile = jasmine
      .createSpy("getUserProfile")
      .and.returnValue(of({}));
  }));
  describe("[GetUser] Action", () => {
    let action;
    beforeEach(() => {
      action = new GetUser();
    });
    describe("when UserService returns a valid profile", () => {
      let expectedProfile: any;
      beforeEach(() => {
        expectedProfile = {
          name: "Luke G",
        };
        mockUserService.getUserProfile = jasmine
          .createSpy("getUserProfile")
          .and.returnValue(of(expectedProfile));
      });
      it("should patch profile", () => {
        // Action
        store.dispatch(action);

        // Assert
        store
          .selectOnce(state => state.user.profile)
          .subscribe(profile => {
            expect(profile).toBe(expectedProfile);
          });
      });
      it("should succeed the action", done => {
        // Assert
        actions$.pipe(ofActionSuccessful(GetUser)).subscribe(() => {
          done();
        });

        // Action
        store.dispatch(action);
      });
    });
    describe("when UserService throws an error", () => {
      let expectedProfile: any;
      beforeEach(() => {
        expectedProfile = {
          name: "Luke G",
        };
        mockUserService.getUserProfile = jasmine
          .createSpy("getUserProfile")
          .and.returnValue(throwError({ message: "401 Unauthorized" }));
      });
      it("should patch profile with null", () => {
        // Action
        store.dispatch(action);

        // Assert
        store
          .selectOnce(state => state.user.profile)
          .subscribe(profile => {
            expect(profile).toBeNull();
          });
      });
      it("should succeed the action", done => {
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
