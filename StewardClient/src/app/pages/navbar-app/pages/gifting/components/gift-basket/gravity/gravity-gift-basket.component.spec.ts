import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GravityGiftBasketComponent } from './gravity-gift-basket.component';
import { GravityMasterInventory } from '@models/gravity/gravity-master-inventory.model';
import { of } from 'rxjs';
import { GetGravityMasterInventoryList } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.actions';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { GravityService } from '@services/gravity';
import faker from 'faker';

describe('GravityGiftBasketComponent', () => {
  let fixture: ComponentFixture<GravityGiftBasketComponent>;
  let component: GravityGiftBasketComponent;

  const formBuilder: FormBuilder = new FormBuilder();
  let mockStore: Store;
  let mockGravityService: GravityService;

  beforeEach(
    waitForAsync(() => {
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
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnChanges', () => {
    const previousGameSettingsId: string = 'test-previous-game-settings-id';
    const playerInventory = {
      xuid: BigInt(faker.random.number()),
      t10Id: faker.random.uuid().toString(),
      previousGameSettingsId: previousGameSettingsId,
      currentExternalProfileId: null,
      cars: [],
      masteryKits: [],
      upgradeKits: [],
      repairKits: [],
      packs: [],
      currencies: [],
      energyRefills: [],
    };
    const testMasterInventory: GravityMasterInventory = {
      creditRewards: [],
      repairKits: [],
      masteryKits: [],
      upgradeKits: [],
      cars: [],
      energyRefills: [],
    };

    beforeEach(() => {
      component.playerInventory = playerInventory;

      mockStore.dispatch = jasmine.createSpy('dispatch').and.returnValue(of({}));
      mockStore.selectSnapshot = jasmine
        .createSpy('selectSnapshot')
        .and.returnValue({ [previousGameSettingsId]: testMasterInventory });
    });

    describe('When changes include a valid playerInventory object', () => {
      let changes: Partial<SimpleChanges>;
      beforeEach(() => {
        changes = {
          playerInventory: {
            currentValue: playerInventory,
            previousValue: {},
            firstChange: true,
            isFirstChange: () => {
              return true;
            },
          },
        };
      });

      it('should dispatch GetGravityMasterInventoryList action', () => {
        component.ngOnChanges(changes);

        expect(mockStore.dispatch).toHaveBeenCalledWith(
          new GetGravityMasterInventoryList(previousGameSettingsId),
        );
      });

      it('should set masterInventory when dispatch is finished', () => {
        component.ngOnChanges(changes);

        expect(component.masterInventory).not.toBeUndefined();
        expect(component.masterInventory).not.toBeNull();
        expect(component.masterInventory).toEqual(testMasterInventory);
      });
    });

    describe('When changes includes a null playerInventory object', () => {
      let changes: Partial<SimpleChanges>;
      beforeEach(() => {
        changes = {
          testProperty: {
            currentValue: {},
            previousValue: {},
            firstChange: true,
            isFirstChange: () => {
              return true;
            },
          },
        };
      });

      it('should not dispatch GetGravityMasterInventoryList action', () => {
        component.ngOnChanges(changes);

        expect(mockStore.dispatch).not.toHaveBeenCalled();
      });

      it('should set masterInventory to undefined', () => {
        component.ngOnChanges(changes);

        expect(component.masterInventory).toBeUndefined();
      });
    });
  });

  describe('Method: generateGiftInventoryFromGiftBasket', () => {
    const giftReason: string = 'fake gift reason';
    const giftItem1Id = BigInt(faker.random.number());
    const giftItem2Id = BigInt(faker.random.number());
    const giftItem3Id = BigInt(faker.random.number());
    const giftItem4Id = BigInt(faker.random.number());
    const giftItem5Id = BigInt(faker.random.number());
    const giftItem6Id = BigInt(faker.random.number());

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
        },
        {
          id: giftItem2Id,
          description: faker.random.words(10),
          quantity: 0,
          itemType: 'cars',
          edit: false,
        },
        {
          id: giftItem3Id,
          description: faker.random.words(10),
          quantity: 0,
          itemType: 'repairKits',
          edit: false,
        },
        {
          id: giftItem4Id,
          description: faker.random.words(10),
          quantity: 0,
          itemType: 'masteryKits',
          edit: false,
        },
        {
          id: giftItem5Id,
          description: faker.random.words(10),
          quantity: 0,
          itemType: 'upgradeKits',
          edit: false,
        },
        {
          id: giftItem6Id,
          description: faker.random.words(10),
          quantity: 0,
          itemType: 'energyRefills',
          edit: false,
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
      mockGravityService.postGiftPlayerUsingBackgroundTask = jasmine.createSpy(
        'postGiftPlayerUsingBackgroundTask',
      );
      component.playerIdentities = [
        {
          query: { t10Id: faker.random.uuid().toString() },
          xuid: BigInt(faker.random.number()),
        },
      ];
    });

    it('should call postGiftPlayerUsingBackgroundTask', () => {
      component.sendGiftToPlayers({
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

      expect(mockGravityService.postGiftPlayerUsingBackgroundTask).toHaveBeenCalled();
    });
  });
});
