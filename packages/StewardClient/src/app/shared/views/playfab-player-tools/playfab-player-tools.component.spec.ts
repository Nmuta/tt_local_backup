import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GameTitle } from '@models/enums';
import { of } from 'rxjs';
import { faker } from '@interceptors/fake-api/utility';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PipesModule } from '@shared/pipes/pipes.module';
import {
  PlayFabPlayerToolsComponent,
  PlayFabPlayerToolsServiceContract,
} from './playfab-player-tools.component';
import BigNumber from 'bignumber.js';
import { PlayFabProfile } from '@services/api-v2/woodstock/players/playfab/woodstock-players-playfab.service';
import { PlayFabInventoryItem, PlayFabTransaction } from '@models/playfab';
import { toDateTime } from '@helpers/luxon';

describe('PlayFabPlayerToolsComponent', () => {
  let component: PlayFabPlayerToolsComponent;
  let fixture: ComponentFixture<PlayFabPlayerToolsComponent>;

  const mockPlayerTools: PlayFabProfile = {
    master: faker.datatype.string(),
    title: faker.datatype.string(),
  };

  const mockInventory: PlayFabInventoryItem[] = [
    {
      amount: faker.datatype.number(),
      id: faker.datatype.uuid(),
      stackId: faker.datatype.string(),
      type: faker.datatype.string(),
      name: faker.datatype.string(),
    },
  ];

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

  const mockService: PlayFabPlayerToolsServiceContract = {
    gameTitle: GameTitle.FH5,
    getPlayFabProfile$: (_xuid: BigNumber) => of(mockPlayerTools),
    inventoryService: {
      gameTitle: GameTitle.FH5,
      getPlayFabCurrencyInventory$: () => of(mockInventory),
      addPlayFabItem$: () => of(null),
      removePlayFabItem$: () => of(null),
    },
    transactionHistoryService: {
      gameTitle: GameTitle.FH5,
      getPlayFabTransactionHistory$: () => of(mockTransactionHistory),
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PipesModule],
      declarations: [PlayFabPlayerToolsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayFabPlayerToolsComponent);
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
