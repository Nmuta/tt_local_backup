import BigNumber from 'bignumber.js';
// General
import { NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

// Helpers
import { createMockClipboard } from '@shared/helpers/clipboard';
import { createMockScrutineerDataParser } from '@shared/helpers/scrutineer-data-parser';

// Components
import { TicketAppBaseComponent } from './ticket-app.base.component';

import { createMockZendeskService, TicketService } from '@shared/services/zendesk';

// State
import { UserState } from '@shared/state/user/user.state';
import { createMockMsalServices } from '@shared/mocks/msal.service.mock';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { of } from 'rxjs';
import { GameTitleCodeName } from '@models/enums';
import { Navigate } from '@ngxs/router-plugin';
import faker from '@faker-js/faker';
import { IdentityResultAlpha } from '@models/identity-query.model';

describe('TicketAppBaseComponent', () => {
  let fixture: ComponentFixture<TicketAppBaseComponent<IdentityResultAlpha>>;
  let component: TicketAppBaseComponent<IdentityResultAlpha>;

  let mockTicketService: TicketService;
  let mockStore: Store;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([UserState]),
      ],
      declarations: [TicketAppBaseComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        createMockZendeskService(),
        createMockScrutineerDataParser(),
        createMockClipboard(),
        ...createMockMsalServices(),
        createMockLoggerService(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      TicketAppBaseComponent as Type<TicketAppBaseComponent<IdentityResultAlpha>>,
    );
    component = fixture.debugElement.componentInstance;

    mockTicketService = TestBed.inject(TicketService);
    mockStore = TestBed.inject(Store);

    const lookupGamertag = faker.name.firstName();
    const xuid = new BigNumber(faker.datatype.number());
    const validIdentity: IdentityResultAlpha = {
      query: undefined,
      xuid: xuid,
      gamertag: lookupGamertag,
      error: undefined,
    };
    component.requestPlayerIdentity$ = jasmine
      .createSpy('requestPlayerIdentity$')
      .and.returnValue(of(validIdentity));
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    beforeEach(() => {
      mockStore.dispatch = jasmine.createSpy('dispatch').and.returnValue(of({}));
    });
    describe('When getForzaTitle$ returns matching component title', () => {
      const expectGameTitle = GameTitleCodeName.FH4;
      beforeEach(() => {
        component.isInCorrectTitleRoute = jasmine
          .createSpy('isInCorrectTitleRoute')
          .and.returnValue(true);
        mockTicketService.getForzaTitle$ = jasmine
          .createSpy('getForzaTitle$')
          .and.returnValue(of(expectGameTitle));
      });

      it('should not dispatch Naviate action', () => {
        component.ngOnInit();

        expect(mockStore.dispatch).not.toHaveBeenCalledWith(
          new Navigate(['/ticket-app/title/'], null, { replaceUrl: true }),
        );
      });
    });

    describe('When getForzaTitle$ returns mismatching component title', () => {
      const expectGameTitle = GameTitleCodeName.FH4;
      beforeEach(() => {
        component.isInCorrectTitleRoute = jasmine
          .createSpy('isInCorrectTitleRoute')
          .and.returnValue(false);
        mockTicketService.getForzaTitle$ = jasmine
          .createSpy('getForzaTitle$')
          .and.returnValue(of(expectGameTitle));
      });

      it('should dispatch Naviate action', () => {
        component.ngOnInit();

        expect(mockStore.dispatch).toHaveBeenCalledWith(
          new Navigate(['/ticket-app/title/'], null, { replaceUrl: true }),
        );
      });
    });
  });

  describe('When getTicketRequestorGamertag$ returns valid identity', () => {
    const lookupGamertag = faker.name.firstName();
    const xuid = new BigNumber(faker.datatype.number());
    const validIdentity: IdentityResultAlpha = {
      query: undefined,
      xuid: xuid,
      gamertag: lookupGamertag,
      error: undefined,
    };
    beforeEach(() => {
      component.isInCorrectTitleRoute = jasmine
        .createSpy('isInCorrectTitleRoute')
        .and.returnValue(true);
      mockTicketService.getTicketRequestorGamertag$ = jasmine
        .createSpy('getTicketRequestorGamertag$')
        .and.returnValue(of(lookupGamertag));
      component.requestPlayerIdentity$ = jasmine
        .createSpy('requestPlayerIdentity$')
        .and.returnValue(of(validIdentity));
    });

    it('should set component variables correctly', () => {
      component.ngOnInit();

      expect(component.playerIdentity).not.toBeUndefined();
      expect(component.playerIdentity.xuid).toEqual(xuid);
      expect(component.playerIdentity.gamertag).toEqual(lookupGamertag);
      expect(component.playerIdentity.error).toBeUndefined();
    });
  });

  describe('When getTicketRequestorGamertag$ returns invalid identity', () => {
    const lookupGamertag = faker.name.firstName();
    const error = {
      code: '500',
      message: 'test error',
      target: '',
      details: [],
      innererror: undefined,
    };
    const invalidIdentity: IdentityResultAlpha = {
      query: undefined,
      xuid: null,
      gamertag: null,
      error: error,
    };
    beforeEach(() => {
      component.isInCorrectTitleRoute = jasmine
        .createSpy('isInCorrectTitleRoute')
        .and.returnValue(true);
      mockTicketService.getTicketRequestorGamertag$ = jasmine
        .createSpy('getTicketRequestorGamertag$')
        .and.returnValue(of(lookupGamertag));
      component.requestPlayerIdentity$ = jasmine
        .createSpy('requestPlayerIdentity$')
        .and.returnValue(of(invalidIdentity));
    });

    it('should set component variables correctly', () => {
      component.ngOnInit();

      expect(component.playerIdentity).not.toBeUndefined();
      expect(component.playerIdentity.xuid).toBeNull();
      expect(component.playerIdentity.gamertag).toBeNull();
      expect(component.playerIdentity.error).toEqual(error);
    });
  });
});
