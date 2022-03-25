import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WoodstockService } from '@services/woodstock';
import { createMockWoodstockService } from '@services/woodstock/woodstock.service.mock';
import faker from '@faker-js/faker';
import { of, throwError } from 'rxjs';
import { WoodstockProfileNotesComponent } from './woodstock-profile-notes.component';
import { ProfileNote } from '@models/profile-note.model';
import { toDateTime } from '@helpers/luxon';

describe('WoodstockProfileNotesComponent', () => {
  let component: WoodstockProfileNotesComponent;
  let fixture: ComponentFixture<WoodstockProfileNotesComponent>;

  let mockWoodstockService: WoodstockService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockProfileNotesComponent],
      providers: [createMockWoodstockService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockProfileNotesComponent);
    component = fixture.componentInstance;
    mockWoodstockService = TestBed.inject(WoodstockService);
    fixture.detectChanges();
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('Method: ngOnChanges', () => {
    beforeEach(() => {
      component.getProfileNotesXuid$ = jasmine
        .createSpy('getProfileNotesXuid')
        .and.returnValue(of({}));
    });

    describe('When identity is undefined', () => {
      beforeEach(() => {
        component.identity = undefined;
      });

      it('should not call getProfileNotesXuid', () => {
        component.ngOnChanges();

        expect(component.getProfileNotesXuid$).not.toHaveBeenCalledTimes(1);
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

      it('should call getProfileNotesXuid', () => {
        component.ngOnChanges();

        expect(component.getProfileNotesXuid$).toHaveBeenCalledTimes(1);
      });

      describe('And getProfileNotesXuid return valid response', () => {
        const profileNotes = [
          {
            dateUtc: toDateTime(faker.date.past()),
            author: 'System',
            text: faker.random.words(10),
          },
          {
            dateUtc: toDateTime(faker.date.past()),
            author: 'System',
            text: faker.random.words(10),
          },
        ] as ProfileNote[];

        beforeEach(() => {
          component.getProfileNotesXuid$ = jasmine
            .createSpy('getProfileNotesXuid')
            .and.returnValue(of(profileNotes));
        });

        it('should set currentFlags', () => {
          component.ngOnChanges();

          expect(component.profileNotes).toEqual(profileNotes);
        });
      });

      describe('And getProfileNotesXuid return error', () => {
        const error = { message: 'test error' };

        beforeEach(() => {
          component.getProfileNotesXuid$ = jasmine
            .createSpy('getProfileNotesXuid')
            .and.returnValue(throwError(error));
        });

        it('should set error', () => {
          component.ngOnChanges();

          expect(component.profileNotes).toBeUndefined();
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
      mockWoodstockService.getProfileNotesXuid$ = jasmine
        .createSpy('getProfileNotesXuid')
        .and.returnValue(of({}));
    });

    it('should call woodstockService.getProfileNotesXuid', () => {
      const expectedXuid = component.identity.xuid;
      component.getProfileNotesXuid$(component.identity.xuid);

      expect(mockWoodstockService.getProfileNotesXuid$).toHaveBeenCalledTimes(1);
      expect(mockWoodstockService.getProfileNotesXuid$).toHaveBeenCalledWith(expectedXuid);
    });
  });
});
