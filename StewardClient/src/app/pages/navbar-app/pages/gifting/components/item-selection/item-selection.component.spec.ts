import { NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ItemSelectionComponent } from './item-selection.component';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { InventoryItem } from '../gift-basket/gift-basket.base.component';

describe('ItemSelectionComponent', () => {
  let fixture: ComponentFixture<ItemSelectionComponent>;
  let component: ItemSelectionComponent;

  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot(),
          ReactiveFormsModule,
          MatAutocompleteModule,
        ],
        declarations: [ItemSelectionComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [{ provide: FormBuilder, useValue: formBuilder }],
      }).compileComponents();

      fixture = TestBed.createComponent(ItemSelectionComponent as Type<ItemSelectionComponent>);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: addItemEmit', () => {
    const testQuantity = 5;
    beforeEach(() => {
      component.addItemEvent.emit = jasmine.createSpy('emit');
      component.itemSelectionForm = formBuilder.group({
        quantity: new FormControl(testQuantity),
      });
    });

    describe('If there is no selected item', () => {
      beforeEach(() => {
        component.selectedItem = undefined;
      });

      it('should not emit addItemEvent', () => {
        component.addItemEmitter();

        expect(component.addItemEvent.emit).not.toHaveBeenCalled();
      });
    });

    describe('If there is a selection item', () => {
      const testInventoryItem = {
        itemId: BigInt(1),
        description: 'test-description',
        quantity: 0,
        itemType: 'fake type',
      };
      const selectionItemInput = {
        focus: () => {
          /** Empty */
        },
      };
      beforeEach(() => {
        component.selectedItem = testInventoryItem;
        component.itemSelectionForm.reset = jasmine.createSpy('reset');
        selectionItemInput.focus = jasmine.createSpy('focus');
        document.getElementById = jasmine
          .createSpy('getElementById')
          .and.returnValue(selectionItemInput);
      });

      it('should emit addItemEvent with correct quantity', () => {
        component.addItemEmitter();

        testInventoryItem.quantity = testQuantity; // This quantity is set from the form control
        expect(component.addItemEvent.emit).toHaveBeenCalledWith(testInventoryItem);
      });

      it('should set selectedItem undefined', () => {
        component.addItemEmitter();

        expect(component.selectedItem).toBeUndefined();
      });

      it('should call itemSelectionForm reset', () => {
        component.addItemEmitter();

        expect(component.itemSelectionForm.reset).toHaveBeenCalled();
      });

      it('should set focus back item selection', () => {
        component.addItemEmitter();

        expect(document.getElementById).toHaveBeenCalledWith('item-selection-input');
        expect(selectionItemInput.focus).toHaveBeenCalled();
      });
    });
  });

  describe('Method: newItemSelected', () => {
    const testInventoryItem = {
      itemId: BigInt(1),
      description: 'test-description',
      quantity: 0,
      itemType: 'fake type',
    };
    const selectionItemInput = {
      focus: () => {
        /** Empty */
      },
    };
    beforeEach(() => {
      component.selectedItem = undefined;
      selectionItemInput.focus = jasmine.createSpy('focus');
      document.getElementById = jasmine
        .createSpy('getElementById')
        .and.returnValue(selectionItemInput);
    });

    it('should set selectedItem', () => {
      component.newItemSelected(testInventoryItem);

      expect(component.selectedItem).toEqual(testInventoryItem);
    });

    it('should set focus to quantity selection', () => {
      component.newItemSelected(testInventoryItem);

      expect(document.getElementById).toHaveBeenCalledWith('item-selection-quanity-input');
      expect(selectionItemInput.focus).toHaveBeenCalled();
    });
  });

  describe('Method: itemAutoCompleteDisplayFn', () => {
    const testDescription = 'test description';
    let testInventoryItem: InventoryItem;

    beforeEach(() => {
      testInventoryItem = {
        itemId: BigInt(1),
        description: testDescription,
        quantity: 1,
        itemType: 'test type',
      };
    });
    describe('If item is undefined', () => {
      it('should return empty string', () => {
        const response = component.itemAutoCompleteDisplayFn(undefined);
        expect(response).toEqual('');
      });
    });

    describe('If item.description is null', () => {
      it('should return empty string', () => {
        testInventoryItem.description = null;
        const response = component.itemAutoCompleteDisplayFn(testInventoryItem);
        expect(response).toEqual('');
      });
    });

    describe('If item is valid', () => {
      it('should return empty string', () => {
        const response = component.itemAutoCompleteDisplayFn(testInventoryItem);
        expect(response).toEqual(testDescription);
      });
    });
  });
});
