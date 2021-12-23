import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SteelheadGiftBasketComponent } from './steelhead-gift-basket.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SteelheadMasterInventory } from '@models/steelhead';
import { of } from 'rxjs';
import { GetSteelheadMasterInventoryList } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.actions';
import { SteelheadService } from '@services/steelhead';
import { SetSteelheadGiftBasket } from '@shared/pages/gifting/steelhead/state/steelhead-gifting.state.actions';
import faker from 'faker';

describe('SteelheadGiftBasketComponent', () => {
  let fixture: ComponentFixture<SteelheadGiftBasketComponent>;
  let component: SteelheadGiftBasketComponent;

  const formBuilder: FormBuilder = new FormBuilder();
  let mockStore: Store;
  let mockSteelheadService: SteelheadService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot(),
          ReactiveFormsModule,
        ],
        declarations: [SteelheadGiftBasketComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
      }).compileComponents();

      const injector = getTestBed();
      mockStore = injector.inject(Store);
      mockSteelheadService = injector.inject(SteelheadService);

      fixture = TestBed.createComponent(SteelheadGiftBasketComponent);
      component = fixture.debugElement.componentInstance;

      mockStore.select = jasmine.createSpy('select').and.returnValue(of([]));
      mockStore.dispatch = jasmine.createSpy('dispatch').and.returnValue(of({}));
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    const testMasterInventory: SteelheadMasterInventory = {
      cars: [],
      vanityItems: [],
      creditRewards: [],
    };
    beforeEach(() => {
      mockStore.dispatch = jasmine.createSpy('dispatch').and.returnValue(of({}));
      mockStore.selectSnapshot = jasmine
        .createSpy('selectSnapshot')
        .and.returnValue(testMasterInventory);
    });

    it('should dispatch GetSteelheadMasterInventoryList action', () => {
      component.ngOnInit();

      expect(mockStore.dispatch).toHaveBeenCalledWith(new GetSteelheadMasterInventoryList());
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
    const testItem1Id = new BigNumber(faker.datatype.number());
    const testItem2Id = new BigNumber(faker.datatype.number());
    const testItem3Id = new BigNumber(faker.datatype.number());

    beforeEach(() => {
      component.sendGiftForm = formBuilder.group({
        giftReason: [''],
      });
      component.sendGiftForm.controls['giftReason'].setValue(giftReason);
      component.giftBasket.data = [
        {
          id: testItem1Id,
          description: faker.random.words(3),
          quantity: faker.datatype.number(),
          itemType: 'creditRewards',
          edit: false,
          error: undefined,
        },
        {
          id: testItem2Id,
          description: faker.random.words(3),
          quantity: faker.datatype.number(),
          itemType: 'cars',
          edit: false,
          error: undefined,
        },
        {
          id: testItem3Id,
          description: faker.random.words(3),
          quantity: faker.datatype.number(),
          itemType: 'vanityItems',
          edit: false,
          error: undefined,
        },
      ];
    });

    it('should return a valid Steelhead Gift', () => {
      const gift = component.generateGiftInventoryFromGiftBasket();

      expect(gift.giftReason).toEqual(giftReason);
      const steelheadMasterInventory = gift.inventory as SteelheadMasterInventory;
      expect(steelheadMasterInventory).not.toBeUndefined();

      expect(steelheadMasterInventory.creditRewards.length).toEqual(1);
      expect(steelheadMasterInventory.cars.length).toEqual(1);
      expect(steelheadMasterInventory.vanityItems.length).toEqual(1);

      expect(steelheadMasterInventory.creditRewards[0].id).toEqual(testItem1Id);
      expect(steelheadMasterInventory.cars[0].id).toEqual(testItem2Id);
      expect(steelheadMasterInventory.vanityItems[0].id).toEqual(testItem3Id);
    });
  });

  describe('Method: sendGiftToPlayers$', () => {
    beforeEach(() => {
      mockSteelheadService.postGiftPlayersUsingBackgroundTask$ = jasmine.createSpy(
        'postGiftPlayersUsingBackgroundTask',
      );
      component.playerIdentities = [];
    });

    it('should call postGiftPlayersUsingBackgroundTask', () => {
      component.sendGiftToPlayers$({
        giftReason: faker.random.words(10),
        inventory: { creditRewards: [], cars: [], vanityItems: [] },
      });

      expect(mockSteelheadService.postGiftPlayersUsingBackgroundTask$).toHaveBeenCalled();
    });
  });

  describe('Method: sendGiftToLspGroup$', () => {
    beforeEach(() => {
      mockSteelheadService.postGiftLspGroup$ = jasmine.createSpy('postGiftLspGroup');
    });

    it('should call sendGiftToLspGroup$', () => {
      component.sendGiftToLspGroup$({
        giftReason: faker.random.words(10),
        inventory: { creditRewards: [], cars: [], vanityItems: [] },
      });

      expect(mockSteelheadService.postGiftLspGroup$).toHaveBeenCalled();
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

      expect(mockStore.dispatch).toHaveBeenCalledWith(new SetSteelheadGiftBasket(input));
    });
  });

  describe('Method: setGiftBasketItemErrors', () => {
    beforeEach(() => {
      component.masterInventory = {
        creditRewards: [{ id: new BigNumber(-1), description: 'Credits', quantity: 0 }],
        cars: [{ id: new BigNumber(12345), description: 'Test car', quantity: 0 }],
        vanityItems: [{ id: new BigNumber(67890), description: 'Test vanity item', quantity: 0 }],
      } as SteelheadMasterInventory;
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
        expect(response[0].restriction).toEqual('Item does not exist in the master inventory.');
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
        expect(response[0].restriction).toEqual('Credit limit for a gift is 500,000,000.');
      });
    });

    describe('When credit reward is not over 500,000,000', () => {
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
        expect(response[0].restriction).toEqual('Credit max is 999,999,999.');
      });
    });
  });
});
