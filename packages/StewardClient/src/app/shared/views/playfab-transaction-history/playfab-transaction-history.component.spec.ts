import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GameTitle } from '@models/enums';
import { of } from 'rxjs';
import { faker } from '@interceptors/fake-api/utility';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PipesModule } from '@shared/pipes/pipes.module';
import {
  PlayFabTransactionHistoryComponent,
  PlayFabTransactionHistoryServiceContract,
} from './playfab-transaction-history.component';
import { PlayFabTransaction } from '@services/api-v2/woodstock/playfab/player/transactions/woodstock-playfab-player-transactions.service';
import { toDateTime } from '@helpers/luxon';

describe('PlayFabTransactionHistoryComponent', () => {
  let component: PlayFabTransactionHistoryComponent;
  let fixture: ComponentFixture<PlayFabTransactionHistoryComponent>;

  const mockTransactionHistory: PlayFabTransaction[] = [
    {
      itemType: faker.datatype.string(),
      operations: [],
      operationType: faker.datatype.string(),
      purchaseDetails: null,
      redeemDetails: null,
      timestampUtc: toDateTime(faker.datatype.datetime()),
      transactionId: faker.datatype.string(),
      transferDetails: null,
    },
  ];
  const mockService: PlayFabTransactionHistoryServiceContract = {
    gameTitle: GameTitle.FH5,
    getPlayFabTransactionHistory$: () => of(mockTransactionHistory),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PipesModule],
      declarations: [PlayFabTransactionHistoryComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayFabTransactionHistoryComponent);
    component = fixture.debugElement.componentInstance;
    component.service = mockService;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnChanges', () => {
    describe('When service is null', () => {
      beforeEach(() => {
        component.service = null;
      });

      it('should throw error', () => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component.ngOnChanges({} as any);

          expect(false).toBeTruthy();
        } catch (e) {
          expect(true).toBeTruthy();
          expect(e.message).toEqual(
            'No service is defined for PlayFab transaction history component.',
          );
        }
      });
    });

    describe('When service is provided', () => {
      // Provided by default in the test component
      it('should not throw error', () => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component.ngOnChanges({} as any);

          expect(true).toBeTruthy();
        } catch (e) {
          expect(e).toEqual(null);
          expect(false).toBeTruthy();
        }
      });
    });
  });
});
