import { NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IdentityResultBeta } from '@models/identity-query.model';
import { GiftBasketBaseComponent, GiftBasketModel } from './gift-basket.base.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

describe('GiftBasketBaseComponent', () => {
  let fixture: ComponentFixture<GiftBasketBaseComponent<IdentityResultBeta>>;
  let component: GiftBasketBaseComponent<IdentityResultBeta>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot(),
          ReactiveFormsModule,
        ],
        declarations: [GiftBasketBaseComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(
        GiftBasketBaseComponent as Type<GiftBasketBaseComponent<IdentityResultBeta>>,
      );
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: addItemtoBasket', () => {
    let testItemNew: GiftBasketModel;

    beforeEach(() => {
      testItemNew = {
        itemId: BigInt(1234),
        description: 'test description',
        quantity: BigInt(10),
        itemType: 'test type',
        edit: false,
      };
    });

    describe('If item ID doesnt exist in the gift basket', () => {
      beforeEach(() => {
        component.giftBasket = new MatTableDataSource<GiftBasketModel>();
      });

      it('should increase the quantity of the existing item in the gift basket', () => {
        component.addItemtoBasket(testItemNew);

        expect(component.giftBasket.data.length).toEqual(1);
        expect(component.giftBasket.data[0].quantity).toEqual(BigInt(10));
      });
    });

    describe('If the item ID exists in the gift basket', () => {
      beforeEach(() => {
        component.giftBasket = new MatTableDataSource<GiftBasketModel>();
        component.giftBasket.data = [
          {
            itemId: BigInt(1234),
            description: 'test description',
            quantity: BigInt(50),
            itemType: 'test type',
            edit: false,
          }
        ];
      });

      it('should add the item to the gift basket', () => {
        component.addItemtoBasket(testItemNew);

        expect(component.giftBasket.data.length).toEqual(1);
        expect(component.giftBasket.data[0].quantity).toEqual(BigInt(60));
      });
    });
  });

  describe('Method: editItemQuantity', () => {
    const testItemQuantity = 10;
    const itemQuantityInput = { value: testItemQuantity};
    beforeEach(() => {
      document.getElementById = jasmine.createSpy('getElementById').and.returnValue(itemQuantityInput);
      component.giftBasket = new MatTableDataSource<GiftBasketModel>();
        component.giftBasket.data = [
          {
            itemId: BigInt(1234),
            description: 'test description',
            quantity: BigInt(50),
            itemType: 'test type',
            edit: false,
          }
        ];
    });
    
    it('should set the item quantity to the new value', () => {
      component.editItemQuantity(0);

      expect(component.giftBasket.data[0].quantity).toEqual(BigInt(testItemQuantity));
      expect(component.giftBasket.data[0].edit).toBeFalsy();
    });
  });

  describe('Method: removeItemFromGiftBasket', () => {
    const testItemId = BigInt(4321);
    beforeEach(() => {
      component.giftBasket = new MatTableDataSource<GiftBasketModel>();
        component.giftBasket.data = [
          {
            itemId: BigInt(1234),
            description: 'test description 1',
            quantity: BigInt(50),
            itemType: 'test type 1',
            edit: false,
          },
          {
            itemId: testItemId,
            description: 'test description 2',
            quantity: BigInt(10),
            itemType: 'test type 2',
            edit: false,
          }
        ];
    });

    it('should remove the given index from the gift basket', () => {
      component.removeItemFromGiftBasket(0);

      expect(component.giftBasket.data.length).toEqual(1);
      expect(component.giftBasket.data[0].itemId).toEqual(testItemId);
    });
  });
});
