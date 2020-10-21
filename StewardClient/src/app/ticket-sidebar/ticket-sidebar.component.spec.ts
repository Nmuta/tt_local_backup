// General
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject, getTestBed, tick, fakeAsync } from '@angular/core/testing';
import { Store, NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

// Helpers
import { createMockClipboard } from '@shared/helpers/clipboard';
import { createMockScrutineerDataParser } from '@shared/helpers/scrutineer-data-parser';

// Components
import { TicketSidebarComponent } from './ticket-sidebar.component';

import { createMockZendeskService, ZendeskService } from '@shared/services/zendesk';

// State
import { UserState } from '@shared/state/user/user.state';
import { createMockMsalService } from '@shared/mocks/msal.service.mock';
import { UserModel } from '@shared/models/user.model';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

describe('TicketSidebarComponent', () => {
  let fixture: ComponentFixture<TicketSidebarComponent>;
  let component: TicketSidebarComponent;
  let mockStore: Store;
  let mockRouter: Router;
  let mockZendeskService: ZendeskService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule, NgxsModule.forRoot([UserState])],
      declarations: [TicketSidebarComponent],
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

    fixture = TestBed.createComponent(TicketSidebarComponent);
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
});
