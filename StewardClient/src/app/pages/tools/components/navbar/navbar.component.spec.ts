import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import faker from '@faker-js/faker';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { NgxsModule } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { createMockWindowService } from '@services/window';
import { createMockZendeskService, ZendeskService } from '@services/zendesk';
import { NotificationsService } from '@shared/hubs/notifications.service';
import { createMockNotificationsService } from '@shared/hubs/notifications.service.mock';
import {
  UserSettingsState,
  UserSettingsStateModel,
} from '@shared/state/user-settings/user-settings.state';
import { UserState } from '@shared/state/user/user.state';
import { of, Subject } from 'rxjs';
import { BackgroundJob } from '@models/background-job';

import { NavbarComponent } from './navbar.component';

describe('ToolsNavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  let mockNotificationsService: NotificationsService;
  let mockZendeskService: ZendeskService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([UserState, UserSettingsState]),
      ],
      declarations: [NavbarComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        createMockWindowService(),
        ...createMockMsalServices(),
        createMockZendeskService(),
        createMockLoggerService(),
        createMockNotificationsService(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;

    mockZendeskService = TestBed.inject(ZendeskService);
    Object.defineProperty(mockZendeskService, 'inZendesk$', { value: of(false) });

    mockNotificationsService = TestBed.inject(NotificationsService);
    mockNotificationsService.initialize = jasmine.createSpy('initialize');

    Object.defineProperty(component, 'profile$', { writable: true });
    component.profile$ = of();

    Object.defineProperty(component, 'settings$', { writable: true });
    component.settings$ = of();

    mockNotificationsService.notifications$ = new Subject<BackgroundJob<unknown>[]>();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    it('should call notificationsService.initialize()', () => {
      component.ngOnInit();

      expect(mockNotificationsService.initialize).toHaveBeenCalled();
    });

    describe('When profile$ provides a value', () => {
      const role = UserRole.LiveOpsAdmin;
      beforeEach(() => {
        component.role = null;
        component.standardTools = null;
        component.profile$ = of({
          emailAddress: faker.internet.email(),
          role: role,
          name: faker.random.word(),
          objectId: faker.datatype.uuid(),
        } as UserModel);
      });

      it('should set role', () => {
        component.ngOnInit();

        expect(component.role).toEqual(role);
      });

      it('should set standardTools', () => {
        component.ngOnInit();

        expect(component.standardTools).not.toBeNull();
      });
    });

    describe('When settings$ provides a value', () => {
      beforeEach(() => {
        component.listedTools = [];
        component.settings$ = of({
          enableFakeApi: false,
          enableStagingApi: false,
          appVersion: undefined,
          navbarTools: { 'user-details': 1, ugc: 2, gifting: 3, 'ban-review': 4 },
          apolloEndpointKey: undefined,
          sunriseEndpointKey: undefined,
          woodstockEndpointKey: undefined,
          steelheadEndpointKey: undefined,
          showAppUpdatePopup: true,
        } as UserSettingsStateModel);
      });

      it('should set listedTools', () => {
        component.ngOnInit();

        expect(component.listedTools.length).toEqual(4);
        expect(component.listedTools[0].tool).toEqual('user-details');
        expect(component.listedTools[1].tool).toEqual('ugc');
        expect(component.listedTools[2].tool).toEqual('gifting');
        expect(component.listedTools[3].tool).toEqual('ban-review');
      });
    });
  });
});
