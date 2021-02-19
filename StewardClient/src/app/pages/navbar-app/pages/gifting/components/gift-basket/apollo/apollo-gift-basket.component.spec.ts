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
    const testItem1Id = BigInt(faker.random.number());
    const testItem2Id = BigInt(faker.random.number());
    const testItem3Id = BigInt(faker.random.number());

    beforeEach(() => {
      component.sendGiftForm = formBuilder.group({
        giftReason: [''],
      });
      component.sendGiftForm.controls['giftReason'].setValue(giftReason);
      component.giftBasket.data = [
        {
          id: testItem1Id,
          description: faker.random.words(3),
          quantity: faker.random.number(),
          itemType: 'creditRewards',
          edit: false,
        },
        { 
          id: testItem2Id,
          description: faker.random.words(3),
          quantity: faker.random.number(),
          itemType: 'cars',
          edit: false
        },
        {
          id: testItem3Id,
          description: faker.random.words(3),
          quantity: faker.random.number(),
          itemType: 'vanityItems',
          edit: false,
        },
      ];
    });

    it('should set masterInventory', () => {
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

  describe('Method: sendGiftToPlayers', () => {
    beforeEach(() => {
      mockApolloService.postGiftPlayersUsingBackgroundTask = jasmine.createSpy(
        'postGiftPlayersUsingBackgroundTask',
      );
      component.playerIdentities = [];
    });

    it('should call postGiftPlayersUsingBackgroundTask', () => {
      component.sendGiftToPlayers({
        giftReason: faker.random.words(10),
        inventory: { creditRewards: [], cars: [], vanityItems: [] },
      });

      expect(mockApolloService.postGiftPlayersUsingBackgroundTask).toHaveBeenCalled();
    });
  });

  describe('Method: sendGiftToLspGroup', () => {
    beforeEach(() => {
      mockApolloService.postGiftLspGroup = jasmine.createSpy('postGiftLspGroup');
    });

    it('should call sendGiftToLspGroup', () => {
      component.sendGiftToLspGroup({
        giftReason: faker.random.words(10),
        inventory: { creditRewards: [], cars: [], vanityItems: [] },
      });

      expect(mockApolloService.postGiftLspGroup).toHaveBeenCalled();
    });
  });
});
