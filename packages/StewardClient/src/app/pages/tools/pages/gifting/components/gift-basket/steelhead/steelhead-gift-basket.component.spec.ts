import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SteelheadGiftBasketComponent } from './steelhead-gift-basket.component';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SteelheadMasterInventory } from '@models/steelhead';
import { of } from 'rxjs';
import { GetSteelheadMasterInventoryList } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.actions';
import { SetSteelheadGiftBasket } from '@tools-app/pages/gifting/steelhead/state/steelhead-gifting.state.actions';
import faker from '@faker-js/faker';
import { createMockSteelheadLocalizationService } from '@services/api-v2/steelhead/localization/steelhead-localization.service.mock';
import { PipesModule } from '@shared/pipes/pipes.module';
import { createMockSteelheadPlayersGiftService } from '@services/api-v2/steelhead/players/gift/steelhead-player-gift.service.mock';
import { createMockSteelheadGroupGiftService } from '@services/api-v2/steelhead/group/gift/steelhead-group-gift.service.mock';
import { SteelheadPlayersGiftService } from '@services/api-v2/steelhead/players/gift/steelhead-players-gift.service';
import { SteelheadGroupGiftService } from '@services/api-v2/steelhead/group/gift/steelhead-group-gift.service';
import { createMockPermAttributesService } from '@services/perm-attributes/perm-attributes.service.mock';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'SteelheadGiftBasketComponent', () => {
  let fixture: ComponentFixture<SteelheadGiftBasketComponent>;
  let component: SteelheadGiftBasketComponent;

  const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();
  let mockStore: Store;
  let mockSteelheadPlayersGiftService: SteelheadPlayersGiftService;
  let mockSteelheadGroupGiftService: SteelheadGroupGiftService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot(),
          ReactiveFormsModule,
          PipesModule,
        ],
        declarations: [SteelheadGiftBasketComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          createMockSteelheadLocalizationService(),
          createMockSteelheadPlayersGiftService(),
          createMockSteelheadGroupGiftService(),
          createMockPermAttributesService(),
        ],
      }),
    ).compileComponents();

    const injector = getTestBed();
    mockStore = injector.inject(Store);
    mockSteelheadPlayersGiftService = injector.inject(SteelheadPlayersGiftService);
    mockSteelheadGroupGiftService = injector.inject(SteelheadGroupGiftService);

    fixture = TestBed.createComponent(SteelheadGiftBasketComponent);
    component = fixture.debugElement.componentInstance;

    mockStore.select = jasmine.createSpy('select').and.returnValue(of([]));
    mockStore.dispatch = jasmine.createSpy('dispatch').and.returnValue(of({}));
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    const testMasterInventory: SteelheadMasterInventory = {
      cars: [],
      vanityItems: [],
      creditRewards: [],
      driverSuits: [],
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
      mockSteelheadPlayersGiftService.postGiftPlayersUsingBackgroundTask$ = jasmine.createSpy(
        'postGiftPlayersUsingBackgroundTask',
      );
      component.playerIdentities = [];
    });

    it('should call postGiftPlayersUsingBackgroundTask', () => {
      component.sendGiftToPlayers$({
        titleMessageId: faker.datatype.uuid(),
        bodyMessageId: faker.datatype.uuid(),
        expireAfterDays: new BigNumber(faker.datatype.number()),
        giftReason: faker.random.words(10),
        inventory: { creditRewards: [], cars: [], vanityItems: [], driverSuits: [] },
      });

      expect(
        mockSteelheadPlayersGiftService.postGiftPlayersUsingBackgroundTask$,
      ).toHaveBeenCalled();
    });
  });

  describe('Method: sendGiftToLspGroup$', () => {
    beforeEach(() => {
      mockSteelheadGroupGiftService.postGiftLspGroup$ = jasmine.createSpy('postGiftLspGroup');
    });

    it('should call sendGiftToLspGroup$', () => {
      component.lspGroup = { id: new BigNumber(123), name: 'test-lsp-group' };
      component.sendGiftToLspGroup$({
        titleMessageId: faker.datatype.uuid(),
        bodyMessageId: faker.datatype.uuid(),
        expireAfterDays: new BigNumber(faker.datatype.number()),
        giftReason: faker.random.words(10),
        inventory: { creditRewards: [], cars: [], vanityItems: [], driverSuits: [] },
      });

      expect(mockSteelheadGroupGiftService.postGiftLspGroup$).toHaveBeenCalled();
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

    describe('When ignoreMaxCreditLimit is set to true and reward is over 500,000,000', () => {
      it('should not set item error ', () => {
        component.ignoreMaxCreditLimit = true;
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

        expect(component.giftBasketHasErrors).toBeFalsy();
        expect(response[0].restriction).toBeUndefined();
      });
    });

    describe('When ignoreMaxCreditLimit is set to false and reward is over 500,000,000', () => {
      it('should set item error ', () => {
        component.ignoreMaxCreditLimit = false;
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
  });
});
