import BigNumber from 'bignumber.js';
import { HttpErrorResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WoodstockPlayerXuidConsolesFakeApi } from '@interceptors/fake-api/apis/title/woodstock/player/xuid/consoleDetails';
import { WoodstockConsoleDetailsEntry } from '@models/woodstock/woodstock-console-details.model';
import { WoodstockService } from '@services/woodstock/woodstock.service';
import { createMockWoodstockService } from '@services/woodstock/woodstock.service.mock';
import _ from 'lodash';
import faker from '@faker-js/faker';
import { Subject } from 'rxjs';

import { WoodstockConsolesComponent } from './woodstock-consoles.component';
import { BigJsonPipe } from '@shared/pipes/big-json.pipe';
import { createMockPermissionsService, OldPermissionsService } from '@services/old-permissions';

describe('WoodstockConsolesComponent', () => {
  let component: WoodstockConsolesComponent;
  let fixture: ComponentFixture<WoodstockConsolesComponent>;

  let mockWoodstockService: WoodstockService;
  let mockPermissionsService: OldPermissionsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockConsolesComponent, BigJsonPipe],
      providers: [createMockWoodstockService(), createMockPermissionsService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockConsolesComponent);
    component = fixture.componentInstance;
    mockWoodstockService = TestBed.inject(WoodstockService);
    mockPermissionsService = TestBed.inject(OldPermissionsService);

    mockPermissionsService.currentUserHasWritePermission = jasmine
      .createSpy('currentUserHasWritePermission ')
      .and.returnValue(true);
    fixture.detectChanges();
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('valid initialization', () => {
    let consoleDetails$: Subject<WoodstockConsoleDetailsEntry[]> = undefined;
    let consoleDetailsValue: WoodstockConsoleDetailsEntry[] = undefined;
    let banStatus$: Subject<void> = undefined;

    beforeEach(waitForAsync(() => {
      // console details prep
      consoleDetails$ = new Subject<WoodstockConsoleDetailsEntry[]>();
      consoleDetailsValue =
        WoodstockPlayerXuidConsolesFakeApi.makeMany() as WoodstockConsoleDetailsEntry[];
      mockWoodstockService.getConsoleDetailsByXuid$ = jasmine
        .createSpy('getConsoleDetailsByXuid')
        .and.returnValue(consoleDetails$);

      // ban status prep
      banStatus$ = new Subject<void>();
      mockWoodstockService.putBanStatusByConsoleId$ = jasmine
        .createSpy('putBanStatusByConsoleId')
        .and.returnValue(banStatus$);

      // emulate initialization event
      component.ngOnChanges();
    }));

    describe('ngOnChanges', () => {
      it('should skip undefined xuids', waitForAsync(() => {
        expect(component.getConsoles?.isActive).toBe(false);
        expect(component.getConsoles?.status?.error).toBeUndefined();
      }));

      it('should update when xuid set', waitForAsync(async () => {
        // emulate xuid update event
        component.identity = {
          query: undefined,
          gamertag: faker.name.firstName(),
          xuid: new BigNumber(faker.datatype.number({ min: 10_000, max: 500_000 })),
        };
        component.ngOnChanges();

        // waiting on value
        fixture.detectChanges();
        expect(component.getConsoles?.isActive).toBe(true);

        // value received
        consoleDetails$.next(consoleDetailsValue);
        consoleDetails$.complete();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(component.getConsoles?.isActive).toBe(false);
        expect(component.getConsoles?.status?.error).toBeNull();
      }));

      it('should update when request errored', waitForAsync(async () => {
        // emulate xuid update event
        component.identity = {
          query: undefined,
          gamertag: faker.name.firstName(),
          xuid: new BigNumber(faker.datatype.number({ min: 10_000, max: 500_000 })),
        };
        component.ngOnChanges();

        // waiting on value
        fixture.detectChanges();
        expect(component.getConsoles?.isActive).toBe(true);

        // error received
        consoleDetails$.error(new HttpErrorResponse({ error: 'hello' }));
        await fixture.whenStable();
        fixture.detectChanges();
        expect(component.getConsoles?.isActive).toBe(false);
        expect(component.getConsoles?.status?.error).not.toBeNull();
      }));
    });

    describe('after xuid set', () => {
      let firstBanned: WoodstockConsoleDetailsEntry = undefined;
      let firstUnbanned: WoodstockConsoleDetailsEntry = undefined;

      beforeEach(waitForAsync(() => {
        // select a couple sample entries
        firstBanned = _(consoleDetailsValue)
          .filter(v => v.isBanned)
          .first();
        firstUnbanned = _(consoleDetailsValue)
          .filter(v => !v.isBanned)
          .first();

        // emulate xuid update event
        component.identity = {
          query: undefined,
          gamertag: faker.name.firstName(),
          xuid: new BigNumber(faker.datatype.number({ min: 10_000, max: 500_000 })),
        };
        component.ngOnChanges();

        // waiting on value
        fixture.detectChanges();
        expect(component.getConsoles?.isActive).toBe(true);

        // value received
        consoleDetails$.next(consoleDetailsValue);
        consoleDetails$.complete();
        fixture.detectChanges();
      }));

      describe('makeBanAction$', () => {
        it('should ban', waitForAsync(async () => {
          // create the ban action
          const banAction = component.makeBanAction$(firstUnbanned.consoleId);
          expect(banAction).toBeTruthy();
          await fixture.whenStable();

          // execute the ban action
          let isDone = false;
          const observable = banAction();
          observable.subscribe(() => (isDone = true));

          // emulate completion
          banStatus$.next();
          banStatus$.complete();
          await fixture.whenStable();
          expect(isDone).toBe(true);
          expect(firstUnbanned.isBanned).toBe(true);
        }));
      });

      describe('makeUnbanAction$', () => {
        it('should unban', waitForAsync(async () => {
          // create the ban action
          const banAction = component.makeUnbanAction$(firstBanned.consoleId);
          expect(banAction).toBeTruthy();
          await fixture.whenStable();

          // execute the ban action
          let isDone = false;
          const observable = banAction();
          observable.subscribe(() => (isDone = true));

          // emulate completion
          banStatus$.next();
          banStatus$.complete();
          await fixture.whenStable();
          expect(isDone).toBe(true);
          expect(firstUnbanned.isBanned).toBe(false);
        }));
      });
    });
  });
});
