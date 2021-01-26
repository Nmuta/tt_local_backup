import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GravityGiftBasketComponent } from './gravity-gift-basket.component';
import { GravityMasterInventory } from '@models/gravity/gravity-master-inventory.model';
import { of } from 'rxjs';
import { GetGravityMasterInventoryList } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.actions';

describe('GravityGiftBasketComponent', () => {
  let fixture: ComponentFixture<GravityGiftBasketComponent>;
  let component: GravityGiftBasketComponent;

  let mockStore: Store;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot(),
        ],
        declarations: [GravityGiftBasketComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
      }).compileComponents();

      const injector = getTestBed();
      mockStore = injector.inject(Store);

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
      xuid: BigInt(0),
      t10Id: 'test-id',
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
      currencies: [],
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
});
