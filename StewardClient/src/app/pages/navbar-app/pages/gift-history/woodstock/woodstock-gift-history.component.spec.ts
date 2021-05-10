import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalService } from '@mocks/msal.service.mock';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { UserState } from '@shared/state/user/user.state';
import { WoodstockGiftHistoryState } from './state/woodstock-gift-history.state';
import { SetWoodstockGiftHistoryMatTabIndex } from './state/woodstock-gift-history.state.actions';
import { WoodstockGiftHistoryComponent } from './woodstock-gift-history.component';

describe('WoodstockGiftHistoryComponent', () => {
  let component: WoodstockGiftHistoryComponent;
  let fixture: ComponentFixture<WoodstockGiftHistoryComponent>;

  let mockStore: Store;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState, WoodstockGiftHistoryState]),
        ],
        declarations: [WoodstockGiftHistoryComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockMsalService(), createMockLoggerService()],
      }).compileComponents();

      fixture = TestBed.createComponent(WoodstockGiftHistoryComponent);
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

    it('should displatch SetWoodstockGiftHistoryMatTabIndex with correct data', () => {
      component.matTabSelectionChange(testIndex);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        new SetWoodstockGiftHistoryMatTabIndex(testIndex),
      );
    });
  });

  // describe('Method: onPlayerIdentityChange', () => {
  //   let event: IdentityResultAlphaBatch;
  //   beforeEach(() => {
  //     event = [
  //       {
  //         query: undefined,
  //         xuid: new BigNumber(123456789),
  //       },
  //     ];
  //   });
  //   it('should displatch SetWoodstockGiftHistorySelectedPlayerIdentities with correct data', () => {
  //     component.onPlayerIdentityChange(event);

  //     expect(mockStore.dispatch).toHaveBeenCalledWith(
  //       new SetWoodstockGiftHistorySelectedPlayerIdentities(event),
  //     );
  //   });
  // });
});
