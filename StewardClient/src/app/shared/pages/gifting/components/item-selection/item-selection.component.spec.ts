import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ItemSelectionComponent } from './item-selection.component';
import { FormBuilder, FormControl, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MasterInventoryItem } from '@models/master-inventory-item';

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

      fixture = TestBed.createComponent(ItemSelectionComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: addItemEmit', () => {
    const testQuantity = 5;
    const formGroupDirective = new FormGroupDirective([], []);
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
        component.addItemEmitter(formGroupDirective);

        expect(component.addItemEvent.emit).not.toHaveBeenCalled();
      });
    });

    describe('If there is a selection item', () => {
      const testInventoryItem = {
        id: new BigNumber(1),
        description: 'test-description',
        quantity: 0,
        itemType: 'fake type',
      };
      beforeEach(() => {
        component.selectedItem = testInventoryItem;
        component.itemSelectionForm.reset = jasmine.createSpy('reset');
        formGroupDirective.resetForm = jasmine.createSpy('reset');
      });

      it('should emit addItemEvent with correct quantity', () => {
        component.addItemEmitter(formGroupDirective);

        testInventoryItem.quantity = testQuantity; // This quantity is set from the form control
        expect(component.addItemEvent.emit).toHaveBeenCalledWith(testInventoryItem);
      });

      it('should set selectedItem undefined', () => {
        component.addItemEmitter(formGroupDirective);

        expect(component.selectedItem).toBeUndefined();
      });

      it('should call itemSelectionForm reset', () => {
        component.addItemEmitter(formGroupDirective);

        expect(component.itemSelectionForm.reset).toHaveBeenCalled();
      });

      it('should call formGroupDirective.resetForm', () => {
        component.addItemEmitter(formGroupDirective);

        expect(formGroupDirective.resetForm).toHaveBeenCalled();
      });
    });
  });

  describe('Method: newItemSelected', () => {
    const testInventoryItem = {
      id: new BigNumber(1),
      description: 'test-description',
      quantity: 0,
      itemType: 'fake type',
    };
    beforeEach(() => {
      component.selectedItem = undefined;
      component.quantityElement = {
        nativeElement: {
          focus: () => {
            /** Empty */
          },
        },
      };
      component.quantityElement.nativeElement.focus = jasmine.createSpy('focus');
    });

    it('should set selectedItem', () => {
      component.newItemSelected(testInventoryItem);

      expect(component.selectedItem).toEqual(testInventoryItem);
    });

    it('should set focus to quantity selection', () => {
      component.newItemSelected(testInventoryItem);

      expect(component.quantityElement.nativeElement.focus).toHaveBeenCalled();
    });
  });

  describe('Method: itemAutoCompleteDisplayFn', () => {
    const testDescription = 'test description';
    let testInventoryItem: MasterInventoryItem;

    beforeEach(() => {
      testInventoryItem = {
        id: new BigNumber(1),
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
