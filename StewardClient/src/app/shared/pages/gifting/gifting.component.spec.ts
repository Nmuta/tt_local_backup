import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@environments/environment';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { UserState } from '@shared/state/user/user.state';

import { GiftingComponent } from './gifting.component';

describe('GiftingComponent', () => {
  let component: GiftingComponent;
  let fixture: ComponentFixture<GiftingComponent>;

  let mockStore: Store;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState]),
        ],
        declarations: [GiftingComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [...createMockMsalServices(), createMockLoggerService()],
      }).compileComponents();

      fixture = TestBed.createComponent(GiftingComponent);
      component = fixture.debugElement.componentInstance;

      mockStore = TestBed.inject(Store);
      mockStore.dispatch = jasmine.createSpy('dispatch');
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    describe('When environment is PROD', () => {
      beforeEach(() => {
        environment.production = true;
      });

      it('should set production navbarRouterLinks', () => {
        component.ngOnInit();

        expect(component.navbarRouterLinks?.length).toEqual(3);
      });
    });

    describe('When environment is DEV', () => {
      beforeEach(() => {
        environment.production = false;
      });

      it('should set production navbarRouterLinks', () => {
        component.ngOnInit();

        expect(component.navbarRouterLinks?.length).toEqual(5);
      });
    });
  });
});
