import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SunriseGiftBasketComponent } from './sunrise-gift-basket.component';
import { GetSunriseMasterInventoryList } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.actions';
import { of } from 'rxjs';
import { SunriseMasterInventory } from '@models/sunrise/sunrise-master-inventory.model';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SunriseService } from '@services/sunrise';
import { SetSunriseGiftBasket } from '@shared/pages/gifting/sunrise/state/sunrise-gifting.state.actions';
import faker from 'faker';

describe('SunriseGiftBasketComponent', () => {
  let fixture: ComponentFixture<SunriseGiftBasketComponent>;
  let component: SunriseGiftBasketComponent;

  const formBuilder: FormBuilder = new FormBuilder();
  let mockStore: Store;
  let mockSunriseService: SunriseService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot(),
          ReactiveFormsModule,
        ],
        declarations: [SunriseGiftBasketComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
      }).compileComponents();

      const injector = getTestBed();
      mockStore = injector.inject(Store);
      mockSunriseService = injector.inject(SunriseService);

      fixture = TestBed.createComponent(SunriseGiftBasketComponent);
      component = fixture.debugElement.componentInstance;

      mockStore.select = jasmine.createSpy('select').and.returnValue(of([]));
      mockStore.dispatch = jasmine.createSpy('dispatch').and.returnValue(of({}));
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    const testMasterInventory: SunriseMasterInventory = {
      cars: [],
      vanityItems: [],
      carHorns: [],
      quickChatLines: [],
      creditRewards: [],
      emotes: [],
    };
    beforeEach(() => {
      mockStore.dispatch = jasmine.createSpy('dispatch').and.returnValue(of({}));
      mockStore.selectSnapshot = jasmine
        .createSpy('selectSnapshot')
        .and.returnValue(testMasterInventory);
    });

    it('should dispatch GetSunriseMasterInventoryList action', () => {
      component.ngOnInit();

      expect(mockStore.dispatch).toHaveBeenCalledWith(new GetSunriseMasterInventoryList());
    });

    it('should set masterInventory when dispatch is finished', () => {
      component.ngOnInit();

      expect(component.masterInventory).not.toBeUndefined();
      expect(component.masterInventory).not.toBeNull();
      expect(component.masterInventory).toEqual(testMasterInventory);
    });
  });

  describe('Method: generateGiftInventoryFromGiftBasket', () => {
    const giftReason: string = 'fake gift reason';
    const giftItem1Id = new BigNumber(faker.random.number());
    const giftItem2Id = new BigNumber(faker.random.number());
    const giftItem3Id = new BigNumber(faker.random.number());
    const giftItem4Id = new BigNumber(faker.random.number());
    const giftItem5Id = new BigNumber(faker.random.number());
    const giftItem6Id = new BigNumber(faker.random.number());

    beforeEach(() => {
      component.sendGiftForm = formBuilder.group({
        giftReason: [''],
      });
      component.sendGiftForm.controls['giftReason'].setValue(giftReason);
      component.giftBasket.data = [
        {
          id: giftItem1Id,
          description: faker.random.words(10),
          quantity: faker.random.number(),
          itemType: 'creditRewards',
          edit: false,
          error: undefined,
        },
        {
          id: giftItem2Id,
          description: faker.random.words(10),
          quantity: faker.random.number(),
          itemType: 'cars',
          edit: false,
          error: undefined,
        },
        {
          id: giftItem3Id,
          description: faker.random.words(10),
          quantity: faker.random.number(),
          itemType: 'vanityItems',
          edit: false,
          error: undefined,
        },
        {
          id: giftItem4Id,
          description: faker.random.words(10),
          quantity: faker.random.number(),
          itemType: 'carHorns',
          edit: false,
          error: undefined,
        },
        {
          id: giftItem5Id,
          description: faker.random.words(10),
          quantity: faker.random.number(),
          itemType: 'quickChatLines',
          edit: false,
          error: undefined,
        },
        {
          id: giftItem6Id,
          description: faker.random.words(10),
          quantity: faker.random.number(),
          itemType: 'emotes',
          edit: false,
          error: undefined,
        },
      ];
    });

    it('should set masterInventory', () => {
      const gift = component.generateGiftInventoryFromGiftBasket();

      expect(gift.giftReason).toEqual(giftReason);
      const apolloMasterInventory = gift.inventory as SunriseMasterInventory;
      expect(apolloMasterInventory).not.toBeUndefined();

      expect(apolloMasterInventory.creditRewards.length).toEqual(1);
      expect(apolloMasterInventory.cars.length).toEqual(1);
      expect(apolloMasterInventory.vanityItems.length).toEqual(1);
      expect(apolloMasterInventory.carHorns.length).toEqual(1);
      expect(apolloMasterInventory.quickChatLines.length).toEqual(1);
      expect(apolloMasterInventory.emotes.length).toEqual(1);

      expect(apolloMasterInventory.creditRewards[0].id).toEqual(giftItem1Id);
      expect(apolloMasterInventory.cars[0].id).toEqual(giftItem2Id);
      expect(apolloMasterInventory.vanityItems[0].id).toEqual(giftItem3Id);
      expect(apolloMasterInventory.carHorns[0].id).toEqual(giftItem4Id);
      expect(apolloMasterInventory.quickChatLines[0].id).toEqual(giftItem5Id);
      expect(apolloMasterInventory.emotes[0].id).toEqual(giftItem6Id);
    });
  });

  describe('Method: sendGiftToPlayers', () => {
    beforeEach(() => {
      mockSunriseService.postGiftPlayersUsingBackgroundTask = jasmine.createSpy(
        'postGiftPlayersUsingBackgroundTask',
      );
      component.playerIdentities = [];
    });

    it('should call postGiftPlayersUsingBackgroundTask', () => {
      component.sendGiftToPlayers({
        giftReason: faker.random.words(10),
        inventory: {
          creditRewards: [],
          cars: [],
          vanityItems: [],
          carHorns: [],
          quickChatLines: [],
          emotes: [],
        },
      });

      expect(mockSunriseService.postGiftPlayersUsingBackgroundTask).toHaveBeenCalled();
    });
  });

  describe('Method: sendGiftToLspGroup', () => {
    beforeEach(() => {
      mockSunriseService.postGiftLspGroup = jasmine.createSpy('postGiftLspGroup');
    });

    it('should call sendGiftToLspGroup', () => {
      component.sendGiftToLspGroup({
        giftReason: faker.random.words(10),
        inventory: {
          creditRewards: [],
          cars: [],
          vanityItems: [],
          carHorns: [],
          quickChatLines: [],
          emotes: [],
        },
      });

      expect(mockSunriseService.postGiftLspGroup).toHaveBeenCalled();
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

      expect(mockStore.dispatch).toHaveBeenCalledWith(new SetSunriseGiftBasket(input));
    });
  });

  describe('Method: setGiftBasketItemErrors', () => {
    beforeEach(() => {
      component.masterInventory = {
        creditRewards: [
          { id: new BigNumber(-1), description: 'Credits', quantity: 0 },
          { id: new BigNumber(-1), description: 'WheelSpins', quantity: 0 },
          { id: new BigNumber(-1), description: 'SuperWheelSpins', quantity: 0 },
        ],
        cars: [{ id: new BigNumber(12345), description: 'Test car', quantity: 0 }],
        carHorns: [{ id: new BigNumber(12345), description: 'Test car', quantity: 0 }],
        vanityItems: [{ id: new BigNumber(12345), description: 'Test car', quantity: 0 }],
        quickChatLines: [{ id: new BigNumber(12345), description: 'Test car', quantity: 0 }],
        emotes: [{ id: new BigNumber(12345), description: 'Test car', quantity: 0 }],
      } as SunriseMasterInventory;
    });

    describe('When credit reward exists', () => {
      it('should set item error to undefined', () => {
        const input = [
          {
            itemType: 'creditRewards',
            description: 'Credits',
            quantity: 200,
            id: new BigNumber(-1),
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
        expect(response[0].error).toEqual('Item does not exist in the master inventory.');
      });
    });

    describe('When car reward reward', () => {
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

    describe('When credit reward is over 500,000,000', () => {
      it('should set item error ', () => {
        const input = [
          {
            itemType: 'creditRewards',
            description: 'Credits',
            quantity: 500_000_001,
            id: new BigNumber(-1),
            edit: false,
            error: undefined,
          },
        ];
        const response = component.setGiftBasketItemErrors(input);

        expect(response.length).toEqual(1);
        expect(response[0]).not.toBeUndefined();
        expect(response[0].error).toEqual('Credit limit for a gift is 500,000,000.');
      });
    });

    describe('When credit reward is under 500,000,000', () => {
      it('should set item error ', () => {
        const input = [
          {
            itemType: 'creditRewards',
            description: 'Credits',
            quantity: 400_000_000,
            id: new BigNumber(-1),
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

    describe('When credit reward is over 999,999,999', () => {
      it('should set item error ', () => {
        const input = [
          {
            itemType: 'creditRewards',
            description: 'Credits',
            quantity: 1_000_000_000,
            id: new BigNumber(-1),
            edit: false,
            error: undefined,
          },
        ];
        const response = component.setGiftBasketItemErrors(input);

        expect(response.length).toEqual(1);
        expect(response[0]).not.toBeUndefined();
        expect(response[0].error).toEqual('Credit max is 999,999,999.');
      });
    });

    describe('When wheel spin reward is over 200', () => {
      it('should set item error ', () => {
        const input = [
          {
            itemType: 'creditRewards',
            description: 'WheelSpins',
            quantity: 201,
            id: new BigNumber(-1),
            edit: false,
            error: undefined,
          },
        ];
        const response = component.setGiftBasketItemErrors(input);

        expect(response.length).toEqual(1);
        expect(response[0]).not.toBeUndefined();
        expect(response[0].error).toEqual('Wheel Spin limit for a gift is 200.');
      });
    });

    describe('When wheel spin reward is under 200', () => {
      it('should set item error ', () => {
        const input = [
          {
            itemType: 'creditRewards',
            description: 'WheelSpins',
            quantity: 199,
            id: new BigNumber(-1),
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

    describe('When super wheel spin reward is over 200', () => {
      it('should set item error ', () => {
        const input = [
          {
            itemType: 'creditRewards',
            description: 'SuperWheelSpins',
            quantity: 201,
            id: new BigNumber(-1),
            edit: false,
            error: undefined,
          },
        ];
        const response = component.setGiftBasketItemErrors(input);

        expect(response.length).toEqual(1);
        expect(response[0]).not.toBeUndefined();
        expect(response[0].error).toEqual('Super Wheel Spin limit for a gift is 200.');
      });
    });

    describe('When super wheel spin reward is over 200', () => {
      it('should set item error ', () => {
        const input = [
          {
            itemType: 'creditRewards',
            description: 'SuperWheelSpins',
            quantity: 199,
            id: new BigNumber(-1),
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
  });
});
