import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WoodstockUserFlags } from '@models/woodstock';
import { WoodstockService } from '@services/woodstock';
import { createMockWoodstockService } from '@services/woodstock/woodstock.service.mock';
import faker from 'faker';
import { of, throwError } from 'rxjs';

import { WoodstockUserFlagsComponent } from './woodstock-user-flags.component';

describe('WoodstockUserFlagsComponent', () => {
  let component: WoodstockUserFlagsComponent;
  let fixture: ComponentFixture<WoodstockUserFlagsComponent>;

  let mockWoodstockService: WoodstockService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockUserFlagsComponent],
      providers: [createMockWoodstockService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockUserFlagsComponent);
    component = fixture.componentInstance;
    mockWoodstockService = TestBed.inject(WoodstockService);
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
        } as WoodstockUserFlags;

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
      mockWoodstockService.getFlagsByXuid = jasmine
        .createSpy('getFlagsByXuid')
        .and.returnValue(of({}));
    });

    it('should call woodstockService.getSharedConsoleUsersByXuid', () => {
      const expectedXuid = component.identity.xuid;
      component.getFlagsByXuid(component.identity.xuid);

      expect(mockWoodstockService.getFlagsByXuid).toHaveBeenCalledTimes(1);
      expect(mockWoodstockService.getFlagsByXuid).toHaveBeenCalledWith(expectedXuid);
    });
  });
});
