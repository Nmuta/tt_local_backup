import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import faker from '@faker-js/faker';
import { of, throwError } from 'rxjs';

import { BigJsonPipe } from '@shared/pipes/big-json.pipe';
import { WoodstockPlayerXuidUgcFakeApi } from '@interceptors/fake-api/apis/title/woodstock/player/xuid/ugc';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WoodstockPlayerHiddenUgcComponent } from './woodstock-player-hidden-ugc.component';
import { createMockWoodstockPlayerUgcService } from '@services/api-v2/woodstock/player/ugc/woodstock-player-ugc.service.mock';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'WoodstockPlayerHiddenUgcComponent', () => {
  let component: WoodstockPlayerHiddenUgcComponent;
  let fixture: ComponentFixture<WoodstockPlayerHiddenUgcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [MatDialogModule, MatPaginatorModule, BrowserAnimationsModule],
        declarations: [WoodstockPlayerHiddenUgcComponent, BigJsonPipe],
        providers: [createMockWoodstockPlayerUgcService()],
        schemas: [NO_ERRORS_SCHEMA],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(WoodstockPlayerHiddenUgcComponent);
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
      const ugc = WoodstockPlayerXuidUgcFakeApi.makeMany();
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
