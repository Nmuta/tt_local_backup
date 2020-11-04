// General
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed,
  inject,
  getTestBed,
  tick,
  fakeAsync,
} from '@angular/core/testing';
import { Store, NgxsModule } from '@ngxs/store';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

// Helpers
import { createMockClipboard, Clipboard } from '@shared/helpers/clipboard';
import { createMockScrutineerDataParser } from '@shared/helpers/scrutineer-data-parser';

// Components
import { TicketAppComponent } from './ticket-app.component';

import {
  createMockZendeskService,
  ZendeskService,
} from '@shared/services/zendesk';

// State
import { UserState } from '@shared/state/user/user.state';
import { createMockMsalService } from '@shared/mocks/msal.service.mock';
import { UserModel } from '@shared/models/user.model';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

describe('TicketAppComponent', () => {
  let fixture: ComponentFixture<TicketAppComponent>;
  let component: TicketAppComponent;
  let mockStore: Store;
  let mockRouter: Router;
  let mockZendeskService: ZendeskService;
  let mockClipboard: Clipboard;

  beforeEach(async(() => {
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
    mockStore = injector.get(Store);
    mockRouter = injector.get(Router);
    mockZendeskService = injector.get(ZendeskService);
    mockClipboard = injector.get(Clipboard);

    fixture = TestBed.createComponent(TicketAppComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    const testProfile: UserModel = { emailAddress: 'test.email@microsoft.com' };
    describe('When subscribing to profile returns a value', () => {
      beforeEach(() => {
        component.getTicketRequestor = jasmine.createSpy('getTicketRequestor');
        mockRouter.navigate = jasmine.createSpy('navigate');
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

      describe('If profile is invalid', () => {
        beforeEach(() => {
          component.profile$ = of(null);
        });
        it('Should call router.navigate correctly', () => {
          component.ngOnInit();
          expect(mockRouter.navigate).toHaveBeenCalledWith([`/auth`], {
            queryParams: { from: 'ticket-sidebar' },
          });
        });
      });
      describe('If profile is valid', () => {
        beforeEach(() => {
          component.profile$ = of(testProfile);
        });
        it('Should call getTicketRequestor', () => {
          component.ngOnInit();
          expect(component.getTicketRequestor).toHaveBeenCalled();
        });
      });
    });
    describe('If subscribing to profile times out', () => {
      const delayTime = 20000;
      beforeEach(() => {
        mockRouter.navigate = jasmine.createSpy('navigate');
        Object.defineProperty(component, 'profile$', { writable: true });
        component.profile$ = of(testProfile).pipe(delay(delayTime));
      });
      it('Should set loading to false', fakeAsync(() => {
        component.ngOnInit();
        tick(delayTime);
        expect(component.loading).toBeFalsy();
      }));
      it('Should call router.navigate correctly', fakeAsync(() => {
        component.ngOnInit();
        tick(delayTime);
        expect(mockRouter.navigate).toHaveBeenCalledWith([`/auth`], {
          queryParams: { from: 'ticket-sidebar' },
        });
      }));
    });
  });
  describe('Method: ngAfterViewInit', () => {
    beforeEach(() => {
      mockZendeskService.resize = jasmine.createSpy('resize');
    });

    it('Should call zendeskService.resize correctly', () => {
      component.ngAfterViewInit();
      expect(mockZendeskService.resize).toHaveBeenCalledWith('100%', '500px');
    });
  });

  describe('Method: getTicketRequestor', () => {
    describe('When zendesk service returns valid ticket requestor data', () => {
      var requestorGamertag = 'test-gamertag';
      beforeEach(() => {
        const requestorTestData = {
          'ticket.requester': { name: requestorGamertag },
        };
        mockZendeskService.getTicketRequestor = jasmine
          .createSpy('getTicketRequestor')
          .and.returnValue(of(requestorTestData));
        component.getTicketFields = jasmine.createSpy('getTicketFields');
      });
      it('should set component.gamertag to requestor name', () => {
        component.getTicketRequestor();

        expect(component.gamerTag).toEqual(requestorGamertag);
      });
      it('should call component.getTicketFields', () => {
        component.getTicketRequestor();

        expect(component.getTicketFields).toHaveBeenCalled();
      });
    });
  });

  describe('Method: getTicketFields', () => {
    describe('When zendesk service returns valid ticket fields data', () => {
      var ticketGameTitleField = 'test-game-title-field';
      beforeEach(() => {
        const ticketFieldsTestData = {
          ticketFields: [{ label: 'Forza Title', name: ticketGameTitleField }],
        };
        mockZendeskService.getTicketFields = jasmine
          .createSpy('getTicketFields')
          .and.returnValue(of(ticketFieldsTestData));
        component.getTitleData = jasmine.createSpy('getTicketFields');
      });

      it('should call component.getTitleData with correct field info', () => {
        component.getTicketFields();

        expect(component.getTitleData).toHaveBeenCalledWith(
          ticketGameTitleField
        );
      });
    });
  });

  describe('Method: getTitleData', () => {
    var getTitleDataParam = 'testCustomField';
    beforeEach(() => {
      var customFieldData =
        '{ "ticket.customField:' + getTitleDataParam + '": "fake-something" }';
      mockZendeskService.getTicketCustomField = jasmine
        .createSpy('getTicketCustomField')
        .and.returnValue(of(JSON.parse(customFieldData)));
      component.getPlayerData = jasmine.createSpy('getPlayerData');
    });

    it('should call zendesk service getTicketCustomField() with input parameter', () => {
      component.getTitleData(getTitleDataParam);

      expect(mockZendeskService.getTicketCustomField).toHaveBeenCalledWith(
        getTitleDataParam
      );
    });

    describe('When zendeskservice getTicketCustomField() returns forza_street as title', () => {
      beforeEach(() => {
        var streetCustomFieldData =
          '{ "ticket.customField:' + getTitleDataParam + '": "forza_street" }';
        mockZendeskService.getTicketCustomField = jasmine
          .createSpy('getTicketCustomField')
          .and.returnValue(of(JSON.parse(streetCustomFieldData)));
      });

      it('should set component.title to Gravity', () => {
        component.getTitleData(getTitleDataParam);

        expect(component.title).toEqual('Gravity');
      });

      it('should call component.getPlayerData', () => {
        component.getTitleData(getTitleDataParam);

        expect(component.getPlayerData).toHaveBeenCalled();
      });
    });

    describe('When zendeskservice getTicketCustomField() returns forza_horizon_4 as title', () => {
      beforeEach(() => {
        var horzion4CustomFieldData =
          '{ "ticket.customField:' +
          getTitleDataParam +
          '": "forza_horizon_4" }';
        mockZendeskService.getTicketCustomField = jasmine
          .createSpy('getTicketCustomField')
          .and.returnValue(of(JSON.parse(horzion4CustomFieldData)));
      });

      it('should set component.title to Sunrise', () => {
        component.getTitleData(getTitleDataParam);

        expect(component.title).toEqual('Sunrise');
      });

      it('should call component.getPlayerData', () => {
        component.getTitleData(getTitleDataParam);

        expect(component.getPlayerData).toHaveBeenCalled();
      });
    });

    describe('When zendeskservice getTicketCustomField() returns forza_motorsport_7 as title', () => {
      beforeEach(() => {
        var horzion4CustomFieldData =
          '{ "ticket.customField:' +
          getTitleDataParam +
          '": "forza_motorsport_7" }';
        mockZendeskService.getTicketCustomField = jasmine
          .createSpy('getTicketCustomField')
          .and.returnValue(of(JSON.parse(horzion4CustomFieldData)));
      });

      it('should set component.title to Apollo', () => {
        component.getTitleData(getTitleDataParam);

        expect(component.title).toEqual('Apollo');
      });

      it('should call component.getPlayerData', () => {
        component.getTitleData(getTitleDataParam);

        expect(component.getPlayerData).toHaveBeenCalled();
      });
    });

    describe('When zendeskservice getTicketCustomField() returns forza_horizon_3 as title', () => {
      beforeEach(() => {
        var horzion4CustomFieldData =
          '{ "ticket.customField:' +
          getTitleDataParam +
          '": "forza_horizon_3" }';
        mockZendeskService.getTicketCustomField = jasmine
          .createSpy('getTicketCustomField')
          .and.returnValue(of(JSON.parse(horzion4CustomFieldData)));
      });

      it('should set component.title to Opus', () => {
        component.getTitleData(getTitleDataParam);

        expect(component.title).toEqual('Opus');
      });

      it('should call component.getPlayerData', () => {
        component.getTitleData(getTitleDataParam);

        expect(component.getPlayerData).toHaveBeenCalled();
      });
    });
  });

  describe('Method: goToInventory', () => {
    var title = 'test-title';
    var xuid = 'test-xuid';
    beforeEach(() => {
      component.title = title;
      component.player = { xuid: xuid };
      mockZendeskService.goToApp = jasmine.createSpy('goToApp');
    });

    it('expect zendeskService.goToApp to be called', () => {
      component.goToInventory();

      let expectedAppsection = `${title}/${xuid}`;
      expect(mockZendeskService.goToApp).toHaveBeenCalledWith(
        'nav_bar',
        'forza-inventory-support',
        expectedAppsection
      );
    });
  });

  describe('Method: goToInventory', () => {
    var testParam = 'test-param';
    beforeEach(() => {
      mockClipboard.copyMessage = jasmine.createSpy('copyMessage');
    });

    it('expect mockClipboard.copyMessage to be called', () => {
      component.copyToClipboard(testParam);

      expect(mockClipboard.copyMessage).toHaveBeenCalledWith(testParam);
    });
  });
});
