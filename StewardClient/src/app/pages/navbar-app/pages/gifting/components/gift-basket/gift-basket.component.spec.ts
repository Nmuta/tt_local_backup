import { NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IdentityResultBeta } from '@models/identity-query.model';
import { GiftBasketBaseComponent, GiftBasketModel } from './gift-basket.base.component';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { of, throwError } from 'rxjs';
import { BackgroundJob, BackgroundJobStatus } from '@models/background-job';
import { GiftResponse } from '@models/gift-response';
import { GiftIdentityAntecedent } from '@shared/constants';
import { BackgroundJobService } from '@services/background-job/background-job.service';

describe('GiftBasketBaseComponent', () => {
  let fixture: ComponentFixture<GiftBasketBaseComponent<IdentityResultBeta>>;
  let component: GiftBasketBaseComponent<IdentityResultBeta>;

  const formBuilder: FormBuilder = new FormBuilder();

  let mockBackgroundJobService: BackgroundJobService;

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

      mockBackgroundJobService = TestBed.inject(BackgroundJobService);
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

  describe('Method: resetGiftBasketUI', () => {
    beforeEach(() => {
      component.sendGiftForm.controls['giftReason'].setValue('test value');
      component.isLoading = true;
      component.loadError = { foo: 'bar' };
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
      component.resetGiftBasketUI(true);

      expect(component.giftBasket.data.length).toEqual(0);
      expect(component.isLoading).toBeFalsy();
      expect(component.loadError).toBeUndefined();
      expect(component.sendGiftForm.controls['giftReason'].value).toBeNull();
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
      component.lspGroup = { id: BigInt(1), name: 'test-lsp-group' };
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

  describe('Method: sendGiftBasket', () => {
    beforeEach(() => {
      component.generateGiftInventoryFromGiftBasket = jasmine
        .createSpy('generateGiftInventoryFromGiftBasket')
        .and.returnValue(of({}));
      component.sendGiftToPlayers = jasmine.createSpy('sendGiftToPlayers').and.returnValue(of({}));
      component.sendGiftToLspGroup = jasmine
        .createSpy('sendGiftToLspGroup')
        .and.returnValue(of({}));

      component.usingPlayerIdentities = true;
    });

    it('should call generateGiftInventoryFromGiftBasket', () => {
      component.sendGiftBasket();

      expect(component.generateGiftInventoryFromGiftBasket).toHaveBeenCalled();
    });

    describe('If usingPlayerIdentities is true', () => {
      it('should call sendGiftToPlayers', () => {
        component.usingPlayerIdentities = true;
        component.sendGiftBasket();

        expect(component.sendGiftToPlayers).toHaveBeenCalled();
      });
    });

    describe('If usingPlayerIdentities is false', () => {
      it('should call sendGiftToLspGroup', () => {
        component.usingPlayerIdentities = false;
        component.sendGiftBasket();

        expect(component.sendGiftToLspGroup).toHaveBeenCalled();
      });
    });

    describe('When subscribing to the send gift observable', () => {
      describe('And an error is caught', () => {
        const error = { message: 'error-message' };
        beforeEach(() => {
          component.sendGiftToPlayers = jasmine
            .createSpy('sendGiftToPlayers')
            .and.returnValue(throwError(error));
        });

        it('should set loadError on component', () => {
          component.sendGiftBasket();

          expect(component.loadError).toEqual(error);
          expect(component.isLoading).toBeFalsy();
        });
      });

      describe('And a BackgoundTask is returned', () => {
        const jobId = 'test-job-id';
        beforeEach(() => {
          component.usingPlayerIdentities = true;
          component.sendGiftToPlayers = jasmine
            .createSpy('sendGiftToPlayers')
            .and.returnValue(of({ jobId: jobId } as BackgroundJob<void>));
          component.waitForBackgroundJobToComplete = jasmine.createSpy(
            'waitForBackgroundJobToComplete',
          );
        });

        it('should call waitForBackgroundJobToComplete', () => {
          component.sendGiftBasket();

          expect(component.waitForBackgroundJobToComplete).toHaveBeenCalled();
        });

        fit('should not set giftResponse', () => {
          component.sendGiftBasket();

          expect(component.giftResponse).toBeUndefined();
        });
      });

      describe('And a GiftResponse is returned', () => {
        const testGiftResponse = {
          playerOrLspGroup: BigInt(11234567890),
          identityAntecedent: GiftIdentityAntecedent.LspGroupId,
        } as GiftResponse<bigint>;
        beforeEach(() => {
          component.sendGiftToPlayers = jasmine
            .createSpy('sendGiftToPlayers')
            .and.returnValue(of(testGiftResponse));
          component.waitForBackgroundJobToComplete = jasmine.createSpy(
            'waitForBackgroundJobToComplete',
          );
        });

        it('should not call waitForBackgroundJobToComplete', () => {
          component.sendGiftBasket();

          expect(component.waitForBackgroundJobToComplete).not.toHaveBeenCalled();
        });

        it('should set giftResponse', () => {
          component.sendGiftBasket();

          expect(component.giftResponse).toEqual([testGiftResponse]);
        });
      });
    });
  });

  describe('Method: waitForBackgroundJobToComplete', () => {
    const testJob: BackgroundJob<void> = {
      jobId: 'test=-job-id',
      status: BackgroundJobStatus.InProgress,
      result: undefined,
      parsedResult: undefined,
    };

    beforeEach(() => {
      mockBackgroundJobService.getBackgroundJob = jasmine
        .createSpy('getBackgroundJob')
        .and.returnValue(of({}));
    });

    it('should call BackgroundJobService.getBackgroundJob with correct job id', () => {
      component.waitForBackgroundJobToComplete(testJob);

      expect(mockBackgroundJobService.getBackgroundJob).toHaveBeenCalledWith(testJob.jobId);
    });

    describe('When subscribing to the send gift observable', () => {
      describe('And an error is caught', () => {
        const error = { message: 'error-message' };
        beforeEach(() => {
          mockBackgroundJobService.getBackgroundJob = jasmine
            .createSpy('getBackgroundJob')
            .and.returnValue(throwError(error));
        });

        it('should set loadError on component', () => {
          component.waitForBackgroundJobToComplete(testJob);

          expect(component.loadError).toEqual(error);
          expect(component.isLoading).toBeFalsy();
        });
      });

      describe('And a BackgroundJob is returned', () => {
        const testBackgroundJobResp: BackgroundJob<GiftResponse<string | bigint>[]> = {
          jobId: 'test=-job-id',
          status: BackgroundJobStatus.InProgress,
          result: 'result',
          parsedResult: [
            {
              playerOrLspGroup: 'testing123',
              identityAntecedent: GiftIdentityAntecedent.LspGroupId,
              error: undefined,
            },
          ],
        };
        beforeEach(() => {
          mockBackgroundJobService.getBackgroundJob = jasmine
            .createSpy('getBackgroundJob')
            .and.returnValue(of(testBackgroundJobResp));
        });

        describe('with a status of complete', () => {
          it('should set gift response', () => {
            testBackgroundJobResp.status = BackgroundJobStatus.Completed;
            component.waitForBackgroundJobToComplete(testJob);

            expect(component.giftResponse).toEqual(testBackgroundJobResp.parsedResult);
          });
        });
      });
    });
  });
});
