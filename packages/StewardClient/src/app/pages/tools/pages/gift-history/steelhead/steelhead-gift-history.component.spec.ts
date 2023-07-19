import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { UserState } from '@shared/state/user/user.state';
import { SteelheadGiftHistoryComponent } from './steelhead-gift-history.component';
import { SteelheadGiftHistoryState } from './state/steelhead-gift-history.state';
import { SetSteelheadGiftHistoryMatTabIndex } from './state/steelhead-gift-history.state.actions';
import faker from '@faker-js/faker';
import { of } from 'rxjs';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';

describe('SteelheadGiftHistoryComponent', () => {
  let component: SteelheadGiftHistoryComponent;
  let fixture: ComponentFixture<SteelheadGiftHistoryComponent>;

  let mockStore: Store;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([UserState, SteelheadGiftHistoryState]),
      ],
      declarations: [SteelheadGiftHistoryComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [...createMockMsalServices(), createMockLoggerService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SteelheadGiftHistoryComponent);
    component = fixture.debugElement.componentInstance;

    mockStore = TestBed.inject(Store);
    mockStore.dispatch = jasmine.createSpy('dispatch');
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    describe('When selectedPlayerIdentities$ outputs a selection', () => {
      const gamertag = faker.random.word();

      beforeEach(() => {
        Object.defineProperty(component, 'selectedPlayerIdentities$', { writable: true });
        component.selectedPlayerIdentities$ = of([
          {
            query: null,
            gamertag: gamertag,
          },
        ] as IdentityResultAlphaBatch);
      });

      it('should set selected player', () => {
        component.ngOnInit();

        expect(component.selectedPlayer).not.toBeUndefined();
        expect(component.selectedPlayer).not.toBeNull();
        expect(component.selectedPlayer.gamertag).toEqual(gamertag);
      });
    });
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
