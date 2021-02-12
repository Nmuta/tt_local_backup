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
    beforeEach(() => {
      component.sendGiftForm = formBuilder.group({
        giftReason: [''],
      });
      component.sendGiftForm.controls['giftReason'].setValue(giftReason);
      component.giftBasket.data = [
        { id: BigInt(123), description: 'fake-item-1', quantity: 0, itemType: 'creditRewards', edit: false},
        { id: BigInt(456), description: 'fake-item-2', quantity: 0, itemType: 'cars', edit: false},
        { id: BigInt(789), description: 'fake-item-3', quantity: 0, itemType: 'vanityItems', edit: false},
      ];
    });

    it('should set masterInventory', () => {
      const gift = component.generateGiftInventoryFromGiftBasket();
      
      expect(gift.giftReason).toEqual(giftReason);
      const apolloMasterInventory = (gift.inventory as ApolloMasterInventory);
      expect(apolloMasterInventory).not.toBeUndefined();
      expect(apolloMasterInventory.creditRewards.length).toEqual(1);
      expect(apolloMasterInventory.cars.length).toEqual(1);
      expect(apolloMasterInventory.vanityItems.length).toEqual(1);
      expect(apolloMasterInventory.creditRewards[0].id).toEqual(BigInt(123));
      expect(apolloMasterInventory.cars[0].id).toEqual(BigInt(456));
      expect(apolloMasterInventory.vanityItems[0].id).toEqual(BigInt(789));
    });
  });

  describe('Method: sendGiftToPlayers', () => {
    beforeEach(() => {
      mockApolloService.postGiftPlayersUsingBackgroundTask = jasmine.createSpy('postGiftPlayersUsingBackgroundTask');
      component.playerIdentities = [];
    });
    
    it('should call postGiftPlayersUsingBackgroundTask', () => {
      component.sendGiftToPlayers({ giftReason: 'fake gift reason', inventory: { creditRewards: [], cars: [], vanityItems: []} });

      expect(mockApolloService.postGiftPlayersUsingBackgroundTask).toHaveBeenCalled();
    });
  });

  describe('Method: sendGiftToLspGroup', () => {
    beforeEach(() => {
      mockApolloService.postGiftLspGroup = jasmine.createSpy('postGiftLspGroup');
    });
    
    it('should call sendGiftToLspGroup', () => {
      component.sendGiftToLspGroup({ giftReason: 'fake gift reason', inventory: { creditRewards: [], cars: [], vanityItems: []} });

      expect(mockApolloService.postGiftLspGroup).toHaveBeenCalled();
    });
  });
});
