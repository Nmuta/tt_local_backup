import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalService } from '@mocks/msal.service.mock';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { UserState } from '@shared/state/user/user.state';
import { WoodstockGiftingState } from './state/woodstock-gifting.state';
import { SetWoodstockGiftingMatTabIndex } from './state/woodstock-gifting.state.actions';
import { WoodstockGiftingComponent } from './woodstock-gifting.component';

describe('WoodstockGiftingComponent', () => {
  let component: WoodstockGiftingComponent;
  let fixture: ComponentFixture<WoodstockGiftingComponent>;

  let mockStore: Store;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState, WoodstockGiftingState]),
        ],
        declarations: [WoodstockGiftingComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockMsalService(), createMockLoggerService()],
      }).compileComponents();

      fixture = TestBed.createComponent(WoodstockGiftingComponent);
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

    it('should displatch SetApolloGiftingMatTabIndex with correct data', () => {
      component.matTabSelectionChange(testIndex);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        new SetWoodstockGiftingMatTabIndex(testIndex),
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
  //   it('should displatch SetWoodstockGiftingSelectedPlayerIdentities with correct data', () => {
  //     component.onPlayerIdentitiesChange(event);

  //     expect(mockStore.dispatch).toHaveBeenCalledWith(
  //       new SetWoodstockGiftingSelectedPlayerIdentities(event),
  //     );
  //   });
  // });
});