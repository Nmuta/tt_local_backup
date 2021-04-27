import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SunriseSharedConsoleUser } from '@models/sunrise';
import { SunriseService } from '@services/sunrise';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';
import faker from 'faker';
import { of, throwError } from 'rxjs';

import { SunriseGamertagsComponent } from './sunrise-gamertags.component';

describe('SunriseGamertagsComponent', () => {
  let component: SunriseGamertagsComponent;
  let fixture: ComponentFixture<SunriseGamertagsComponent>;

  let mockSunriseService: SunriseService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunriseGamertagsComponent],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseGamertagsComponent);
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
      component.getSharedConsoleUsersByXuid = jasmine
        .createSpy('getSharedConsoleUsersByXuid')
        .and.returnValue(of({}));
    });

    describe('When identity is undefined', () => {
      beforeEach(() => {
        component.identity = undefined;
      });

      it('should not call getSharedConsoleUsersByXuid', () => {
        component.ngOnChanges();

        expect(component.getSharedConsoleUsersByXuid).not.toHaveBeenCalledTimes(1);
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

      it('should call getSharedConsoleUsersByXuid', () => {
        component.ngOnChanges();

        expect(component.getSharedConsoleUsersByXuid).toHaveBeenCalledTimes(1);
      });

      describe('And getSharedConsoleUsersByXuid return valid response', () => {
        const relatedGamertags = [
          {
            sharedConsoleId: new BigNumber(faker.datatype.number()),
            xuid: new BigNumber(faker.datatype.number()),
            gamertag: faker.random.word(),
            everBanned: faker.datatype.boolean(),
          },
        ] as SunriseSharedConsoleUser[];

        beforeEach(() => {
          component.getSharedConsoleUsersByXuid = jasmine
            .createSpy('getSharedConsoleUsersByXuid')
            .and.returnValue(of(relatedGamertags));
        });

        it('should set sharedConsoleUsers', () => {
          component.ngOnChanges();

          expect(component.sharedConsoleUsers).toEqual(relatedGamertags);
        });
      });

      describe('And getSharedConsoleUsersByXuid return error', () => {
        const error = { message: 'test error' };

        beforeEach(() => {
          component.getSharedConsoleUsersByXuid = jasmine
            .createSpy('getSharedConsoleUsersByXuid')
            .and.returnValue(throwError(error));
        });

        it('should set error', () => {
          component.ngOnChanges();

          expect(component.sharedConsoleUsers).toBeUndefined();
          expect(component.loadError).toEqual(error);
        });
      });
    });
  });

  describe('Method: getSharedConsoleUsersByXuid', () => {
    beforeEach(() => {
      component.identity = {
        query: undefined,
        gamertag: faker.name.firstName(),
        xuid: new BigNumber(faker.datatype.number({ min: 10_000, max: 500_000 })),
      };
      mockSunriseService.getSharedConsoleUsersByXuid = jasmine
        .createSpy('getSharedConsoleUsersByXuid')
        .and.returnValue(of({}));
    });

    it('should call sunriseService.getSharedConsoleUsersByXuid', () => {
      const expectedXuid = component.identity.xuid;
      component.getSharedConsoleUsersByXuid(component.identity.xuid);

      expect(mockSunriseService.getSharedConsoleUsersByXuid).toHaveBeenCalledTimes(1);
      expect(mockSunriseService.getSharedConsoleUsersByXuid).toHaveBeenCalledWith(expectedXuid);
    });
  });
});
