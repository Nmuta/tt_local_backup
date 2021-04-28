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
import faker from 'faker';

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
import { UserRole } from '@models/enums';
import { createMockLoggerService } from '@services/logger/logger.service.mock';

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
          createMockLoggerService(),
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
    const testProfile: UserModel = {
      emailAddress: 'test.email@microsoft.com',
      role: UserRole.LiveOpsAdmin,
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      objectId: `${faker.datatype.uuid()}`,
      liveOpsAdminSecondaryRole: undefined,
    };

    describe('When subscribing to profile returns a value', () => {
      beforeEach(() => {
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
});
