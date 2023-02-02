import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { SteelheadUserFlagsComponent } from './steelhead-user-flags.component';
import faker from '@faker-js/faker';
import { SteelheadUserFlags } from '@models/steelhead';
import { createMockOldPermissionsService, OldPermissionsService } from '@services/old-permissions';
import { SteelheadPlayerFlagsService } from '@services/api-v2/steelhead/player/flags/steelhead-player-flags.service';
import { createMockSteelheadPlayerFlagsService } from '@services/api-v2/steelhead/player/flags/steelhead-player-flags.service.mock';
import { PipesModule } from '@shared/pipes/pipes.module';

describe('SteelheadUserFlagsComponent', () => {
  let component: SteelheadUserFlagsComponent;
  let fixture: ComponentFixture<SteelheadUserFlagsComponent>;

  let mockSteelheadPlayerFlagsService: SteelheadPlayerFlagsService;
  let mockPermissionsService: OldPermissionsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SteelheadUserFlagsComponent],
      imports: [PipesModule],
      providers: [createMockSteelheadPlayerFlagsService(), createMockOldPermissionsService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelheadUserFlagsComponent);
    component = fixture.componentInstance;
    mockSteelheadPlayerFlagsService = TestBed.inject(SteelheadPlayerFlagsService);
    mockPermissionsService = TestBed.inject(OldPermissionsService);

    mockPermissionsService.currentUserHasWritePermission = jasmine
      .createSpy('currentUserHasWritePermission ')
      .and.returnValue(true);
    fixture.detectChanges();
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('Method: ngOnChanges', () => {
    beforeEach(() => {
      component.getFlagsByXuid$ = jasmine.createSpy('getFlagsByXuid$').and.returnValue(of({}));
    });

    describe('When identity is undefined', () => {
      beforeEach(() => {
        component.identity = undefined;
      });

      it('should not call getFlagsByXuid$', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component.ngOnChanges(<any>{});

        expect(component.getFlagsByXuid$).not.toHaveBeenCalledTimes(1);
      });
    });

    describe('When identity is defined', () => {
      beforeEach(() => {
        component.identity = {
          query: undefined,
          gamertag: faker.name.firstName(),
          xuid: new BigNumber(faker.datatype.number({ min: 10_000, max: 500_000 })),
        };
      });

      it('should call getFlagsByXuid$', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component.ngOnChanges(<any>{});

        expect(component.getFlagsByXuid$).toHaveBeenCalledTimes(1);
      });

      describe('And getFlagsByXuid$ return valid response', () => {
        const flags = {
          isVip: faker.datatype.boolean(),
          isTurn10Employee: faker.datatype.boolean(),
          isEarlyAccess: faker.datatype.boolean(),
          isUnderReview: faker.datatype.boolean(),
        } as SteelheadUserFlags;

        beforeEach(() => {
          component.getFlagsByXuid$ = jasmine
            .createSpy('getFlagsByXuid$')
            .and.returnValue(of(flags));
        });

        it('should set currentFlags', () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component.ngOnChanges(<any>{});

          expect(component.currentFlags).toEqual(flags);
          expect(component.formControls.isVip.value).toEqual(flags.isVip);
          expect(component.formControls.isTurn10Employee.value).toEqual(flags.isTurn10Employee);
          expect(component.formControls.isEarlyAccess.value).toEqual(flags.isEarlyAccess);
          expect(component.formControls.isUnderReview.value).toEqual(flags.isUnderReview);
        });
      });

      describe('And getFlagsByXuid$ return error', () => {
        const error = { message: 'test error' };

        beforeEach(() => {
          component.getFlagsByXuid$ = jasmine
            .createSpy('getFlagsByXuid$')
            .and.returnValue(throwError(() => error));
        });

        it('should set error', () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component.ngOnChanges(<any>{});

          expect(component.currentFlags).toBeUndefined();
          expect(component.getFlagsActionMonitor.status.error).toEqual(error);
        });
      });
    });
  });

  describe('Method: getFlagsByXuid$', () => {
    beforeEach(() => {
      component.identity = {
        query: undefined,
        gamertag: faker.name.firstName(),
        xuid: new BigNumber(faker.datatype.number({ min: 10_000, max: 500_000 })),
      };
      mockSteelheadPlayerFlagsService.getFlagsByXuid$ = jasmine
        .createSpy('getFlagsByXuid$')
        .and.returnValue(of({}));
    });

    it('should call steelheadPlayerFlagsService.getFlagsByXuid', () => {
      const expectedXuid = component.identity.xuid;
      component.getFlagsByXuid$(component.identity.xuid);

      expect(mockSteelheadPlayerFlagsService.getFlagsByXuid$).toHaveBeenCalledTimes(1);
      expect(mockSteelheadPlayerFlagsService.getFlagsByXuid$).toHaveBeenCalledWith(expectedXuid);
    });
  });
});
