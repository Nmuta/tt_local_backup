import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { UserState } from '@shared/state/user/user.state';

import { GiftingBaseComponent } from './gifting.base.component';

describe('GiftingBaseComponent', () => {
  let component: GiftingBaseComponent<string>;
  let fixture: ComponentFixture<GiftingBaseComponent<string>>;

  let mockStore: Store;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([UserState]),
      ],
      declarations: [GiftingBaseComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [...createMockMsalServices(), createMockLoggerService()],
    }).compileComponents();

    fixture = TestBed.createComponent(GiftingBaseComponent as Type<GiftingBaseComponent<string>>);
    component = fixture.debugElement.componentInstance;

    mockStore = TestBed.inject(Store);
    mockStore.dispatch = jasmine.createSpy('dispatch');
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: isUsingPlayerIdentities', () => {
    describe('If matTabSelectedIndex is 0', () => {
      beforeEach(() => {
        component.matTabSelectedIndex = 0;
      });

      it('should return true', () => {
        const response = component.isUsingPlayerIdentities;

        expect(response).toBeTruthy();
      });
    });

    describe('If matTabSelectedIndex is 1', () => {
      beforeEach(() => {
        component.matTabSelectedIndex = 1;
      });

      it('should return false', () => {
        const response = component.isUsingPlayerIdentities;

        expect(response).toBeFalsy();
      });
    });
  });
});
