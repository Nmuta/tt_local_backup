import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApolloGiftBasketComponent } from './apollo-gift-basket.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApolloMasterInventory } from '@models/apollo';
import { of } from 'rxjs';
import { GetApolloMasterInventoryList } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.actions';
import { ApolloService } from '@services/apollo';
import { SetApolloGiftBasket } from '@tools-app/pages/gifting/apollo/state/apollo-gifting.state.actions';
import faker from 'faker';

describe('ApolloGiftBasketComponent', () => {
  let fixture: ComponentFixture<ApolloGiftBasketComponent>;
  let component: ApolloGiftBasketComponent;

  const formBuilder: FormBuilder = new FormBuilder();
  let mockStore: Store;
  let mockApolloService: ApolloService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot(),
          ReactiveFormsModule,
        ],
        declarations: [ApolloGiftBasketComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
      }).compileComponents();

      const injector = getTestBed();
      mockStore = injector.inject(Store);
      mockApolloService = injector.inject(ApolloService);

      fixture = TestBed.createComponent(ApolloGiftBasketComponent);
      component = fixture.debugElement.componentInstance;

      mockStore.select = jasmine.createSpy('select').and.returnValue(of([]));
      mockStore.dispatch = jasmine.createSpy('dispatch').and.returnValue(of({}));
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    const testMasterInventory: ApolloMasterInventory = {
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

    it('should dispatch GetApolloMasterInventoryList action', () => {
      component.ngOnInit();

      expect(mockStore.dispatch).toHaveBeenCalledWith(new GetApolloMasterInventoryList());
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

    it('should return a valid Apollo Gift', () => {
      const gift = component.generateGiftInventoryFromGiftBasket();

      expect(gift.giftReason).toEqual(giftReason);
      const apolloMasterInventory = gift.inventory as ApolloMasterInventory;
      expect(apolloMasterInventory).not.toBeUndefined();

      expect(apolloMasterInventory.creditRewards.length).toEqual(1);
      expect(apolloMasterInventory.cars.length).toEqual(1);
      expect(apolloMasterInventory.vanityItems.length).toEqual(1);

      expect(apolloMasterInventory.creditRewards[0].id).toEqual(testItem1Id);
      expect(apolloMasterInventory.cars[0].id).toEqual(testItem2Id);
      expect(apolloMasterInventory.vanityItems[0].id).toEqual(testItem3Id);
    });
  });

  describe('Method: sendGiftToPlayers$', () => {
    beforeEach(() => {
      mockApolloService.postGiftPlayersUsingBackgroundTask$ = jasmine.createSpy(
        'postGiftPlayersUsingBackgroundTask',
      );
      component.playerIdentities = [];
    });

    it('should call postGiftPlayersUsingBackgroundTask', () => {
      component.sendGiftToPlayers$({
        giftReason: faker.random.words(10),
        inventory: { creditRewards: [], cars: [], vanityItems: [] },
      });

      expect(mockApolloService.postGiftPlayersUsingBackgroundTask$).toHaveBeenCalled();
    });
  });

  describe('Method: sendGiftToLspGroup$', () => {
    beforeEach(() => {
      mockApolloService.postGiftLspGroup$ = jasmine.createSpy('postGiftLspGroup');
    });

    it('should call sendGiftToLspGroup$', () => {
      component.sendGiftToLspGroup$({
        giftReason: faker.random.words(10),
        inventory: { creditRewards: [], cars: [], vanityItems: [] },
      });

      expect(mockApolloService.postGiftLspGroup$).toHaveBeenCalled();
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

      expect(mockStore.dispatch).toHaveBeenCalledWith(new SetApolloGiftBasket(input));
    });
  });

  describe('Method: setGiftBasketItemErrors', () => {
    beforeEach(() => {
      component.masterInventory = {
        creditRewards: [{ id: new BigNumber(-1), description: 'Credits', quantity: 0 }],
        cars: [{ id: new BigNumber(12345), description: 'Test car', quantity: 0 }],
        vanityItems: [{ id: new BigNumber(67890), description: 'Test vanity item', quantity: 0 }],
      } as ApolloMasterInventory;
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
