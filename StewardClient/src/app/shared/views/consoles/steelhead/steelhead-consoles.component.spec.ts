import BigNumber from 'bignumber.js';
import { HttpErrorResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SunrisePlayerXuidConsolesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/consoleDetails';
import * as faker from 'faker';
import { Subject } from 'rxjs';

import { BigJsonPipe } from '@shared/pipes/big-json.pipe';
import { SteelheadConsolesComponent } from './steelhead-consoles.component';
import { SteelheadConsoleDetailsEntry } from '@models/steelhead';
import { SteelheadService, createMockSteelheadService } from '@services/steelhead';
import { createMockPermissionsService, PermissionsService } from '@services/permissions';

describe('SteelheadConsolesComponent', () => {
  let component: SteelheadConsolesComponent;
  let fixture: ComponentFixture<SteelheadConsolesComponent>;

  let mockSteelheadService: SteelheadService;
  let mockPermissionsService: PermissionsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SteelheadConsolesComponent, BigJsonPipe],
      providers: [createMockSteelheadService(), createMockPermissionsService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelheadConsolesComponent);
    component = fixture.componentInstance;
    mockSteelheadService = TestBed.inject(SteelheadService);
    mockPermissionsService = TestBed.inject(PermissionsService);

    mockPermissionsService.currentUserHasWritePermission = jasmine
      .createSpy('currentUserHasWritePermission ')
      .and.returnValue(true);
    fixture.detectChanges();
  });

  it(
    'should create',
    waitForAsync(() => {
      expect(component).toBeTruthy();
    }),
  );

  describe('valid initialization', () => {
    let consoleDetails$: Subject<SteelheadConsoleDetailsEntry[]> = undefined;
    let consoleDetailsValue: SteelheadConsoleDetailsEntry[] = undefined;

    beforeEach(
      waitForAsync(() => {
        // console details prep
        consoleDetails$ = new Subject<SteelheadConsoleDetailsEntry[]>();
        consoleDetailsValue =
          SunrisePlayerXuidConsolesFakeApi.makeMany() as SteelheadConsoleDetailsEntry[];
        mockSteelheadService.getConsoleDetailsByXuid$ = jasmine
          .createSpy('getConsoleDetailsByXuid$')
          .and.returnValue(consoleDetails$);

        // emulate initialization event
        component.ngOnChanges();
      }),
    );

    describe('ngOnChanges', () => {
      it(
        'should skip undefined xuids',
        waitForAsync(() => {
          expect(component.getConsoles?.isActive).toBe(false);
          expect(component.getConsoles?.status?.error).toBeUndefined();
        }),
      );

      it(
        'should update when xuid set',
        waitForAsync(async () => {
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
        }),
      );

      it(
        'should update when request errored',
        waitForAsync(async () => {
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
        }),
      );
    });
  });
});
