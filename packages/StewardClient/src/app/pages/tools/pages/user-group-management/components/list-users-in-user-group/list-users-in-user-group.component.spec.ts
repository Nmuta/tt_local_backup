import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { BasicPlayerList } from '@models/basic-player-list';
import { GameTitle } from '@models/enums';
import { LspGroup } from '@models/lsp-group';
import { ForzaBulkOperationType } from '@models/user-group-bulk-operation';
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

  describe('Method: ngOnChanges', () => {
    describe('When service is null', () => {
      beforeEach(() => {
        component.service = null;
      });

      it('should throw error', () => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component.ngOnChanges(<any>{});

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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component.ngOnChanges(<any>{});

          expect(true).toBeTruthy();
        } catch (e) {
          expect(e).toEqual(null);
          expect(false).toBeTruthy();
        }
      });
    });
  });
});
