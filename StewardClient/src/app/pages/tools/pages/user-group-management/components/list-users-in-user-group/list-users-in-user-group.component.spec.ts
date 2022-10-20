import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import faker from '@faker-js/faker';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { BasicPlayerList } from '@models/basic-player-list';
import { GameTitle, UserRole } from '@models/enums';
import { LspGroup } from '@models/lsp-group';
import { ForzaBulkOperationType } from '@models/user-group-bulk-operation';
import { UserModel } from '@models/user.model';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';
import { UserState } from '@shared/state/user/user.state';
import { of } from 'rxjs';
import {
  ListUsersInGroupComponent,
  ListUsersInGroupServiceContract,
} from './list-users-in-user-group.component';

describe('ListUsersInGroupComponent', () => {
  let component: ListUsersInGroupComponent;
  let fixture: ComponentFixture<ListUsersInGroupComponent>;
  let mockStore: Store;

  const baseUserModel = {
    emailAddress: faker.datatype.string(),
    role: UserRole.LiveOpsAdmin,
    name: faker.datatype.string(),
    objectId: faker.datatype.uuid(),
  } as UserModel;

  const mockService: ListUsersInGroupServiceContract = {
    gameTitle: GameTitle.FH5,
    largeUserGroups: [],
    getPlayersInUserGroup$: (_userGroup: LspGroup, _startIndex: number, _maxResults: number) => {
      return of(undefined);
    },
    deletePlayerFromUserGroup$: (_playerList: BasicPlayerList, _userGroup: LspGroup) => {
      return of(undefined);
    },
    deleteAllPlayersFromUserGroup$: (_userGroup: LspGroup) => {
      return of(undefined);
    },
    deletePlayersFromUserGroupUsingBulkProcessing$: (
      _playerList: BasicPlayerList,
      _userGroup: LspGroup,
    ) => {
      return of(undefined);
    },
    addPlayersToUserGroupUsingBulkProcessing$: (
      _playerList: BasicPlayerList,
      _userGroup: LspGroup,
    ) => {
      return of(undefined);
    },
    getBulkOperationStatus$: (
      _userGroup: LspGroup,
      _bulkOperationType: ForzaBulkOperationType,
      _bulkOperationId: string,
    ) => {
      return of(undefined);
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([UserState]),
      ],
      declarations: [ListUsersInGroupComponent, HumanizePipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [...createMockMsalServices(), createMockLoggerService()],
    }).compileComponents();

    fixture = TestBed.createComponent(ListUsersInGroupComponent);
    component = fixture.debugElement.componentInstance;
    component.service = mockService;

    mockStore = TestBed.inject(Store);
    mockStore.dispatch = jasmine.createSpy('dispatch');
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    // Test good/bad user roles for each perm variable
    describe('When user has write perms', () => {
      beforeEach(() => {
        baseUserModel.role = UserRole.LiveOpsAdmin;
        mockStore.selectSnapshot = jasmine
          .createSpy('selectSnapshot')
          .and.returnValue(baseUserModel);
      });

      it('should set userHasWritePerms to true', () => {
        component.ngOnInit();

        expect(component.userHasWritePerms).toBeTruthy();
      });
    });

    describe('When user does not have write perms', () => {
      beforeEach(() => {
        baseUserModel.role = UserRole.SupportAgentNew;
        mockStore.selectSnapshot = jasmine
          .createSpy('selectSnapshot')
          .and.returnValue(baseUserModel);
      });

      it('should set userHasWritePerms to false', () => {
        component.ngOnInit();

        expect(component.userHasWritePerms).toBeFalsy();
      });
    });

    describe('When user has remove all perms', () => {
      beforeEach(() => {
        baseUserModel.role = UserRole.LiveOpsAdmin;
        mockStore.selectSnapshot = jasmine
          .createSpy('selectSnapshot')
          .and.returnValue(baseUserModel);
      });

      it('should set userHasRemoveAllPerms to true', () => {
        component.ngOnInit();

        expect(component.userHasRemoveAllPerms).toBeTruthy();
      });
    });

    describe('When user does not have remove all perms', () => {
      beforeEach(() => {
        baseUserModel.role = UserRole.SupportAgentNew;
        mockStore.selectSnapshot = jasmine
          .createSpy('selectSnapshot')
          .and.returnValue(baseUserModel);
      });

      it('should set userHasRemoveAllPerms to false', () => {
        component.ngOnInit();

        expect(component.userHasRemoveAllPerms).toBeFalsy();
      });
    });
  });

  describe('Method: ngOnChanges', () => {
    describe('When service is null', () => {
      beforeEach(() => {
        component.service = null;
      });

      it('should throw error', () => {
        try {
          component.ngOnChanges({});

          expect(false).toBeTruthy();
        } catch (e) {
          expect(true).toBeTruthy();
          expect(e.message).toEqual(
            'No service contract was provided for ListUsersInGroupComponent',
          );
        }
      });
    });

    describe('When service is provided', () => {
      // Provided by default in the test component
      it('should not throw error', () => {
        try {
          component.ngOnChanges({});

          expect(true).toBeTruthy();
        } catch (e) {
          expect(e).toEqual(null);
          expect(false).toBeTruthy();
        }
      });
    });
  });
});
