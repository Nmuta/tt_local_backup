import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SunriseProfileRollback } from '@models/sunrise';
import { SunriseService } from '@services/sunrise';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';
import faker from 'faker';
import { of, throwError } from 'rxjs';
import { SunriseProfileRollbacksComponent } from './sunrise-profile-rollbacks.component';

describe('SunriseProfileRollbacksComponent', () => {
  let component: SunriseProfileRollbacksComponent;
  let fixture: ComponentFixture<SunriseProfileRollbacksComponent>;

  let mockSunriseService: SunriseService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunriseProfileRollbacksComponent],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseProfileRollbacksComponent);
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
      component.getProfileRollbacksXuid$ = jasmine
        .createSpy('getProfileRollbacksXuid$')
        .and.returnValue(of({}));
    });

    describe('When identity is undefined', () => {
      beforeEach(() => {
        component.identity = undefined;
      });

      it('should not call getProfileRollbacksXuid$', () => {
        component.ngOnChanges();

        expect(component.getProfileRollbacksXuid$).not.toHaveBeenCalledTimes(1);
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

      it('should call getProfileRollbacksXuid$', () => {
        component.ngOnChanges();

        expect(component.getProfileRollbacksXuid$).toHaveBeenCalledTimes(1);
      });

      describe('And getProfileRollbacksXuid$ return valid response', () => {
        const profileRollbacks = [
          { dateUtc: faker.date.past(), author: 'System', details: faker.random.words(10) },
          { dateUtc: faker.date.past(), author: 'System', details: faker.random.words(10) },
        ] as SunriseProfileRollback[];

        beforeEach(() => {
          component.getProfileRollbacksXuid$ = jasmine
            .createSpy('getProfileRollbacksXuid$')
            .and.returnValue(of(profileRollbacks));
        });

        it('should set currentFlags', () => {
          component.ngOnChanges();

          expect(component.profileRollbacks).toEqual(profileRollbacks);
        });
      });

      describe('And getProfileRollbacksXuid$ return error', () => {
        const error = { message: 'test error' };

        beforeEach(() => {
          component.getProfileRollbacksXuid$ = jasmine
            .createSpy('getProfileRollbacksXuid$')
            .and.returnValue(throwError(error));
        });

        it('should set error', () => {
          component.ngOnChanges();

          expect(component.profileRollbacks).toBeUndefined();
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
      mockSunriseService.getProfileRollbacksXuid$ = jasmine
        .createSpy('getProfileRollbacksXuid$')
        .and.returnValue(of({}));
    });

    it('should call sunriseService.getProfileRollbacksXuid$', () => {
      const expectedXuid = component.identity.xuid;
      component.getProfileRollbacksXuid$(component.identity.xuid);

      expect(mockSunriseService.getProfileRollbacksXuid$).toHaveBeenCalledTimes(1);
      expect(mockSunriseService.getProfileRollbacksXuid$).toHaveBeenCalledWith(expectedXuid);
    });
  });
});
