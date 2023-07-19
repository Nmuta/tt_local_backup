import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import faker from '@faker-js/faker';
import { of, throwError } from 'rxjs';
import { BigJsonPipe } from '@shared/pipes/big-json.pipe';
import { SteelheadPlayerUgcComponent } from './steelhead-player-ugc.component';
import { SteelheadPlayerXuidUgcFakeApi } from '@interceptors/fake-api/apis/title/steelhead/player/xuid/ugc';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createMockSteelheadPlayerUgcService } from '@services/api-v2/steelhead/player/ugc/steelhead-player-ugc.service.mock';
import { createMockSteelheadUgcLookupService } from '@services/api-v2/steelhead/ugc/lookup/steelhead-ugc-lookup.service.mock';

describe('SteelheadPlayerUgcComponent', () => {
  let component: SteelheadPlayerUgcComponent;
  let fixture: ComponentFixture<SteelheadPlayerUgcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatPaginatorModule, BrowserAnimationsModule],
      declarations: [SteelheadPlayerUgcComponent, BigJsonPipe],
      providers: [createMockSteelheadPlayerUgcService(), createMockSteelheadUgcLookupService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SteelheadPlayerUgcComponent);
    component = fixture.componentInstance;
    component.usingIdentities = true;
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('Method: ngOnChanges', () => {
    beforeEach(waitForAsync(() => {
      // emulate initialization event
      component.ngOnChanges();
    }));

    it('should skip undefined xuids', waitForAsync(() => {
      expect(component.getMonitor?.isActive).toBe(false);
      expect(component.getMonitor?.status?.error).toBeFalsy();
    }));

    describe('And getPlayerUgc$ returns ugc', () => {
      const ugc = SteelheadPlayerXuidUgcFakeApi.makeMany();
      beforeEach(() => {
        component.getPlayerUgc$ = jasmine.createSpy('getPlayerUgc$').and.returnValue(of(ugc));

        component.identity = {
          query: undefined,
          gamertag: faker.name.firstName(),
          xuid: new BigNumber(faker.datatype.number({ min: 10_000, max: 500_000 })),
        };
      });

      it('should set ugc', () => {
        component.ngOnChanges();

        expect(component.getPlayerUgc$).toHaveBeenCalled();
        expect(component.ugcContent).toBe(ugc);
        expect(component.getMonitor?.isActive).toBe(false);
        expect(component.getMonitor?.status?.error).toBeNull();
      });
    });

    describe('And getPlayerUgc$ returns with error', () => {
      const error = { message: faker.random.words(10) };
      beforeEach(() => {
        component.getPlayerUgc$ = jasmine
          .createSpy('getPlayerUgc$')
          .and.returnValue(throwError(error));

        component.identity = {
          query: undefined,
          gamertag: faker.name.firstName(),
          xuid: new BigNumber(faker.datatype.number({ min: 10_000, max: 500_000 })),
        };
      });

      it('should set error', () => {
        component.ngOnChanges();

        expect(component.getPlayerUgc$).toHaveBeenCalled();
        expect(component.ugcContent).toEqual([]);
        expect(component.getMonitor?.isActive).toBe(false);
        expect(component.getMonitor?.status?.error).toEqual(error);
      });
    });
  });
});
