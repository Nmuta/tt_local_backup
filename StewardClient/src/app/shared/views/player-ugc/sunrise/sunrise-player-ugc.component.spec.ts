import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';
import * as faker from 'faker';
import { of, throwError } from 'rxjs';

import { BigJsonPipe } from '@shared/pipes/big-json.pipe';
import { SunrisePlayerUGCComponent } from './sunrise-player-ugc.component';
import { SunrisePlayerXuidUGCFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/ugc';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SunrisePlayerUGCComponent', () => {
  let component: SunrisePlayerUGCComponent;
  let fixture: ComponentFixture<SunrisePlayerUGCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatPaginatorModule, BrowserAnimationsModule],
      declarations: [SunrisePlayerUGCComponent, BigJsonPipe],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SunrisePlayerUGCComponent);
    component = fixture.componentInstance;
    component.usingIdentities = true;
  });

  it(
    'should create',
    waitForAsync(() => {
      expect(component).toBeTruthy();
    }),
  );

  describe('Method: ngOnChanges', () => {
    beforeEach(
      waitForAsync(() => {
        // emulate initialization event
        component.ngOnChanges();
      }),
    );

    it(
      'should skip undefined xuids',
      waitForAsync(() => {
        expect(component.getMonitor?.isActive).toBe(false);
        expect(component.getMonitor?.status?.error).toBeFalsy();
      }),
    );

    describe('And getPlayerUGC$ returns ugc', () => {
      const ugc = SunrisePlayerXuidUGCFakeApi.makeMany();
      beforeEach(() => {
        component.getPlayerUGC$ = jasmine.createSpy('getPlayerUGC$').and.returnValue(of(ugc));

        component.identity = {
          query: undefined,
          gamertag: faker.name.firstName(),
          xuid: new BigNumber(faker.datatype.number({ min: 10_000, max: 500_000 })),
        };
      });

      it('should set ugc', () => {
        component.ngOnChanges();

        expect(component.getPlayerUGC$).toHaveBeenCalled();
        expect(component.ugcContent).toBe(ugc);
        expect(component.getMonitor?.isActive).toBe(false);
        expect(component.getMonitor?.status?.error).toBeNull();
      });
    });

    describe('And getPlayerUGC$ returns with error', () => {
      const error = { message: faker.random.words(10) };
      beforeEach(() => {
        component.getPlayerUGC$ = jasmine
          .createSpy('getPlayerUGC$')
          .and.returnValue(throwError(error));

        component.identity = {
          query: undefined,
          gamertag: faker.name.firstName(),
          xuid: new BigNumber(faker.datatype.number({ min: 10_000, max: 500_000 })),
        };
      });

      it('should set error', () => {
        component.ngOnChanges();

        expect(component.getPlayerUGC$).toHaveBeenCalled();
        expect(component.ugcContent).toEqual([]);
        expect(component.getMonitor?.isActive).toBe(false);
        expect(component.getMonitor?.status?.error).toEqual(error);
      });
    });
  });
});
