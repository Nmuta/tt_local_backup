import { NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IdentityResultBeta } from '@models/identity-query.model';
import { GiftBasketBaseComponent, GiftBasketModel } from './gift-basket.base.component';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

describe('GiftBasketBaseComponent', () => {
  let fixture: ComponentFixture<GiftBasketBaseComponent<IdentityResultBeta>>;
  let component: GiftBasketBaseComponent<IdentityResultBeta>;

  const formBuilder: FormBuilder = new FormBuilder();

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
        id: BigInt(1234),
        description: 'test description',
        quantity: 10,
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
        expect(component.giftBasket.data[0].quantity).toEqual(10);
      });
    });

    describe('If the item ID exists in the gift basket', () => {
      beforeEach(() => {
        component.giftBasket = new MatTableDataSource<GiftBasketModel>();
        component.giftBasket.data = [
          {
            id: BigInt(1234),
            description: 'test description',
            quantity: 50,
            itemType: 'test type',
            edit: false,
          },
        ];
      });

      it('should add the item to the gift basket', () => {
        component.addItemtoBasket(testItemNew);

        expect(component.giftBasket.data.length).toEqual(1);
        expect(component.giftBasket.data[0].quantity).toEqual(60);
      });
    });
  });

  describe('Method: editItemQuantity', () => {
    const testItemQuantity = 10;
    const itemQuantityInput = { value: testItemQuantity };
    beforeEach(() => {
      document.getElementById = jasmine
        .createSpy('getElementById')
        .and.returnValue(itemQuantityInput);
      component.giftBasket = new MatTableDataSource<GiftBasketModel>();
      component.giftBasket.data = [
        {
          id: BigInt(1234),
          description: 'test description',
          quantity: 50,
          itemType: 'test type',
          edit: false,
        },
      ];
    });

    it('should set the item quantity to the new value', () => {
      component.editItemQuantity(0);

      expect(component.giftBasket.data[0].quantity).toEqual(testItemQuantity);
      expect(component.giftBasket.data[0].edit).toBeFalsy();
    });
  });

  describe('Method: removeItemFromGiftBasket', () => {
    const testid = BigInt(4321);
    beforeEach(() => {
      component.giftBasket = new MatTableDataSource<GiftBasketModel>();
      component.giftBasket.data = [
        {
          id: BigInt(1234),
          description: 'test description 1',
          quantity: 50,
          itemType: 'test type 1',
          edit: false,
        },
        {
          id: testid,
          description: 'test description 2',
          quantity: 10,
          itemType: 'test type 2',
          edit: false,
        },
      ];
    });

    it('should remove the given index from the gift basket', () => {
      component.removeItemFromGiftBasket(0);

      expect(component.giftBasket.data.length).toEqual(1);
      expect(component.giftBasket.data[0].id).toEqual(testid);
    });
  });

  describe('Method: clearGiftBasket', () => {
    beforeEach(() => {
      component.giftBasket = new MatTableDataSource<GiftBasketModel>();
      component.giftBasket.data = component.giftBasket.data = [
        {
          id: BigInt(1234),
          description: 'test description 1',
          quantity: 50,
          itemType: 'test type 1',
          edit: false,
        },
        {
          id: BigInt(4321),
          description: 'test description 2',
          quantity: 10,
          itemType: 'test type 2',
          edit: false,
        },
      ];
    });

    it('should empty gift basket data', () => {
      expect(component.giftBasket.data.length).toEqual(2);
      component.clearGiftBasket();

      expect(component.giftBasket.data.length).toEqual(0);
    });
  });

  describe('Method: isGiftBasketReady', () => {
    beforeEach(() => {
      // Set valid form data
      component.playerIdentities = [
        {
          query: { xuid: BigInt(123456789), t10Id: 'test-t10-id' },
          xuid: BigInt(123456789),
          t10Id: 'test-t10-id',
          gamertag: 'test-gamertag',
        },
      ];
      component.lspGroup = { id: 1, name: 'test-lsp-group' };
      component.giftBasket = new MatTableDataSource<GiftBasketModel>();
      component.giftBasket.data = component.giftBasket.data = [
        {
          id: BigInt(1234),
          description: 'test description 1',
          quantity: 50,
          itemType: 'test type 1',
          edit: false,
        },
        {
          id: BigInt(4321),
          description: 'test description 2',
          quantity: 10,
          itemType: 'test type 2',
          edit: false,
        },
      ];

      component.sendGiftForm = formBuilder.group({
        test: new FormControl('', Validators.required),
      });

      component.sendGiftForm.controls['test'].setValue('test value');
    });

    describe('If sendGiftForm is valid', () => {
      it('should return true', () => {
        const response = component.isGiftBasketReady();

        expect(response).toBeTruthy();
      });
    });

    describe('If sendGiftForm is invalid', () => {
      beforeEach(() => {
        component.sendGiftForm.controls['test'].setValue('');
      });

      it('should return false', () => {
        const response = component.isGiftBasketReady();

        expect(response).toBeFalsy();
      });
    });

    describe('If using player identities is true', () => {
      beforeEach(() => {
        component.usingPlayerIdentities = true;
      });

      describe('Player identities has content', () => {
        it('should return true', () => {
          const response = component.isGiftBasketReady();

          expect(response).toBeTruthy();
        });
      });

      describe('Player identities is empty', () => {
        beforeEach(() => {
          component.playerIdentities = [];
        });

        it('should return false', () => {
          const response = component.isGiftBasketReady();

          expect(response).toBeFalsy();
        });
      });
    });

    describe('If using player identities is false', () => {
      beforeEach(() => {
        component.usingPlayerIdentities = false;
      });

      describe('LspGroup has content', () => {
        it('should return true', () => {
          const response = component.isGiftBasketReady();

          expect(response).toBeTruthy();
        });
      });

      describe('LspGroup is empty', () => {
        beforeEach(() => {
          component.lspGroup = undefined;
        });

        it('should return false', () => {
          const response = component.isGiftBasketReady();

          expect(response).toBeFalsy();
        });
      });
    });

    describe('If gift basket has content', () => {
      it('should return true', () => {
        const response = component.isGiftBasketReady();

        expect(response).toBeTruthy();
      });
    });

    describe('If gift basket is empty', () => {
      beforeEach(() => {
        component.giftBasket.data = [];
      });

      it('should return false', () => {
        const response = component.isGiftBasketReady();

        expect(response).toBeFalsy();
      });
    });
  });
});
