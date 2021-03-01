import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalService } from '@mocks/msal.service.mock';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { UserState } from '@shared/state/user/user.state';
import { SunriseGiftHistoryState } from './state/sunrise-gift-history.state';
import {
  SetSunriseGiftHistoryMatTabIndex,
  SetSunriseGiftHistorySelectedPlayerIdentities,
} from './state/sunrise-gift-history.state.actions';
import { SunriseGiftHistoryComponent } from './sunrise-gift-history.component';

describe('SunriseGiftHistoryComponent', () => {
  let component: SunriseGiftHistoryComponent;
  let fixture: ComponentFixture<SunriseGiftHistoryComponent>;

  let mockStore: Store;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState, SunriseGiftHistoryState]),
        ],
        declarations: [SunriseGiftHistoryComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockMsalService(), createMockLoggerService()],
      }).compileComponents();

      fixture = TestBed.createComponent(SunriseGiftHistoryComponent);
      component = fixture.debugElement.componentInstance;

      mockStore = TestBed.inject(Store);
      mockStore.dispatch = jasmine.createSpy('dispatch');
    }),
  );
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: matTabSelectionChange', () => {
    const testIndex: number = 1;

    it('should displatch SetSunriseGiftHistoryMatTabIndex with correct data', () => {
      component.matTabSelectionChange(testIndex);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        new SetSunriseGiftHistoryMatTabIndex(testIndex),
      );
    });
  });

  describe('Method: onPlayerIdentitiesChange', () => {
    let event: IdentityResultAlphaBatch;
    beforeEach(() => {
      event = [
        {
          query: undefined,
          xuid: BigInt(123456789),
        },
      ];
    });
    it('should displatch SetSunriseGiftHistorySelectedPlayerIdentities with correct data', () => {
      component.onPlayerIdentitiesChange(event);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        new SetSunriseGiftHistorySelectedPlayerIdentities(event),
      );
    });
  });
});
