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
    beforeEach(() => {
      component.sendGiftForm = formBuilder.group({
        giftReason: [''],
      });
      component.sendGiftForm.controls['giftReason'].setValue(giftReason);
      component.giftBasket.data = [
        {
          id: BigInt(123),
          description: 'fake-item-1',
          quantity: 0,
          itemType: 'creditRewards',
          edit: false,
        },
        { id: BigInt(456), description: 'fake-item-2', quantity: 0, itemType: 'cars', edit: false },
        {
          id: BigInt(789),
          description: 'fake-item-3',
          quantity: 0,
          itemType: 'vanityItems',
          edit: false,
        },
        {
          id: BigInt(123),
          description: 'fake-item-4',
          quantity: 0,
          itemType: 'carHorns',
          edit: false,
        },
        {
          id: BigInt(456),
          description: 'fake-item-5',
          quantity: 0,
          itemType: 'quickChatLines',
          edit: false,
        },
        {
          id: BigInt(789),
          description: 'fake-item-6',
          quantity: 0,
          itemType: 'emotes',
          edit: false,
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
        giftReason: 'fake gift reason',
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
        giftReason: 'fake gift reason',
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
});
