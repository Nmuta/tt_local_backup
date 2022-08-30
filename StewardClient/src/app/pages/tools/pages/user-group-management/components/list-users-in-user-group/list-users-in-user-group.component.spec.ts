import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { BasicPlayerList } from '@models/basic-player-list';
import { GameTitle } from '@models/enums';
import { LspGroup } from '@models/lsp-group';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
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
    getPlayersInUserGroup$: (_userGroup: LspGroup, _startIndex: number, _maxResults: number) => {
      return of(undefined);
    },
    deletePlayerFromUserGroup$: (_playerList: BasicPlayerList, _userGroup: LspGroup) => {
      return of([]);
    },
    deleteAllPlayersFromUserGroup$: (_userGroup: LspGroup) => {
      return of(undefined);
    },
    deletePlayersFromUserGroupUsingBackgroundTask$: (
      _playerList: BasicPlayerList,
      _userGroup: LspGroup,
    ) => {
      return of(undefined);
    },
    addPlayersToUserGroupUsingBackgroundTask$: (
      _playerList: BasicPlayerList,
      _userGroup: LspGroup,
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
      declarations: [ListUsersInGroupComponent],
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
