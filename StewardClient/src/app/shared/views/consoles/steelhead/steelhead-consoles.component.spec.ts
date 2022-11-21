import BigNumber from 'bignumber.js';
import { HttpErrorResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SunrisePlayerXuidConsolesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/consoleDetails';
import faker from '@faker-js/faker';
import { Subject } from 'rxjs';
import _ from 'lodash';
import { BigJsonPipe } from '@shared/pipes/big-json.pipe';
import { SteelheadConsolesComponent } from './steelhead-consoles.component';
import { SteelheadConsoleDetailsEntry } from '@models/steelhead';
import { createMockPermissionsService, PermissionsService } from '@services/permissions';
import { SteelheadPlayerConsolesService } from '@services/api-v2/steelhead/player/consoles/steelhead-player-consoles.service';
import { createMockSteelheadConsolesService } from '@services/api-v2/steelhead/consoles/steelhead-consoles.service.mock';
import { createMockSteelheadPlayerConsolesService } from '@services/api-v2/steelhead/player/consoles/steelhead-player-consoles.service.mock';
import { SteelheadConsolesService } from '@services/api-v2/steelhead/consoles/steelhead-consoles.service';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';

describe('SteelheadConsolesComponent', () => {
  let component: SteelheadConsolesComponent;
  let fixture: ComponentFixture<SteelheadConsolesComponent>;

  let mockSteelheadPlayerConsolesService: SteelheadPlayerConsolesService;
  let mockSteelheadConsolesService: SteelheadConsolesService;
  let mockPermissionsService: PermissionsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SteelheadConsolesComponent, BigJsonPipe, HumanizePipe],
      providers: [
        createMockSteelheadPlayerConsolesService(),
        createMockSteelheadConsolesService(),
        createMockPermissionsService(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelheadConsolesComponent);
    component = fixture.componentInstance;
    mockSteelheadPlayerConsolesService = TestBed.inject(SteelheadPlayerConsolesService);
    mockSteelheadConsolesService = TestBed.inject(SteelheadConsolesService);
    mockPermissionsService = TestBed.inject(PermissionsService);

    mockPermissionsService.currentUserHasWritePermission = jasmine
      .createSpy('currentUserHasWritePermission ')
      .and.returnValue(true);
    fixture.detectChanges();
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('valid initialization', () => {
    let consoleDetails$: Subject<SteelheadConsoleDetailsEntry[]> = undefined;
    let consoleDetailsValue: SteelheadConsoleDetailsEntry[] = undefined;
    let banStatus$: Subject<void> = undefined;

    beforeEach(waitForAsync(() => {
      // console details prep
      consoleDetails$ = new Subject<SteelheadConsoleDetailsEntry[]>();
      consoleDetailsValue =
        SunrisePlayerXuidConsolesFakeApi.makeMany() as SteelheadConsoleDetailsEntry[];
      mockSteelheadPlayerConsolesService.getConsoleDetailsByXuid$ = jasmine
        .createSpy('getConsoleDetailsByXuid$')
        .and.returnValue(consoleDetails$);

      // ban status prep
      banStatus$ = new Subject<void>();
      mockSteelheadConsolesService.putBanStatusByConsoleId$ = jasmine
        .createSpy('putBanStatusByConsoleId$')
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
      let firstBanned: SteelheadConsoleDetailsEntry = undefined;
      let firstUnbanned: SteelheadConsoleDetailsEntry = undefined;

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

      describe('makeBanAction', () => {
        it('should ban', waitForAsync(async () => {
          // create the ban action
          const banAction = component.makeBanAction$(firstBanned.consoleId);
          expect(banAction).toBeTruthy();
          await fixture.whenStable();

          // execute the ban action
          let isDone = false;
          banAction.subscribe(() => (isDone = true));

          // emulate completion
          banStatus$.next();
          banStatus$.complete();
          await fixture.whenStable();
          expect(isDone).toBe(true);
          expect(firstBanned.isBanned).toBe(true);
        }));
      });

      describe('makeUnbanAction', () => {
        it('should unban', waitForAsync(async () => {
          // create the ban action
          const unbanAction = component.makeUnbanAction$(firstUnbanned.consoleId);
          expect(unbanAction).toBeTruthy();
          await fixture.whenStable();

          // execute the ban action
          let isDone = false;
          unbanAction.subscribe(() => (isDone = true));

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
