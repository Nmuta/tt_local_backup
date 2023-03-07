import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';
import faker from '@faker-js/faker';
import { of, throwError } from 'rxjs';

import { BigJsonPipe } from '@shared/pipes/big-json.pipe';
import { SunrisePlayerAuctionsComponent } from './sunrise-player-auctions.component';
import { SunrisePlayerXuidAuctionsFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/auctions';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';

describe('SunrisePlayerAuctionsComponent', () => {
  let component: SunrisePlayerAuctionsComponent;
  let fixture: ComponentFixture<SunrisePlayerAuctionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatPaginatorModule, BrowserAnimationsModule],
      declarations: [SunrisePlayerAuctionsComponent, BigJsonPipe, HumanizePipe],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SunrisePlayerAuctionsComponent);
    component = fixture.componentInstance;
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
      expect(component.isLoading).toBe(true);
      expect(component.loadError).toBeFalsy();
    }));

    describe('And getPlayerAuctionsByXuid$ returns auctions', () => {
      const auctions = SunrisePlayerXuidAuctionsFakeApi.makeMany();
      beforeEach(() => {
        component.getPlayerAuctionsByXuid$ = jasmine
          .createSpy('getPlayerAuctionsByXuid$')
          .and.returnValue(of(auctions));

        component.identity = {
          query: undefined,
          gamertag: faker.name.firstName(),
          xuid: new BigNumber(faker.datatype.number({ min: 10_000, max: 500_000 })),
        };
      });

      it('should set auctions', () => {
        component.ngOnChanges();

        expect(component.getPlayerAuctionsByXuid$).toHaveBeenCalled();
        expect(component.auctions.data).toBe(auctions);
        expect(component.isLoading).toBe(false);
        expect(component.loadError).toBeUndefined();
      });
    });

    describe('And getPlayerAuctionsByXuid$ returns with error', () => {
      const error = { message: faker.random.words(10) };
      beforeEach(() => {
        component.getPlayerAuctionsByXuid$ = jasmine
          .createSpy('getPlayerAuctionsByXuid$')
          .and.returnValue(throwError(error));

        component.identity = {
          query: undefined,
          gamertag: faker.name.firstName(),
          xuid: new BigNumber(faker.datatype.number({ min: 10_000, max: 500_000 })),
        };
      });

      it('should set error', () => {
        component.ngOnChanges();

        expect(component.getPlayerAuctionsByXuid$).toHaveBeenCalled();
        expect(component.auctions.data).toEqual([]);
        expect(component.isLoading).toBe(false);
        expect(component.loadError).toEqual(error);
      });
    });
  });
});
