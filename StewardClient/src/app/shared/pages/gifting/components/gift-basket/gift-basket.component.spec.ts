import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { NgxsModule, Store } from '@ngxs/store';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IdentityResultBeta } from '@models/identity-query.model';
import { GiftBasketBaseComponent, GiftBasketModel, GiftReason } from './gift-basket.base.component';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { of, throwError } from 'rxjs';
import { BackgroundJob, BackgroundJobStatus } from '@models/background-job';
import { GiftResponse } from '@models/gift-response';
import { GiftIdentityAntecedent } from '@shared/constants';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { SunriseMasterInventory } from '@models/sunrise';
import { MatSelectChange } from '@angular/material/select';
import faker from 'faker';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { toDateTime } from '@helpers/luxon';

describe('GiftBasketBaseComponent', () => {
  let fixture: ComponentFixture<GiftBasketBaseComponent<
    IdentityResultBeta,
    SunriseMasterInventory
  >>;
  let component: GiftBasketBaseComponent<IdentityResultBeta, SunriseMasterInventory>;

  const formBuilder: FormBuilder = new FormBuilder();

  let mockBackgroundJobService: BackgroundJobService;
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
        declarations: [GiftBasketBaseComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(
        GiftBasketBaseComponent as Type<
          GiftBasketBaseComponent<IdentityResultBeta, SunriseMasterInventory>
        >,
      );
      component = fixture.debugElement.componentInstance;

      mockBackgroundJobService = TestBed.inject(BackgroundJobService);
      mockStore = TestBed.inject(Store);

      component.setStateGiftBasket = jasmine.createSpy('setStateGiftBasket');
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: giftReasonChanged', () => {
    const testUserModel: UserModel = {
      name: faker.name.firstName(),
      emailAddress: 'fakeemail@microsoft.com',
      role: UserRole.LiveOpsAdmin,
      objectId: `${faker.datatype.uuid()}`,
    };

    beforeEach(() => {
      mockStore.selectSnapshot = jasmine.createSpy('selectSnapshot').and.returnValue(testUserModel);
      component.setStateGiftBasket = jasmine.createSpy('setStateGiftBasket');
      component.ignoreMaxCreditLimit = false;
      component.profile = undefined;
    });

    describe('When event param is null', () => {
      it('should do nothing', () => {
        component.giftReasonChanged(null);

        expect(component.ignoreMaxCreditLimit).toBeFalsy();
        expect(component.profile).toBeUndefined();
        expect(mockStore.selectSnapshot).not.toHaveBeenCalled();
        expect(component.setStateGiftBasket).not.toHaveBeenCalled();
      });
    });

    describe('When event param is valid', () => {
      const giftReasonEvent: MatSelectChange = { source: undefined, value: GiftReason.LostSave };

      describe('When profile is undefined', () => {
        beforeEach(() => {
          component.profile = undefined;
        });

        it('should get and set profile', () => {
          component.giftReasonChanged(giftReasonEvent);

          expect(component.profile).not.toBeUndefined();
          expect(component.profile).toEqual(testUserModel);
          expect(mockStore.selectSnapshot).toHaveBeenCalled();
        });

        it('should call setStateGiftBasket', () => {
          component.giftReasonChanged(giftReasonEvent);

          expect(component.setStateGiftBasket).toHaveBeenCalled();
        });
      });

      describe('When profile is defined', () => {
        const testUserModel2: UserModel = {
          name: faker.name.firstName(),
          emailAddress: 'fakeemail2@microsoft.com',
          role: UserRole.SupportAgentAdmin,
          objectId: `${faker.datatype.uuid()}`,
        };

        beforeEach(() => {
          component.profile = testUserModel2;
        });

        it('should not call and set profile', () => {
          component.giftReasonChanged(giftReasonEvent);

          expect(component.profile).not.toBeUndefined();
          expect(component.profile).toEqual(testUserModel2);
          expect(mockStore.selectSnapshot).not.toHaveBeenCalled();
        });
      });

      describe('When gift reason is "Lost Save"', () => {
        beforeEach(() => {
          giftReasonEvent.value = GiftReason.LostSave;
          component.profile = {
            name: faker.name.firstName(),
            emailAddress: 'fakeemail@microsoft.com',
            role: UserRole.LiveOpsAdmin,
            objectId: `${faker.datatype.uuid()}`,
          };
        });

        describe('And when user role is LiveOpsAdmin', () => {
          beforeEach(() => {
            component.profile.role = UserRole.LiveOpsAdmin;
          });

          it('should set ignoreMaxCreditLimit to true', () => {
            component.giftReasonChanged(giftReasonEvent);

            expect(component.ignoreMaxCreditLimit).toBeTruthy();
          });
        });

        describe('And when user role is SupportAgentAdmin', () => {
          beforeEach(() => {
            component.profile.role = UserRole.SupportAgentAdmin;
          });

          it('should set ignoreMaxCreditLimit to true', () => {
            component.giftReasonChanged(giftReasonEvent);

            expect(component.ignoreMaxCreditLimit).toBeTruthy();
          });
        });

        describe('And when user role is SupportAgent', () => {
          beforeEach(() => {
            component.profile.role = UserRole.SupportAgent;
          });

          it('should set ignoreMaxCreditLimit to false', () => {
            component.giftReasonChanged(giftReasonEvent);

            expect(component.ignoreMaxCreditLimit).toBeFalsy();
          });
        });
      });

      describe('When gift reason is not "Lost Save"', () => {
        beforeEach(() => {
          giftReasonEvent.value = GiftReason.CommunityGift;
          component.profile = {
            name: faker.name.firstName(),
            emailAddress: 'fakeemail@microsoft.com',
            role: UserRole.LiveOpsAdmin,
            objectId: `${faker.datatype.uuid()}`,
          };
        });

        it('should set ignoreMaxCreditLimit to false', () => {
          component.giftReasonChanged(giftReasonEvent);

          expect(component.ignoreMaxCreditLimit).toBeFalsy();
        });
      });
    });
  });

  describe('Method: addItemtoBasket', () => {
    let testItemNew: GiftBasketModel;

    beforeEach(() => {
      testItemNew = {
        id: new BigNumber(1234),
        description: 'test description',
        quantity: 10,
        itemType: 'test type',
        edit: false,
        error: undefined,
      };
    });

    describe('If item ID doesnt exist in the gift basket', () => {
      beforeEach(() => {
        component.giftBasket = new MatTableDataSource<GiftBasketModel>();
      });

      it('should add the item to the gift basket', () => {
        component.addItemtoBasket(testItemNew);

        expect(component.setStateGiftBasket).toHaveBeenCalledWith([testItemNew]);
      });
    });

    describe('If the item ID exists in the gift basket', () => {
      beforeEach(() => {
        component.giftBasket = new MatTableDataSource<GiftBasketModel>();
        component.giftBasket.data = [
          {
            id: new BigNumber(1234),
            description: 'test description',
            quantity: 50,
            itemType: 'test type',
            edit: false,
            error: undefined,
          },
        ];
      });

      it('should update the existing gift basket item with the new quantity + old quantity', () => {
        component.addItemtoBasket(testItemNew);

        const expectedObject = component.giftBasket.data;
        expectedObject[0].quantity += testItemNew.quantity;
        expect(component.setStateGiftBasket).toHaveBeenCalledWith(expectedObject);
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
          id: new BigNumber(1234),
          description: 'test description',
          quantity: 50,
          itemType: 'test type',
          edit: false,
          error: undefined,
        },
      ];
    });

    it('should set the item quantity to the new value', () => {
      const expectedObject = component.giftBasket.data;
      expectedObject[0].quantity = testItemQuantity;

      component.editItemQuantity(0);

      expect(component.setStateGiftBasket).toHaveBeenCalledWith(expectedObject);
    });
  });

  describe('Method: removeItemFromGiftBasket', () => {
    const testid = new BigNumber(4321);
    beforeEach(() => {
      component.giftBasket = new MatTableDataSource<GiftBasketModel>();
      component.giftBasket.data = [
        {
          id: new BigNumber(1234),
          description: 'test description 1',
          quantity: 50,
          itemType: 'test type 1',
          edit: false,
          error: undefined,
        },
        {
          id: testid,
          description: 'test description 2',
          quantity: 10,
          itemType: 'test type 2',
          edit: false,
          error: undefined,
        },
      ];
    });

    it('should remove the given index from the gift basket', () => {
      const expectedObject = component.giftBasket.data;
      expectedObject.splice(0, 1);
      component.removeItemFromGiftBasket(0);

      expect(component.setStateGiftBasket).toHaveBeenCalledWith(expectedObject);
    });
  });

  describe('Method: resetGiftBasketUI', () => {
    beforeEach(() => {
      component.sendGiftForm.controls['giftReason'].setValue('test value');
      component.giftResponse = [];
      component.isLoading = true;
      component.loadError = { foo: 'bar' };
      component.giftBasket = new MatTableDataSource<GiftBasketModel>();
      component.giftBasket.data = component.giftBasket.data = [
        {
          id: new BigNumber(1234),
          description: 'test description 1',
          quantity: 50,
          itemType: 'test type 1',
          edit: false,
          error: undefined,
        },
        {
          id: new BigNumber(4321),
          description: 'test description 2',
          quantity: 10,
          itemType: 'test type 2',
          edit: false,
          error: undefined,
        },
      ];
    });

    describe('When clearItemsInBasket is set to false', () => {
      it('should empty gift basket data', () => {
        expect(component.giftBasket.data.length).toEqual(2);
        component.resetGiftBasketUI(false);

        expect(component.isLoading).toBeFalsy();
        expect(component.loadError).toBeUndefined();
        expect(component.giftResponse).toBeUndefined();
        expect(component.setStateGiftBasket).not.toHaveBeenCalledWith([]);
        expect(component.sendGiftForm.controls['giftReason'].value).not.toBeNull();
      });
    });

    describe('When clearItemsInBasket is set to true', () => {
      it('should empty gift basket data', () => {
        expect(component.giftBasket.data.length).toEqual(2);
        component.resetGiftBasketUI(true);

        expect(component.isLoading).toBeFalsy();
        expect(component.loadError).toBeUndefined();
        expect(component.giftResponse).toBeUndefined();
        expect(component.setStateGiftBasket).toHaveBeenCalledWith([]);
        expect(component.sendGiftForm.controls['giftReason'].value).toBeNull();
      });
    });
  });

  describe('Method: isGiftBasketReady', () => {
    beforeEach(() => {
      // Set valid form data
      component.playerIdentities = [
        {
          query: { xuid: new BigNumber(123456789), t10Id: 'test-t10-id' },
          xuid: new BigNumber(123456789),
          t10Id: 'test-t10-id',
          gamertag: 'test-gamertag',
        },
      ];
      component.lspGroup = { id: new BigNumber(1), name: 'test-lsp-group' };
      component.giftBasket = new MatTableDataSource<GiftBasketModel>();
      component.giftBasket.data = component.giftBasket.data = [
        {
          id: new BigNumber(1234),
          description: 'test description 1',
          quantity: 50,
          itemType: 'test type 1',
          edit: false,
          error: undefined,
        },
        {
          id: new BigNumber(4321),
          description: 'test description 2',
          quantity: 10,
          itemType: 'test type 2',
          edit: false,
          error: undefined,
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
      component.sendGiftToPlayers$ = jasmine
        .createSpy('sendGiftToPlayers$')
        .and.returnValue(of({}));
      component.sendGiftToLspGroup$ = jasmine
        .createSpy('sendGiftToLspGroup$')
        .and.returnValue(of({}));

      component.usingPlayerIdentities = true;
    });

    it('should call generateGiftInventoryFromGiftBasket', () => {
      component.sendGiftBasket();

      expect(component.generateGiftInventoryFromGiftBasket).toHaveBeenCalled();
    });

    describe('If usingPlayerIdentities is true', () => {
      it('should call sendGiftToPlayers$', () => {
        component.usingPlayerIdentities = true;
        component.sendGiftBasket();

        expect(component.sendGiftToPlayers$).toHaveBeenCalled();
      });
    });

    describe('If usingPlayerIdentities is false', () => {
      it('should call sendGiftToLspGroup$', () => {
        component.usingPlayerIdentities = false;
        component.sendGiftBasket();

        expect(component.sendGiftToLspGroup$).toHaveBeenCalled();
      });
    });

    describe('When subscribing to the send gift observable', () => {
      describe('And an error is caught', () => {
        const error = { message: 'error-message' };
        beforeEach(() => {
          component.sendGiftToPlayers$ = jasmine
            .createSpy('sendGiftToPlayers$')
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
          component.sendGiftToPlayers$ = jasmine
            .createSpy('sendGiftToPlayers$')
            .and.returnValue(of({ jobId: jobId } as BackgroundJob<void>));
          component.waitForBackgroundJobToComplete = jasmine.createSpy(
            'waitForBackgroundJobToComplete',
          );
        });

        it('should call waitForBackgroundJobToComplete', () => {
          component.sendGiftBasket();

          expect(component.waitForBackgroundJobToComplete).toHaveBeenCalled();
        });

        it('should not set giftResponse', () => {
          component.sendGiftBasket();

          expect(component.giftResponse).toBeUndefined();
        });
      });

      describe('And a GiftResponse is returned', () => {
        const testGiftResponse = {
          playerOrLspGroup: new BigNumber(11234567890),
          identityAntecedent: GiftIdentityAntecedent.LspGroupId,
        } as GiftResponse<BigNumber>;
        beforeEach(() => {
          component.sendGiftToPlayers$ = jasmine
            .createSpy('sendGiftToPlayers$')
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
      createdDateUtc: toDateTime(faker.date.past()),
      userId: faker.datatype.uuid(),
      jobId: 'test=-job-id',
      status: BackgroundJobStatus.InProgress,
      rawResult: undefined,
      result: undefined,
      isMarkingRead: false,
      isRead: false,
      reason: 'test',
    };

    beforeEach(() => {
      mockBackgroundJobService.getBackgroundJob$ = jasmine
        .createSpy('getBackgroundJob')
        .and.returnValue(of({}));
    });

    it('should call BackgroundJobService.getBackgroundJob with correct job id', () => {
      component.waitForBackgroundJobToComplete(testJob);

      expect(mockBackgroundJobService.getBackgroundJob$).toHaveBeenCalledWith(testJob.jobId);
    });

    describe('When subscribing to the send gift observable', () => {
      describe('And an error is caught', () => {
        const error = { message: 'error-message' };
        beforeEach(() => {
          mockBackgroundJobService.getBackgroundJob$ = jasmine
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
        const testBackgroundJobResp: BackgroundJob<GiftResponse<string | BigNumber>[]> = {
          createdDateUtc: toDateTime(faker.date.past()),
          userId: faker.datatype.uuid(),
          jobId: 'test=-job-id',
          status: BackgroundJobStatus.InProgress,
          rawResult: {
            PlayerOrLspGroup: 'testing123',
            identityAntecedent: GiftIdentityAntecedent.LspGroupId,
            error: undefined,
          },
          result: [
            {
              playerOrLspGroup: 'testing123',
              identityAntecedent: GiftIdentityAntecedent.LspGroupId,
              errors: undefined,
            },
          ],
          isMarkingRead: false,
          isRead: false,
          reason: 'test',
        };
        beforeEach(() => {
          mockBackgroundJobService.getBackgroundJob$ = jasmine
            .createSpy('getBackgroundJob')
            .and.returnValue(of(testBackgroundJobResp));
        });

        describe('with a status of complete', () => {
          it('should set gift response', () => {
            testBackgroundJobResp.status = BackgroundJobStatus.Completed;
            component.waitForBackgroundJobToComplete(testJob);

            expect(component.giftResponse).toEqual(testBackgroundJobResp.result);
          });
        });
      });
    });
  });
});
