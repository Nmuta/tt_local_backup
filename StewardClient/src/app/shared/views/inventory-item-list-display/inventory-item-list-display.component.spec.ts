import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PipesModule } from '@shared/pipes/pipes.module';
import { InventoryItemListDisplayComponent } from './inventory-item-list-display.component';
import faker from 'faker';
import { PlayerInventoryItem } from '@models/player-inventory-item';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { MasterInventoryItem } from '@models/master-inventory-item';
import { toDateTime } from '@helpers/luxon';

describe('InventoryItemListDisplayComponent', () => {
  let component: InventoryItemListDisplayComponent;
  let fixture: ComponentFixture<InventoryItemListDisplayComponent>;

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
    beforeEach(() => {
      component.inventoryColumns = ['foo', 'bar'];
    });

    describe('When whatToShow uses PlayerInventoryItems in items[]', () => {
      beforeEach(() => {
        component.whatToShow = {
          title: faker.random.word(),
          description: faker.random.words(10),
          items: [
            {
              id: fakeBigNumber(),
              description: faker.random.words(10),
              quantity: faker.datatype.number(100),
              itemType: undefined,
              dateAquiredUtc: toDateTime(faker.date.past()),
            },
          ] as PlayerInventoryItem[],
        };
      });

      it('should add date aquired too the displayed table column list', () => {
        component.ngOnInit();

        expect(component.inventoryColumns.length).toEqual(3);
        expect(component.inventoryColumns[0]).toEqual('foo');
        expect(component.inventoryColumns[1]).toEqual('bar');
        expect(component.inventoryColumns[2]).toEqual('dateAquired');
      });
    });

    describe('When whatToShow uses MasterInventoryItems in items[]', () => {
      beforeEach(() => {
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

      it('should not add anything to the displayed table column list', () => {
        component.ngOnInit();

        expect(component.inventoryColumns.length).toEqual(2);
        expect(component.inventoryColumns[0]).toEqual('foo');
        expect(component.inventoryColumns[1]).toEqual('bar');
      });
    });
  });
});
