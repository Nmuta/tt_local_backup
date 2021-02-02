import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SunriseGiftBasketComponent } from './sunrise-gift-basket.component';
import { GetSunriseMasterInventoryList } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.actions';
import { of } from 'rxjs';
import { SunriseMasterInventory } from '@models/sunrise/sunrise-master-inventory.model';
import { ReactiveFormsModule } from '@angular/forms';

describe('SunriseGiftBasketComponent', () => {
  let fixture: ComponentFixture<SunriseGiftBasketComponent>;
  let component: SunriseGiftBasketComponent;

  let mockStore: Store;

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

      component.buildMatAutocompleteState = jasmine.createSpy('buildMatAutocompleteState');
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

    it('should call buildMatAutocompleteState', () => {
      component.ngOnInit();

      expect(component.buildMatAutocompleteState).toHaveBeenCalled();
    });
  });
});
