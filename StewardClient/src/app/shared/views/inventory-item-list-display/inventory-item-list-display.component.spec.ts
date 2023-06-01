import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PipesModule } from '@shared/pipes/pipes.module';
import { InventoryItemListDisplayComponent } from './inventory-item-list-display.component';
import faker from '@faker-js/faker';
import { PlayerInventoryItem } from '@models/player-inventory-item';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { MasterInventoryItem } from '@models/master-inventory-item';
import { toDateTime } from '@helpers/luxon';
import { PlayerInventoryItemListEntry } from '@models/master-inventory-item-list';
import BigNumber from 'bignumber.js';

describe('InventoryItemListDisplayComponent', () => {
  let component: InventoryItemListDisplayComponent;
  let fixture: ComponentFixture<InventoryItemListDisplayComponent>;

  const listEntry: PlayerInventoryItemListEntry = {
    id: new BigNumber(faker.datatype.number()),
    description: faker.datatype.string(),
    quantity: faker.datatype.number(),
    itemType: faker.datatype.string(),
    error: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryItemListDisplayComponent],
      imports: [PipesModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryItemListDisplayComponent);
    component = fixture.componentInstance;

    component.whatToShow = {
      title: faker.random.word(),
      description: faker.random.words(10),
      items: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    describe('When whatToShow uses PlayerInventoryItems in items[]', () => {
      beforeEach(() => {
        component.inventoryColumns = ['foo', 'bar', 'dateAquired'];
        component.whatToShow = {
          title: faker.random.word(),
          description: faker.random.words(10),
          items: [
            {
              id: fakeBigNumber(),
              description: faker.random.words(10),
              quantity: faker.datatype.number(100),
              itemType: undefined,
              acquiredUtc: toDateTime(faker.date.past()),
            },
          ] as PlayerInventoryItem[],
        };
      });

      it('should keep date aquired on the displayed table column list', () => {
        component.ngOnInit();

        expect(component.inventoryColumns.length).toEqual(3);
        expect(component.inventoryColumns[2]).toEqual('dateAquired');
      });
    });

    describe('When whatToShow uses MasterInventoryItems in items[]', () => {
      beforeEach(() => {
        component.inventoryColumns = ['foo', 'bar', 'dateAquired'];
        component.whatToShow = {
          title: faker.random.word(),
          description: faker.random.words(10),
          items: [
            {
              id: fakeBigNumber(),
              description: faker.random.words(10),
              quantity: faker.datatype.number(100),
              itemType: undefined,
            },
          ] as MasterInventoryItem[],
        };
      });

      it('should remove date aquired from the displayed table column list', () => {
        component.ngOnInit();

        expect(component.inventoryColumns.length).toEqual(2);
      });
    });
  });

  describe('Method: enableEditMode', () => {
    beforeEach(() => {
      listEntry.isInEditMode = false;
    });

    describe('If item is a car item', () => {
      beforeEach(() => {
        listEntry['vin'] = faker.datatype.string();
      });

      it('should throw error', () => {
        try {
          component.enableEditMode(listEntry);
          expect(true).toBeFalsy();
        } catch (e) {
          expect(e.message).toEqual(
            'Car items should not support item quantity changes. Verify InventoryItemListDisplayComponentContract is implementing openCarEditModal$ instead of editItemQuantity$',
          );
        }
      });
    });

    describe('If item is not a car item', () => {
      beforeEach(() => {
        listEntry['vin'] = undefined;
      });

      it('should enable edit mode', () => {
        component.enableEditMode(listEntry);

        expect(listEntry.isInEditMode).toBeTruthy();
      });
    });
  });

  describe('Method: disableEditMode', () => {
    beforeEach(() => {
      listEntry.isInEditMode = true;
    });

    it('should enable edit mode', () => {
      component.disableEditMode(listEntry);

      expect(listEntry.isInEditMode).toBeFalsy();
    });
  });
});
