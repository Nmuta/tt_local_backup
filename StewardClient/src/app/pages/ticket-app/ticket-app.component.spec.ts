// General
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  getTestBed,
  tick,
  fakeAsync,
  waitForAsync,
} from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

// Helpers
import { createMockClipboard } from '@shared/helpers/clipboard';
import { createMockScrutineerDataParser } from '@shared/helpers/scrutineer-data-parser';

// Components
import { TicketAppComponent } from './ticket-app.component';

import { createMockZendeskService, ZendeskService } from '@shared/services/zendesk';

// State
import { UserState } from '@shared/state/user/user.state';
import { createMockMsalService } from '@shared/mocks/msal.service.mock';
import { UserModel } from '@shared/models/user.model';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { GameTitleCodeName } from '@models/enums';

describe('TicketAppComponent', () => {
  let fixture: ComponentFixture<TicketAppComponent>;
  let component: TicketAppComponent;
  let mockZendeskService: ZendeskService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState]),
        ],
        declarations: [TicketAppComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          createMockZendeskService(),
          createMockScrutineerDataParser(),
          createMockClipboard(),
          createMockMsalService(),
        ],
      }).compileComponents();

      const injector = getTestBed();
      mockZendeskService = injector.inject(ZendeskService);

      fixture = TestBed.createComponent(TicketAppComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    const testProfile: UserModel = { emailAddress: 'test.email@microsoft.com' };

    describe('When subscribing to profile returns a value', () => {
      beforeEach(() => {
        component.getTicketRequestorGamertag = jasmine.createSpy('getTicketRequestor');
        Object.defineProperty(component, 'profile$', { writable: true });
        component.profile$ = of(testProfile);
      });

      it('Should set profile', () => {
        component.ngOnInit();
        expect(component.profile).toEqual(testProfile);
      });

      it('Should set loading to false', () => {
        component.ngOnInit();
        expect(component.loading).toBeFalsy();
      });

      describe('If profile is valid', () => {
        beforeEach(() => {
          component.profile$ = of(testProfile);
        });
        it('Should call getTicketRequestor', () => {
          component.ngOnInit();
          expect(component.getTicketRequestorGamertag).toHaveBeenCalled();
        });
      });
    });

    describe('If subscribing to profile times out', () => {
      const delayTime = 20000;
      beforeEach(() => {
        Object.defineProperty(component, 'profile$', { writable: true });
        component.profile$ = of(testProfile).pipe(delay(delayTime));
      });

      it('Should set loading to false', fakeAsync(() => {
        component.ngOnInit();
        tick(delayTime);
        expect(component.loading).toBeFalsy();
      }));
    });
  });

  describe('Method: ngAfterViewInit', () => {
    it('Should call zendeskService.resize correctly', () => {
      component.ngAfterViewInit();
      expect(mockZendeskService.resize$).toHaveBeenCalledWith('100%', '500px');
    });
  });

  describe('Method: getTicketRequestor', () => {
    describe('When zendesk service returns valid ticket requestor data', () => {
      const requestorGamertag = 'test-gamertag';
      beforeEach(() => {
        const requestorTestData = {
          'ticket.requester': { name: requestorGamertag },
        };
        mockZendeskService.getTicketRequestor$ = jasmine
          .createSpy('getTicketRequestor')
          .and.returnValue(of(requestorTestData));
        component.getTicketFields = jasmine.createSpy('getTicketFields');
      });
      it('should set component.gamertag to requestor name', () => {
        component.getTicketRequestorGamertag();

        expect(component.gamertag).toEqual(requestorGamertag);
      });
      it('should call component.getTicketFields', () => {
        component.getTicketRequestorGamertag();

        expect(component.getTicketFields).toHaveBeenCalled();
      });
    });
  });

  describe('Method: getTicketFields', () => {
    describe('When zendesk service returns valid ticket fields data', () => {
      const ticketGameTitleField = 'test-game-title-field';
      beforeEach(() => {
        const ticketFieldsTestData = {
          ticketFields: [{ label: 'Forza Title', name: ticketGameTitleField }],
        };
        mockZendeskService.getTicketFields$ = jasmine
          .createSpy('getTicketFields')
          .and.returnValue(of(ticketFieldsTestData));
        component.getTitleData = jasmine.createSpy('getTicketFields');
      });

      it('should call component.getTitleData with correct field info', () => {
        component.getTicketFields();

        expect(component.getTitleData).toHaveBeenCalledWith(ticketGameTitleField);
      });
    });
  });

  describe('Method: getTitleData', () => {
    const getTitleDataParam = 'testCustomField';
    beforeEach(() => {
      const customFieldData =
        '{ "ticket.customField:' + getTitleDataParam + '": "fake-something" }';
      mockZendeskService.getTicketCustomField$ = jasmine
        .createSpy('getTicketCustomField')
        .and.returnValue(of(JSON.parse(customFieldData)));
    });

    it('should call zendesk service getTicketCustomField() with input parameter', () => {
      component.getTitleData(getTitleDataParam);

      expect(mockZendeskService.getTicketCustomField$).toHaveBeenCalledWith(getTitleDataParam);
    });

    describe('When zendeskservice getTicketCustomField() returns forza_street as title', () => {
      beforeEach(() => {
        const streetCustomFieldData =
          '{ "ticket.customField:' + getTitleDataParam + '": "forza_street" }';
        mockZendeskService.getTicketCustomField$ = jasmine
          .createSpy('getTicketCustomField')
          .and.returnValue(of(JSON.parse(streetCustomFieldData)));
      });

      it('should set component.gameTitle to Gravity', () => {
        component.getTitleData(getTitleDataParam);

        expect(component.gameTitle).toEqual('Gravity');
      });
    });

    describe('When zendeskservice getTicketCustomField() returns forza_horizon_4 as title', () => {
      beforeEach(() => {
        const horzion4CustomFieldData =
          '{ "ticket.customField:' + getTitleDataParam + '": "forza_horizon_4" }';
        mockZendeskService.getTicketCustomField$ = jasmine
          .createSpy('getTicketCustomField')
          .and.returnValue(of(JSON.parse(horzion4CustomFieldData)));
      });

      it('should set component.gameTitle to Sunrise', () => {
        component.getTitleData(getTitleDataParam);

        expect(component.gameTitle).toEqual('Sunrise');
      });
    });

    describe('When zendeskservice getTicketCustomField() returns forza_motorsport_7 as title', () => {
      beforeEach(() => {
        const horzion4CustomFieldData =
          '{ "ticket.customField:' + getTitleDataParam + '": "forza_motorsport_7" }';
        mockZendeskService.getTicketCustomField$ = jasmine
          .createSpy('getTicketCustomField')
          .and.returnValue(of(JSON.parse(horzion4CustomFieldData)));
      });

      it('should set component.gameTitle to Apollo', () => {
        component.getTitleData(getTitleDataParam);

        expect(component.gameTitle).toEqual('Apollo');
      });
    });

    describe('When zendeskservice getTicketCustomField() returns forza_horizon_3 as title', () => {
      beforeEach(() => {
        const horzion4CustomFieldData =
          '{ "ticket.customField:' + getTitleDataParam + '": "forza_horizon_3" }';
        mockZendeskService.getTicketCustomField$ = jasmine
          .createSpy('getTicketCustomField')
          .and.returnValue(of(JSON.parse(horzion4CustomFieldData)));
      });

      it('should set component.gameTitle to Opus', () => {
        component.getTitleData(getTitleDataParam);

        expect(component.gameTitle).toEqual('Opus');
      });
    });
  });

  describe('Method: goToInventory', () => {
    const gameTitle = GameTitleCodeName.Street;
    const xuid = 'test-xuid';
    beforeEach(() => {
      component.gameTitle = gameTitle;
      component.xuid = xuid;
    });

    it('expect zendeskService.goToApp to be called', () => {
      component.goToInventory();

      const expectedAppsection = `${gameTitle}/${xuid}`;
      expect(mockZendeskService.goToApp$).toHaveBeenCalledWith(
        'nav_bar',
        'forza-inventory-support',
        expectedAppsection,
      );
    });
  });
});
