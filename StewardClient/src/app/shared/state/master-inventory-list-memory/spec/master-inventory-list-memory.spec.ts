import { TestBed, waitForAsync } from '@angular/core/testing';
import { Store, NgxsModule } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { createMockSunriseService, SunriseService } from '@services/sunrise';
import { MasterInventoryListMemoryState } from '../master-inventory-list-memory.state';
import {
  GetApolloMasterInventoryList,
  GetSteelheadMasterInventoryList,
  GetSunriseMasterInventoryList,
  GetWoodstockMasterInventoryList,
} from '../master-inventory-list-memory.actions';
import { EMPTY } from 'rxjs';
import { ApolloService, createMockApolloService } from '@services/apollo';
import { SteelheadItemsService } from '@services/api-v2/steelhead/items/steelhead-items.service';
import { createMockSteelheadItemsService } from '@services/api-v2/steelhead/items/steelhead-items.service.mock';
import { WoodstockItemsService } from '@services/api-v2/woodstock/items/woodstock-items.service';
import { createMockWoodstockItemsService } from '@services/api-v2/woodstock/items/woodstock-items.service.mock';

describe('State: MasterInventoryListMemoryState', () => {
  let service: MasterInventoryListMemoryState;
  let store: Store;

  let mockSunriseService: SunriseService;
  let mockApolloService: ApolloService;
  let mockSteelheadItemsService: SteelheadItemsService;
  let mockWoodstockService: WoodstockItemsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([MasterInventoryListMemoryState])],
      providers: [
        createMockSunriseService(),
        createMockApolloService(),
        createMockSteelheadItemsService(),
        createMockWoodstockItemsService(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    service = TestBed.inject(MasterInventoryListMemoryState);
    store = TestBed.inject(Store);

    mockSunriseService = TestBed.inject(SunriseService);
    mockApolloService = TestBed.inject(ApolloService);
    mockSteelheadItemsService = TestBed.inject(SteelheadItemsService);
    mockWoodstockService = TestBed.inject(WoodstockItemsService);

    store.reset({
      giftingMasterListMemory: {
        [GameTitleCodeName.FH4]: undefined,
      },
    });
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('[GetSunriseMasterInventoryList] Action', () => {
    describe('Master list already exists in state', () => {
      beforeEach(() => {
        store.reset({
          giftingMasterListMemory: {
            [GameTitleCodeName.FH4]: {},
          },
        });
      });

      it('should not request sunrise master list from api', () => {
        store
          .dispatch(new GetSunriseMasterInventoryList())
          .pipe(
            catchError(() => {
              expect(false).toBeTruthy();
              return EMPTY;
            }),
            tap(() => {
              expect(mockSunriseService.getMasterInventory$).not.toHaveBeenCalled();
            }),
          )
          .subscribe();
      });
    });

    describe('Master list does not exist in state', () => {
      it('should request sunrise master list from api', () => {
        store
          .dispatch(new GetSunriseMasterInventoryList())
          .pipe(
            catchError(() => {
              expect(false).toBeTruthy();
              return EMPTY;
            }),
            tap(() => {
              expect(mockSunriseService.getMasterInventory$).toHaveBeenCalled();
            }),
          )
          .subscribe();
      });
    });
  });

  describe('[GetApolloMasterInventoryList] Action', () => {
    describe('Master list already exists in state', () => {
      beforeEach(() => {
        store.reset({
          giftingMasterListMemory: {
            [GameTitleCodeName.FM7]: {},
          },
        });
      });

      it('should not request apollo master list from api', () => {
        store
          .dispatch(new GetApolloMasterInventoryList())
          .pipe(
            catchError(() => {
              expect(false).toBeTruthy();
              return EMPTY;
            }),
            tap(() => {
              expect(mockApolloService.getMasterInventory$).not.toHaveBeenCalled();
            }),
          )
          .subscribe();
      });
    });

    describe('Master list does not exist in state', () => {
      it('should request apollo master list from api', () => {
        store
          .dispatch(new GetApolloMasterInventoryList())
          .pipe(
            catchError(() => {
              expect(false).toBeTruthy();
              return EMPTY;
            }),
            tap(() => {
              expect(mockApolloService.getMasterInventory$).toHaveBeenCalled();
            }),
          )
          .subscribe();
      });
    });
  });

  describe('[GetSteelheadMasterInventory] Action', () => {
    describe('Master list already exists in state', () => {
      beforeEach(() => {
        store.reset({
          giftingMasterListMemory: {
            [GameTitleCodeName.FM8]: {},
          },
        });
      });

      it('should not request steelhead master list from api', () => {
        store
          .dispatch(new GetSteelheadMasterInventoryList())
          .pipe(
            catchError(() => {
              expect(false).toBeTruthy();
              return EMPTY;
            }),
            tap(() => {
              expect(mockSteelheadItemsService.getMasterInventory$).not.toHaveBeenCalled();
            }),
          )
          .subscribe();
      });
    });

    describe('Master list does not exist in state', () => {
      it('should request steelhead master list from api', () => {
        store
          .dispatch(new GetSteelheadMasterInventoryList())
          .pipe(
            catchError(() => {
              expect(false).toBeTruthy();
              return EMPTY;
            }),
            tap(() => {
              expect(mockSteelheadItemsService.getMasterInventory$).toHaveBeenCalled();
            }),
          )
          .subscribe();
      });
    });

    describe('[GetWoodstockMasterInventory] Action', () => {
      describe('Master list already exists in state', () => {
        beforeEach(() => {
          store.reset({
            giftingMasterListMemory: {
              [GameTitleCodeName.FH5]: {},
            },
          });
        });

        it('should not request woodstock master list from api', () => {
          store
            .dispatch(new GetWoodstockMasterInventoryList())
            .pipe(
              catchError(() => {
                expect(false).toBeTruthy();
                return EMPTY;
              }),
              tap(() => {
                expect(mockWoodstockService.getMasterInventory$).not.toHaveBeenCalled();
              }),
            )
            .subscribe();
        });
      });

      describe('Master list does not exist in state', () => {
        it('should request woodstock master list from api', () => {
          store
            .dispatch(new GetWoodstockMasterInventoryList())
            .pipe(
              catchError(() => {
                expect(false).toBeTruthy();
                return EMPTY;
              }),
              tap(() => {
                expect(mockWoodstockService.getMasterInventory$).toHaveBeenCalled();
              }),
            )
            .subscribe();
        });
      });
    });
  });
});
