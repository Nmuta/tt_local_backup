import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import faker from '@faker-js/faker';
import { UgcType } from '@models/ugc-filters';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { catchError, take } from 'rxjs/operators';
import { EMPTY, of, throwError } from 'rxjs';
import { LspGroup } from '@models/lsp-group';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { createMockBackgroundJobService } from '@services/background-job/background-job.service.mock';
import { BackgroundJob, BackgroundJobStatus } from '@models/background-job';
import { toDateTime } from '@helpers/luxon';
import { GiftResponse } from '@models/gift-response';
import BigNumber from 'bignumber.js';
import { GiftIdentityAntecedent } from '@shared/constants';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { PastableSingleInputComponent } from '@views/pastable-single-input/pastable-single-input.component';
import { WoodstockBulkGiftLiveryComponent } from './woodstock-bulk-gift-livery.component';
import { WoodstockPlayersGiftService } from '@services/api-v2/woodstock/players/gift/woodstock-players-gift.service';
import { createMockWoodstockPlayersGiftService } from '@services/api-v2/woodstock/players/gift/woodstock-player-gift.service.mock';
import { createMockWoodstockService, WoodstockService } from '@services/woodstock';
import { createMockWoodstockGroupGiftService } from '@services/api-v2/woodstock/group/gift/woodstock-group-gift.service.mock';
import { WoodstockGroupGiftService } from '@services/api-v2/woodstock/group/gift/woodstock-group-gift.service';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';

describe('WoodstockGiftLiveryComponent', () => {
  let fixture: ComponentFixture<WoodstockBulkGiftLiveryComponent>;
  let component: WoodstockBulkGiftLiveryComponent;

  let mockBackgroundJobService: BackgroundJobService;
  let mockWoodstockService: WoodstockService;
  let mockPlayerGiftService: WoodstockPlayersGiftService;
  let mockGroupGiftService: WoodstockGroupGiftService;

  const liveryIds = [faker.datatype.uuid(), faker.datatype.uuid()];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot(),
        ReactiveFormsModule,
      ],
      declarations: [WoodstockBulkGiftLiveryComponent, HumanizePipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        createMockBackgroundJobService(),
        createMockWoodstockPlayersGiftService(),
        createMockWoodstockGroupGiftService(),
        createMockWoodstockService(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WoodstockBulkGiftLiveryComponent);
    component = fixture.debugElement.componentInstance;
    component.liveryInput = new PastableSingleInputComponent();

    mockBackgroundJobService = TestBed.inject(BackgroundJobService);
    mockPlayerGiftService = TestBed.inject(WoodstockPlayersGiftService);
    mockGroupGiftService = TestBed.inject(WoodstockGroupGiftService);
    mockWoodstockService = TestBed.inject(WoodstockService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: getLivery$', () => {
    beforeEach(() => {
      mockWoodstockService.getPlayerUgcItem$ = jasmine
        .createSpy('getPlayerUgcItem$')
        .and.returnValue(of());
    });

    it('should call unriseService.getPlayerUgcItem$ with correct parmas', () => {
      component.service.getLivery$(liveryIds[0]);

      expect(mockWoodstockService.getPlayerUgcItem$).toHaveBeenCalledWith(
        liveryIds[0],
        UgcType.Livery,
      );
    });
  });

  describe('Method: giftLiveriesToPlayers$', () => {
    const xuids = [fakeBigNumber(), fakeBigNumber(), fakeBigNumber()];
    const giftReason = faker.random.words(5);
    const expireAfterDays = fakeBigNumber();

    beforeEach(() => {
      mockPlayerGiftService.giftLiveriesByXuids$ = jasmine
        .createSpy('giftLiveriesByXuids')
        .and.returnValue(of());
    });

    describe('If xuid list provided is null', () => {
      it('should throw error', () => {
        component.service
          .giftLiveriesToPlayers$(liveryIds, null, giftReason, expireAfterDays)
          .pipe(
            take(1),
            catchError(_error => {
              expect(true).toBeTruthy();
              return EMPTY;
            }),
          )
          .subscribe(() => {
            expect(true).toBeFalsy();
          });

        expect(mockPlayerGiftService.giftLiveriesByXuids$).not.toHaveBeenCalled();
      });
    });

    describe('If xuid list provided length is 0', () => {
      it('should throw error', () => {
        component.service
          .giftLiveriesToPlayers$(liveryIds, [], giftReason, expireAfterDays)
          .pipe(
            take(1),
            catchError(_error => {
              expect(true).toBeTruthy();
              return EMPTY;
            }),
          )
          .subscribe(() => {
            expect(true).toBeFalsy();
          });

        expect(mockPlayerGiftService.giftLiveriesByXuids$).not.toHaveBeenCalled();
      });
    });

    describe('If playerIdentities is valid', () => {
      it('should call unriseService.postGiftLiveryToPlayersUsingBackgroundJob with correct parmas', () => {
        component.service.giftLiveriesToPlayers$(liveryIds, xuids, giftReason, expireAfterDays);

        expect(mockPlayerGiftService.giftLiveriesByXuids$).toHaveBeenCalledWith(
          giftReason,
          liveryIds,
          xuids,
          expireAfterDays,
        );
      });
    });
  });

  describe('Method: giftLiveriesToLspGroup$', () => {
    const lspGroup = { id: fakeBigNumber(), name: faker.random.words(2) } as LspGroup;
    const giftReason = faker.random.words(5);
    const expireAfterDays = fakeBigNumber();

    beforeEach(() => {
      mockGroupGiftService.giftLiveriesByUserGroup$ = jasmine
        .createSpy('giftLiveriesByUserGroup$')
        .and.returnValue(of());
    });

    describe('If lsp group provided is null', () => {
      it('should throw error', () => {
        component.service
          .giftLiveriesToLspGroup$(liveryIds, null, giftReason, expireAfterDays)
          .pipe(
            take(1),
            catchError(_error => {
              expect(true).toBeTruthy();
              return EMPTY;
            }),
          )
          .subscribe(() => {
            expect(true).toBeFalsy();
          });

        expect(mockGroupGiftService.giftLiveriesByUserGroup$).not.toHaveBeenCalled();
      });
    });

    describe('If lsp group provided is valid', () => {
      it('should call GroupGiftService.giftLiveriesByUserGroup with correct parmas', () => {
        component.service.giftLiveriesToLspGroup$(liveryIds, lspGroup, giftReason, expireAfterDays);

        expect(mockGroupGiftService.giftLiveriesByUserGroup$).toHaveBeenCalledWith(
          giftReason,
          liveryIds,
          lspGroup.id,
          expireAfterDays,
        );
      });
    });
  });

  describe('Method: onLiveryIdChange', () => {
    const input = faker.random.word();
    const livery = { id: faker.datatype.uuid() } as PlayerUgcItem;

    beforeEach(() => {
      component.formControls.livery.setValue = jasmine
        .createSpy('formControls.livery.setValue')
        .and.callThrough();
      component.formControls.livery.reset = jasmine
        .createSpy('formControls.livery.reset')
        .and.callThrough();
      component.formControls.livery.setErrors = jasmine
        .createSpy('formControls.livery.setErrors')
        .and.callThrough();

      component.service.getLivery$ = jasmine.createSpy('getLivery$').and.returnValue(of(livery));
      component.getMonitor.monitorSingleFire = jasmine
        .createSpy('getMonitor.monitorSingleFire')
        .and.callThrough();

      component.liveries.unshift = jasmine.createSpy('liveries.unshift').and.callThrough();
    });

    it('should reset form controls', () => {
      component.onLiveryIdChange(input);

      expect(component.formControls.livery.reset).toHaveBeenCalled();
      expect(component.formControls.livery.setErrors).toHaveBeenCalled();
    });

    describe('When input is null', () => {
      it('should not call getLivery$', () => {
        component.onLiveryIdChange(null);

        expect(component.service.getLivery$).not.toHaveBeenCalled();
      });
    });

    describe('When input is valid', () => {
      it('should call getLivery$', () => {
        component.onLiveryIdChange(input);

        expect(component.service.getLivery$).toHaveBeenCalled();
      });

      describe('When getLivery$ throws error', () => {
        const error = { message: faker.random.words(5) };

        beforeEach(() => {
          component.service.getLivery$ = jasmine
            .createSpy('getLivery$')
            .and.returnValue(throwError(error));
        });

        it('should set error on form controls', () => {
          component.onLiveryIdChange(input);

          expect(component.formControls.livery.setErrors).toHaveBeenCalledWith({
            invalidId: true,
          });
          expect(component.formControls.livery.setValue).not.toHaveBeenCalled();
        });
      });

      describe('When getLivery$ is successful', () => {
        it('should add livery to list of liveries', () => {
          component.onLiveryIdChange(input);

          expect(component.liveries.unshift).toHaveBeenCalledWith(livery);
        });
      });
    });
  });

  describe('Method: sendGiftLivery', () => {
    beforeEach(() => {
      component.service.giftLiveriesToPlayers$ = jasmine
        .createSpy('giftLiveriesToPlayers$')
        .and.returnValue(of({ jobId: faker.datatype.uuid() } as BackgroundJob<void>));
      component.service.giftLiveriesToLspGroup$ = jasmine
        .createSpy('giftLiveriesToLspGroup$')
        .and.returnValue(
          of({
            playerOrLspGroup: fakeBigNumber(),
            identityAntecedent: GiftIdentityAntecedent.LspGroupId,
          } as GiftResponse<BigNumber>),
        );
    });

    describe('When isGiftLiveryReady return false', () => {
      beforeEach(() => {
        component.isGiftLiveryReady = jasmine.createSpy('isGiftLiveryReady').and.returnValue(false);
      });

      it('should not call either giftLiveryToPlayers or giftLiveryToLspGroup', () => {
        component.sendGiftLivery();

        expect(component.service.giftLiveriesToPlayers$).not.toHaveBeenCalled();
        expect(component.service.giftLiveriesToLspGroup$).not.toHaveBeenCalled();
      });
    });

    describe('When isGiftLiveryReady return true', () => {
      beforeEach(() => {
        component.isGiftLiveryReady = jasmine.createSpy('isGiftLiveryReady').and.returnValue(true);
      });

      describe('When usingPlayerIdentities is true', () => {
        beforeEach(() => {
          component.usingPlayerIdentities = true;
          component.playerIdentities = [{ query: undefined, xuid: fakeBigNumber() }];
          component.liveries = [{ id: faker.datatype.uuid() } as PlayerUgcItem];
        });

        it('should call giftLiveryToPlayers$', () => {
          component.sendGiftLivery();

          expect(component.service.giftLiveriesToPlayers$).toHaveBeenCalled();
          expect(component.service.giftLiveriesToLspGroup$).not.toHaveBeenCalled();
        });
      });

      describe('When usingPlayerIdentities is false', () => {
        beforeEach(() => {
          component.usingPlayerIdentities = false;
          component.lspGroup = { id: fakeBigNumber(), name: faker.random.words(3) } as LspGroup;
          component.liveries = [{ id: faker.datatype.uuid() } as PlayerUgcItem];
        });

        it('should call giftLiveryToLspGroup$', () => {
          component.sendGiftLivery();

          expect(component.service.giftLiveriesToPlayers$).not.toHaveBeenCalled();
          expect(component.service.giftLiveriesToLspGroup$).toHaveBeenCalled();
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

    let testMonitor: ActionMonitor;

    beforeEach(() => {
      testMonitor = new ActionMonitor('test monitor');

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
          component
            .waitForBackgroundJobToComplete(testJob)
            .pipe(
              catchError(error => {
                expect(testMonitor.status.error).toEqual(error);
                return EMPTY;
              }),
            )
            .subscribe(() => {
              expect(true).toBeFalsy();
            });
        });
      });

      describe('And a BackgroundJob is returned', () => {
        const testBackgroundJobResp: BackgroundJob<GiftResponse<BigNumber>[]> = {
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
              playerOrLspGroup: fakeBigNumber(),
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
            component.waitForBackgroundJobToComplete(testJob).subscribe(data => {
              expect(data).toEqual(testBackgroundJobResp.result);
            });
          });
        });
      });
    });
  });

  describe('Method: isGiftLiveryReady', () => {
    beforeEach(() => {
      // Set valid form data
      component.playerIdentities = [
        {
          query: { xuid: new BigNumber(123456789) },
          xuid: new BigNumber(123456789),
          gamertag: 'test-gamertag',
        },
      ];
      component.lspGroup = { id: new BigNumber(1), name: 'test-lsp-group' };

      const liveryId = faker.datatype.uuid();
      component.liveries = [{ id: liveryId } as PlayerUgcItem];
      component.formControls.giftReason.setValue(faker.random.words(5));
    });

    describe('If sendGiftForm is valid', () => {
      it('should return true', () => {
        const response = component.isGiftLiveryReady();

        expect(response).toBeTruthy();
      });
    });

    describe('If liveries array is empty', () => {
      beforeEach(() => {
        component.liveries = [];
      });

      it('should return false', () => {
        const response = component.isGiftLiveryReady();

        expect(response).toBeFalsy();
      });
    });

    describe('If using player identities is true', () => {
      beforeEach(() => {
        component.usingPlayerIdentities = true;
      });

      describe('Player identities has content', () => {
        it('should return true', () => {
          const response = component.isGiftLiveryReady();

          expect(response).toBeTruthy();
        });
      });

      describe('Player identities is empty', () => {
        beforeEach(() => {
          component.playerIdentities = [];
        });

        it('should return false', () => {
          const response = component.isGiftLiveryReady();

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
          const response = component.isGiftLiveryReady();

          expect(response).toBeTruthy();
        });
      });

      describe('LspGroup is empty', () => {
        beforeEach(() => {
          component.lspGroup = undefined;
        });

        it('should return false', () => {
          const response = component.isGiftLiveryReady();

          expect(response).toBeFalsy();
        });
      });
    });
  });

  describe('Method: resetTool', () => {
    const liveryId = faker.datatype.uuid();
    const livery = { id: liveryId } as PlayerUgcItem;
    const giftReason = faker.random.words(5);

    beforeEach(() => {
      component.giftResponse = [
        {
          playerOrLspGroup: fakeBigNumber(),
          identityAntecedent: GiftIdentityAntecedent.Xuid,
          errors: undefined,
        } as GiftResponse<BigNumber>,
      ];

      component.formControls.livery.setValue(livery);
      component.formControls.giftReason.setValue(giftReason);

      component.formGroup.reset = jasmine.createSpy('formGroup.reset');
    });

    it('Should clear giftResponse', () => {
      component.resetTool();

      expect(component.giftResponse).toBeUndefined();
    });

    describe('When clearLivery provided is false', () => {
      const clearLivery = false;

      it('Should not reset form controls', () => {
        component.resetTool(clearLivery);

        expect(component.formControls.livery.value).toEqual(livery);
        expect(component.formControls.giftReason.value).toEqual(giftReason);
        expect(component.formGroup.reset).not.toHaveBeenCalled();
      });
    });

    describe('When clearLivery provided is true', () => {
      const clearLivery = true;

      it('Should not reset form controls', () => {
        component.resetTool(clearLivery);

        expect(component.formControls.livery.value).toEqual(null);
        expect(component.formControls.giftReason.value).toEqual('');
        expect(component.formGroup.reset).toHaveBeenCalled();
      });
    });
  });
});
