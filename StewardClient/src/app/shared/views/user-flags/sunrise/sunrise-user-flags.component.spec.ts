import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SunriseUserFlags } from '@models/sunrise';
import { SunriseService } from '@services/sunrise';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';
import faker from 'faker';
import { of, throwError } from 'rxjs';

import { SunriseUserFlagsComponent } from './sunrise-user-flags.component';

describe('SunriseUserFlagsComponent', () => {
  let component: SunriseUserFlagsComponent;
  let fixture: ComponentFixture<SunriseUserFlagsComponent>;

  let mockSunriseService: SunriseService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunriseUserFlagsComponent],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseUserFlagsComponent);
    component = fixture.componentInstance;
    mockSunriseService = TestBed.inject(SunriseService);
    fixture.detectChanges();
  });

  it(
    'should create',
    waitForAsync(() => {
      expect(component).toBeTruthy();
    }),
  );

  describe('Method: ngOnChanges', () => {
    beforeEach(() => {
      component.getFlagsByXuid = jasmine.createSpy('getFlagsByXuid').and.returnValue(of({}));
    });

    describe('When identity is undefined', () => {
      beforeEach(() => {
        component.identity = undefined;
      });

      it('should not call getFlagsByXuid', () => {
        component.ngOnChanges();

        expect(component.getFlagsByXuid).not.toHaveBeenCalledTimes(1);
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

      it('should call getFlagsByXuid', () => {
        component.ngOnChanges();

        expect(component.getFlagsByXuid).toHaveBeenCalledTimes(1);
      });

      describe('And getFlagsByXuid return valid response', () => {
        const flags = {
          isVip: faker.datatype.boolean(),
          isUltimateVip: faker.datatype.boolean(),
          isTurn10Employee: faker.datatype.boolean(),
          isCommunityManager: faker.datatype.boolean(),
          isEarlyAccess: faker.datatype.boolean(),
          isUnderReview: faker.datatype.boolean(),
        } as SunriseUserFlags;

        beforeEach(() => {
          component.getFlagsByXuid = jasmine.createSpy('getFlagsByXuid').and.returnValue(of(flags));
        });

        it('should set currentFlags', () => {
          component.ngOnChanges();

          expect(component.currentFlags).toEqual(flags);
          expect(component.flags).toEqual(flags);
        });
      });

      describe('And getFlagsByXuid return error', () => {
        const error = { message: 'test error' };

        beforeEach(() => {
          component.getFlagsByXuid = jasmine
            .createSpy('getFlagsByXuid')
            .and.returnValue(throwError(error));
        });

        it('should set error', () => {
          component.ngOnChanges();

          expect(component.currentFlags).toBeUndefined();
          expect(component.flags).toBeUndefined();
          expect(component.loadError).toEqual(error);
        });
      });
    });
  });

  describe('Method: getFlagsByXuid', () => {
    beforeEach(() => {
      component.identity = {
        query: undefined,
        gamertag: faker.name.firstName(),
        xuid: new BigNumber(faker.datatype.number({ min: 10_000, max: 500_000 })),
      };
      mockSunriseService.getFlagsByXuid = jasmine
        .createSpy('getFlagsByXuid')
        .and.returnValue(of({}));
    });

    it('should call sunriseService.getSharedConsoleUsersByXuid', () => {
      const expectedXuid = component.identity.xuid;
      component.getFlagsByXuid(component.identity.xuid);

      expect(mockSunriseService.getFlagsByXuid).toHaveBeenCalledTimes(1);
      expect(mockSunriseService.getFlagsByXuid).toHaveBeenCalledWith(expectedXuid);
    });
  });
});
