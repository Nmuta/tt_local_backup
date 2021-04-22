import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalService } from '@mocks/msal.service.mock';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { UserState } from '@shared/state/user/user.state';
import { SteelheadGiftHistoryComponent } from './steelhead-gift-history.component';
import { SteelheadGiftHistoryState } from './state/steelhead-gift-history.state';
import { SetSteelheadGiftHistoryMatTabIndex } from './state/steelhead-gift-history.state.actions';

describe('SteelheadGiftHistoryComponent', () => {
  let component: SteelheadGiftHistoryComponent;
  let fixture: ComponentFixture<SteelheadGiftHistoryComponent>;

  let mockStore: Store;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState, SteelheadGiftHistoryState]),
        ],
        declarations: [SteelheadGiftHistoryComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockMsalService(), createMockLoggerService()],
      }).compileComponents();

      fixture = TestBed.createComponent(SteelheadGiftHistoryComponent);
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

    it('should displatch SetSteelheadGiftHistoryMatTabIndex with correct data', () => {
      component.matTabSelectionChange(testIndex);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        new SetSteelheadGiftHistoryMatTabIndex(testIndex),
      );
    });
  });

  // describe('Method: onPlayerIdentitiesChange', () => {
  //   let event: IdentityResultAlphaBatch;
  //   beforeEach(() => {
  //     event = [
  //       {
  //         query: undefined,
  //         xuid: new BigNumber(123456789),
  //       },
  //     ];
  //   });
  //   it('should displatch SetSteelheadGiftHistorySelectedPlayerIdentities with correct data', () => {
  //     component.onPlayerIdentitiesChange(event);

  //     expect(mockStore.dispatch).toHaveBeenCalledWith(
  //       new SetSteelheadGiftHistorySelectedPlayerIdentities(event),
  //     );
  //   });
  // });
});
