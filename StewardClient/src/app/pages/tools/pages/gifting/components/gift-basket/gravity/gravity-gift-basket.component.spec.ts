import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GravityGiftBasketComponent } from './gravity-gift-basket.component';
import { GravityMasterInventory } from '@models/gravity/gravity-master-inventory.model';
import { of, throwError } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { GravityService } from '@services/gravity';
import { GetGravityMasterInventoryList } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.actions';
import { SetGravityGiftBasket } from '@tools-app/pages/gifting/gravity/state/gravity-gifting.state.actions';
import faker from '@faker-js/faker';

describe('GravityGiftBasketComponent', () => {
  let fixture: ComponentFixture<GravityGiftBasketComponent>;
  let component: GravityGiftBasketComponent;

  const formBuilder: FormBuilder = new FormBuilder();
  let mockStore: Store;
  let mockGravityService: GravityService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot(),
        ReactiveFormsModule,
      ],
      declarations: [GravityGiftBasketComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [],
    }).compileComponents();

    const injector = getTestBed();
    mockStore = injector.inject(Store);
    mockGravityService = injector.inject(GravityService);

    fixture = TestBed.createComponent(GravityGiftBasketComponent);
    component = fixture.debugElement.componentInstance;

    mockStore.select = jasmine.createSpy('select').and.returnValue(of([]));
    mockStore.dispatch = jasmine.createSpy('dispatch').and.returnValue(of({}));
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    const previousGameSettingsId: string = 'test-previous-game-settings-id';
    const testMasterInventory: GravityMasterInventory = {
      creditRewards: [],
      repairKits: [],
      masteryKits: [],
      upgradeKits: [],
      cars: [],
      energyRefills: [],
    };

    beforeEach(() => {
      component.playerIdentities = [];
      mockStore.selectSnapshot = jasmine
        .createSpy('selectSnapshot')
        .and.returnValue({ [previousGameSettingsId]: testMasterInventory });

      mockGravityService.getPlayerDetailsByT10Id$ = jasmine.createSpy('getPlayerDetailsByT10Id');
    });

    describe('When newIdentitySelectedSubject$ emits a null t10Id', () => {
      it('should not call getPlayerDetailsByT10Id', () => {
        component.ngOnInit();
        component.newIdentitySelectedSubject$.next(null);

        expect(mockGravityService.getPlayerDetailsByT10Id$).not.toHaveBeenCalled();
      });
    });

    describe('When newIdentitySelectedSubject$ emits a empty string t10Id', () => {
      it('should not call getPlayerDetailsByT10Id', () => {
        component.ngOnInit();
        component.newIdentitySelectedSubject$.next('');

        expect(mockGravityService.getPlayerDetailsByT10Id$).not.toHaveBeenCalled();
      });
    });

    describe('When newIdentitySelectedSubject$ emits a valid t10Id', () => {
      const t10Id = 'fake-t10-id';

      describe('And getPlayerDetailsByT10Id throws error', () => {
        const error = { message: 'fake-error' };

        beforeEach(() => {
          mockGravityService.getPlayerDetailsByT10Id$ = jasmine
            .createSpy('getPlayerDetailsByT10Id')
            .and.returnValue(throwError(error));
        });

        it('should set loadError', () => {
          component.ngOnInit();
          component.newIdentitySelectedSubject$.next(t10Id);

          expect(component.isLoading).toBeFalsy();
          expect(component.loadError).toEqual(error);
        });
      });

      describe('And getPlayerDetailsByT10Id returns valid game settings', () => {
        const gameSettingsId = 'game-settings-id';

        beforeEach(() => {
          mockGravityService.getPlayerDetailsByT10Id$ = jasmine
            .createSpy('getPlayerDetailsByT10Id')
            .and.returnValue(of({ lastGameSettingsUsed: gameSettingsId }));
        });

        it('should set component.selectedGameSettingsId', () => {
          component.ngOnInit();
          component.newIdentitySelectedSubject$.next(t10Id);

          expect(component.selectedGameSettingsId).toEqual(gameSettingsId);
        });

        it('should call store.distach', () => {
          component.ngOnInit();
          component.newIdentitySelectedSubject$.next(t10Id);

          expect(mockStore.dispatch).toHaveBeenCalledWith(
            new GetGravityMasterInventoryList(gameSettingsId),
          );
        });

        describe('And GetGravityMasterInventoryList throws error', () => {
          const error = { message: 'fake-error' };

          beforeEach(() => {
            mockStore.dispatch = jasmine.createSpy('dispatch').and.returnValue(throwError(error));
          });

          it('should set loadError', () => {
            component.ngOnInit();
            component.newIdentitySelectedSubject$.next(t10Id);

            expect(component.isLoading).toBeFalsy();
            expect(component.loadError).toEqual(error);
          });
        });

        describe('And GetGravityMasterInventoryList returns valid master inventory', () => {
          beforeEach(() => {
            mockStore.dispatch = jasmine.createSpy('dispatch').and.returnValue(of({}));
            mockStore.selectSnapshot = jasmine
              .createSpy('selectSnapshot')
              .and.returnValue({ [gameSettingsId]: testMasterInventory });
            component.setStateGiftBasket = jasmine.createSpy('setStateGiftBasket');
          });

          it('should call mockStore.selectSnapshot', () => {
            component.ngOnInit();
            component.newIdentitySelectedSubject$.next(t10Id);

            expect(mockStore.selectSnapshot).toHaveBeenCalled();
          });

          it('should set component variables', () => {
            component.ngOnInit();
            component.newIdentitySelectedSubject$.next(t10Id);

            expect(component.isLoading).toBeFalsy();
            expect(component.masterInventory).toEqual(testMasterInventory);
          });

          it('should call component.setStateGiftBasket', () => {
            component.ngOnInit();
            component.newIdentitySelectedSubject$.next(t10Id);

            expect(component.setStateGiftBasket).toHaveBeenCalled();
          });
        });
      });
    });

    describe('When player identity is set', () => {
      const t10Id = 't10-id';
      beforeEach(() => {
        component.playerIdentities = [
          {
            query: { gamertag: null },
            xuid: new BigNumber(1234),
            t10Id: t10Id,
          },
        ];
        component.newIdentitySelectedSubject$.next = jasmine.createSpy(
          'newIdentitySelectedSubject$.next',
        );
      });

      it('should call newIdentitySelectedSubject$.next', () => {
        component.ngOnInit();

        expect(component.newIdentitySelectedSubject$.next).toHaveBeenCalledWith(t10Id);
      });
    });
  });

  describe('Method: ngOnChanges', () => {
    beforeEach(() => {
      component.newIdentitySelectedSubject$.next = jasmine.createSpy(
        'newIdentitySelectedSubject$.next',
      );
    });

    describe('When player identites is changed', () => {
      const changes: SimpleChanges = {
        playerIdentities: {
          previousValue: null,
          currentValue: null,
          firstChange: false,
          isFirstChange: () => {
            return false;
          },
        },
      };

      describe('and the identity is valid', () => {
        const t10Id = 't10-id';

        beforeEach(() => {
          component.playerIdentities = [
            {
              query: { gamertag: null },
              xuid: new BigNumber(1234),
              t10Id: t10Id,
            },
          ];
        });

        it('should call newIdentitySelectedSubject$.next', () => {
          component.ngOnChanges(changes);

          expect(component.newIdentitySelectedSubject$.next).toHaveBeenCalledWith(t10Id);
        });
      });

      describe('and the identity is null', () => {
        beforeEach(() => {
          component.playerIdentities = [];
        });

        it('should call newIdentitySelectedSubject$.next', () => {
          component.ngOnChanges(changes);

          expect(component.newIdentitySelectedSubject$.next).toHaveBeenCalledWith(null);
        });
      });
    });

    describe('When player identites is not changed', () => {
      const changes: SimpleChanges = {};

      it('should not call newIdentitySelectedSubject$.next', () => {
        component.ngOnChanges(changes);

        expect(component.newIdentitySelectedSubject$.next).not.toHaveBeenCalled();
      });
    });
  });

  describe('Method: generateGiftInventoryFromGiftBasket', () => {
    const giftReason: string = 'fake gift reason';
    const giftItem1Id = new BigNumber(faker.datatype.number());
    const giftItem2Id = new BigNumber(faker.datatype.number());
    const giftItem3Id = new BigNumber(faker.datatype.number());
    const giftItem4Id = new BigNumber(faker.datatype.number());
    const giftItem5Id = new BigNumber(faker.datatype.number());
    const giftItem6Id = new BigNumber(faker.datatype.number());

    beforeEach(() => {
      component.sendGiftForm = formBuilder.group({
        giftReason: [''],
      });
      component.sendGiftForm.controls['giftReason'].setValue(giftReason);
      component.giftBasket.data = [
        {
          id: giftItem1Id,
          description: faker.random.words(10),
          quantity: 0,
          itemType: 'creditRewards',
          edit: false,
          error: undefined,
        },
        {
          id: giftItem2Id,
          description: faker.random.words(10),
          quantity: 0,
          itemType: 'cars',
          edit: false,
          error: undefined,
        },
        {
          id: giftItem3Id,
          description: faker.random.words(10),
          quantity: 0,
          itemType: 'repairKits',
          edit: false,
          error: undefined,
        },
        {
          id: giftItem4Id,
          description: faker.random.words(10),
          quantity: 0,
          itemType: 'masteryKits',
          edit: false,
          error: undefined,
        },
        {
          id: giftItem5Id,
          description: faker.random.words(10),
          quantity: 0,
          itemType: 'upgradeKits',
          edit: false,
          error: undefined,
        },
        {
          id: giftItem6Id,
          description: faker.random.words(10),
          quantity: 0,
          itemType: 'energyRefills',
          edit: false,
          error: undefined,
        },
      ];
    });

    it('should set masterInventory', () => {
      const gift = component.generateGiftInventoryFromGiftBasket();

      expect(gift.giftReason).toEqual(giftReason);
      const apolloMasterInventory = gift.inventory as GravityMasterInventory;
      expect(apolloMasterInventory).not.toBeUndefined();

      expect(apolloMasterInventory.creditRewards.length).toEqual(1);
      expect(apolloMasterInventory.cars.length).toEqual(1);
      expect(apolloMasterInventory.repairKits.length).toEqual(1);
      expect(apolloMasterInventory.masteryKits.length).toEqual(1);
      expect(apolloMasterInventory.upgradeKits.length).toEqual(1);
      expect(apolloMasterInventory.energyRefills.length).toEqual(1);

      expect(apolloMasterInventory.creditRewards[0].id).toEqual(giftItem1Id);
      expect(apolloMasterInventory.cars[0].id).toEqual(giftItem2Id);
      expect(apolloMasterInventory.repairKits[0].id).toEqual(giftItem3Id);
      expect(apolloMasterInventory.masteryKits[0].id).toEqual(giftItem4Id);
      expect(apolloMasterInventory.upgradeKits[0].id).toEqual(giftItem5Id);
      expect(apolloMasterInventory.energyRefills[0].id).toEqual(giftItem6Id);
    });
  });

  describe('Method: sendGiftToPlayers', () => {
    beforeEach(() => {
      mockGravityService.postGiftPlayerUsingBackgroundTask$ = jasmine.createSpy(
        'postGiftPlayerUsingBackgroundTask',
      );
      component.playerIdentities = [
        {
          query: { t10Id: faker.datatype.uuid().toString() },
          xuid: new BigNumber(faker.datatype.number()),
        },
      ];
    });

    it('should call postGiftPlayerUsingBackgroundTask', () => {
      component.sendGiftToPlayers$({
        giftReason: faker.random.words(10),
        inventory: {
          creditRewards: [],
          cars: [],
          repairKits: [],
          masteryKits: [],
          upgradeKits: [],
          energyRefills: [],
        },
      });

      expect(mockGravityService.postGiftPlayerUsingBackgroundTask$).toHaveBeenCalled();
    });
  });

  describe('Method: setStateGiftBasket', () => {
    beforeEach(() => {
      component.setGiftBasketItemErrors = jasmine
        .createSpy('setGiftBasketItemErrors')
        .and.returnValue([]);
    });

    it('should call setGiftBasketItemErrors', () => {
      component.setStateGiftBasket([]);

      expect(component.setGiftBasketItemErrors).toHaveBeenCalled();
    });

    it('should call store.dispatch', () => {
      const input = [];
      component.setStateGiftBasket(input);

      expect(mockStore.dispatch).toHaveBeenCalledWith(new SetGravityGiftBasket(input));
    });
  });

  describe('Method: setGiftBasketItemErrors', () => {
    beforeEach(() => {
      component.masterInventory = {
        creditRewards: [{ id: new BigNumber(0), description: 'Credits', quantity: 0 }],
        cars: [{ id: new BigNumber(12345), description: 'Test car', quantity: 0 }],
        repairKits: [{ id: new BigNumber(12345), description: 'Test car', quantity: 0 }],
        masteryKits: [{ id: new BigNumber(12345), description: 'Test car', quantity: 0 }],
        upgradeKits: [{ id: new BigNumber(12345), description: 'Test car', quantity: 0 }],
        energyRefills: [{ id: new BigNumber(12345), description: 'Test car', quantity: 0 }],
      } as GravityMasterInventory;
    });

    describe('When credit reward exists', () => {
      it('should set item error to undefined', () => {
        const input = [
          {
            itemType: 'creditRewards',
            description: 'Credits',
            quantity: 200,
            id: new BigNumber(0),
            edit: false,
            error: undefined,
          },
        ];
        const response = component.setGiftBasketItemErrors(input);

        expect(response.length).toEqual(1);
        expect(response[0]).not.toBeUndefined();
        expect(response[0].error).toBeUndefined();
      });
    });

    describe('When credit reward does not exist', () => {
      it('should set item error', () => {
        const input = [
          {
            itemType: 'creditRewards',
            description: 'Bad Credits',
            quantity: 200,
            id: new BigNumber(-1),
            edit: false,
            error: undefined,
          },
        ];
        const response = component.setGiftBasketItemErrors(input);

        expect(response.length).toEqual(1);
        expect(response[0]).not.toBeUndefined();
        expect(response[0].restriction).toEqual('Item does not exist in the master inventory.');
      });
    });

    describe('When car reward', () => {
      it('should set item error to undefined', () => {
        const input = [
          {
            itemType: 'cars',
            description: 'Test Car',
            quantity: 200,
            id: new BigNumber(12345),
            edit: false,
            error: undefined,
          },
        ];
        const response = component.setGiftBasketItemErrors(input);

        expect(response.length).toEqual(1);
        expect(response[0]).not.toBeUndefined();
        expect(response[0].error).toBeUndefined();
      });
    });

    describe('When soft current reward is over 500,000,000', () => {
      it('should set item error ', () => {
        // Soft currency ID=0
        const input = [
          {
            itemType: 'creditRewards',
            description: 'Soft Currency',
            quantity: 500_000_001,
            id: new BigNumber(0),
            edit: false,
            error: undefined,
          },
        ];
        const response = component.setGiftBasketItemErrors(input);

        expect(response.length).toEqual(1);
        expect(response[0]).not.toBeUndefined();
        expect(response[0].restriction).toEqual('Soft Currency limit for a gift is 500,000,000.');
      });
    });

    describe('When soft current reward is under 500,000,000', () => {
      it('should set item error ', () => {
        // Soft currency ID=0
        const input = [
          {
            itemType: 'creditRewards',
            description: 'Soft Currency',
            quantity: 400_000_000,
            id: new BigNumber(0),
            edit: false,
            error: undefined,
          },
        ];
        const response = component.setGiftBasketItemErrors(input);

        expect(response.length).toEqual(1);
        expect(response[0]).not.toBeUndefined();
        expect(response[0].error).toBeUndefined();
      });
    });

    describe('When soft current reward is over 999,999,999', () => {
      it('should set item error ', () => {
        // Soft currency ID=0
        const input = [
          {
            itemType: 'creditRewards',
            description: 'Soft Currency',
            quantity: 1_000_000_000,
            id: new BigNumber(0),
            edit: false,
            error: undefined,
          },
        ];

        const response = component.setGiftBasketItemErrors(input);

        expect(response.length).toEqual(1);
        expect(response[0]).not.toBeUndefined();
        expect(response[0].restriction).toEqual('Soft Currency max is 999,999,999.');
      });
    });
  });
});
