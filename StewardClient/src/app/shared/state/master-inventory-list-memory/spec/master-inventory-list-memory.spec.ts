import { TestBed, waitForAsync } from '@angular/core/testing';
import { Store, NgxsModule } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { createMockSunriseService, SunriseService } from '@services/sunrise';
import { MasterInventoryListMemoryState } from '../master-inventory-list-memory.state';
import { createMockGravityService, GravityService } from '@services/gravity';
import {
  GetApolloMasterInventoryList,
  GetGravityMasterInventoryList,
  GetSunriseMasterInventoryList,
} from '../master-inventory-list-memory.actions';
import { NEVER } from 'rxjs';
import { ApolloService, createMockApolloService } from '@services/apollo';

describe('State: MasterInventoryListMemoryState', () => {
  let service: MasterInventoryListMemoryState;
  let store: Store;

  let mockGravityService: GravityService;
  let mockSunriseService: SunriseService;
  let mockApolloService: ApolloService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, NgxsModule.forRoot([MasterInventoryListMemoryState])],
        providers: [
          createMockGravityService(),
          createMockSunriseService(),
          createMockApolloService(),
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();

      service = TestBed.inject(MasterInventoryListMemoryState);
      store = TestBed.inject(Store);

      mockGravityService = TestBed.inject(GravityService);
      mockSunriseService = TestBed.inject(SunriseService);
      mockApolloService = TestBed.inject(ApolloService);

      store.reset({
        giftingMasterListMemory: {
          [GameTitleCodeName.Street]: {},
          [GameTitleCodeName.FH4]: undefined,
        },
      });
    }),
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('[GetGravityMasterInventoryList] Action', () => {
    const gameSettingsId = 'abc-123';
    const badGameSettingsId = null;

    describe('If game settings id is not provided', () => {
      it('should throw error', () => {
        store
          .dispatch(new GetGravityMasterInventoryList(badGameSettingsId))
          .pipe(
            catchError(err => {
              expect(true).toBeTruthy();
              expect(err).toEqual(
                'Game settings ID is required to get a gravity master inventory list.',
              );
              return NEVER;
            }),
            tap(() => {
              expect(false).toBeTruthy();
            }),
          )
          .subscribe();
      });
    });

    describe('If game settings id is provided', () => {
      describe('and game settings master list already exists in state', () => {
        beforeEach(() => {
          store.reset({
            giftingMasterListMemory: {
              [GameTitleCodeName.Street]: { [gameSettingsId]: {} },
            },
          });
        });

        it('should not request gravity master list from api', () => {
          store
            .dispatch(new GetGravityMasterInventoryList(gameSettingsId))
            .pipe(
              catchError(() => {
                expect(false).toBeTruthy();
                return NEVER;
              }),
              tap(() => {
                expect(mockGravityService.getGameSettings).not.toHaveBeenCalledWith(gameSettingsId);
              }),
            )
            .subscribe();
        });
      });

      describe('and game settings master list does not exist in state', () => {
        it('should request gravity master list from api', () => {
          store
            .dispatch(new GetGravityMasterInventoryList(gameSettingsId))
            .pipe(
              catchError(() => {
                expect(false).toBeTruthy();
                return NEVER;
              }),
              tap(() => {
                expect(mockGravityService.getGameSettings).toHaveBeenCalledWith(gameSettingsId);
              }),
            )
            .subscribe();
        });
      });
    });
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
              return NEVER;
            }),
            tap(() => {
              expect(mockSunriseService.getMasterInventory).not.toHaveBeenCalled();
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
              return NEVER;
            }),
            tap(() => {
              expect(mockSunriseService.getMasterInventory).toHaveBeenCalled();
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
              return NEVER;
            }),
            tap(() => {
              expect(mockApolloService.getMasterInventory).not.toHaveBeenCalled();
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
              return NEVER;
            }),
            tap(() => {
              expect(mockApolloService.getMasterInventory).toHaveBeenCalled();
            }),
          )
          .subscribe();
      });
    });
  });
});
