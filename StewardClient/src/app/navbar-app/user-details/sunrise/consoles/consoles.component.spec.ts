import { HttpErrorResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  getTestBed,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { SunrisePlayerXuidConsolesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/consoleDetails';
import {
  SunriseConsoleDetails,
  SunriseConsoleDetailsEntry,
} from '@models/sunrise/sunrise-console-details.model';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';
import _ from 'lodash';
import * as faker from 'faker';
import { Subject } from 'rxjs';

import { ConsolesComponent } from './consoles.component';

describe('ConsolesComponent', () => {
  let injector: TestBed;
  let service: SunriseService;
  let component: ConsolesComponent;
  let fixture: ComponentFixture<ConsolesComponent>;

  beforeEach(
    waitForAsync(async () => {
      await TestBed.configureTestingModule({
        declarations: [ConsolesComponent],
        providers: [createMockSunriseService()],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();

      injector = getTestBed();
      service = injector.inject(SunriseService);
    }),
  );

  beforeEach(
    waitForAsync(() => {
      fixture = TestBed.createComponent(ConsolesComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }),
  );

  it(
    'should create',
    waitForAsync(() => {
      expect(component).toBeTruthy();
    }),
  );

  describe('valid initialization', () => {
    let consoleDetails$: Subject<SunriseConsoleDetails> = undefined;
    let consoleDetailsValue: SunriseConsoleDetails = undefined;
    let banStatus$: Subject<void> = undefined;

    beforeEach(
      waitForAsync(() => {
        // console details prep
        consoleDetails$ = new Subject<SunriseConsoleDetails>();
        consoleDetailsValue = SunrisePlayerXuidConsolesFakeApi.makeMany();
        service.getConsoleDetailsByXuid = jasmine
          .createSpy('getConsoleDetailsByXuid')
          .and.returnValue(consoleDetails$);

        // ban status prep
        banStatus$ = new Subject<void>();
        service.putBanStatusByConsoleId = jasmine
          .createSpy('putBanStatusByConsoleId')
          .and.returnValue(banStatus$);

        // emulate initialization event
        component.ngOnChanges();
      }),
    );

    describe('ngOnChanges', () => {
      it(
        'should skip undefined xuids',
        waitForAsync(() => {
          expect(component.isLoading).toBe(true);
          expect(component.loadError).toBeFalsy();
        }),
      );

      it(
        'should update when xuid set',
        waitForAsync(async () => {
          // emulate xuid update event
          component.xuid = faker.random.number({ min: 10_000, max: 500_000 });
          component.ngOnChanges();

          // waiting on value
          fixture.detectChanges();
          expect(component.isLoading).toBe(true);

          // value received
          consoleDetails$.next(consoleDetailsValue);
          consoleDetails$.complete();
          await fixture.whenStable();
          fixture.detectChanges();
          expect(component.isLoading).toBe(false);
          expect(component.loadError).toBeFalsy();
        }),
      );

      it(
        'should update when request errored',
        waitForAsync(async () => {
          // emulate xuid update event
          component.xuid = faker.random.number({ min: 10_000, max: 500_000 });
          component.ngOnChanges();

          // waiting on value
          fixture.detectChanges();
          expect(component.isLoading).toBe(true);

          // error received
          debugger;
          consoleDetails$.error(new HttpErrorResponse({ error: 'hello' }));
          await fixture.whenStable();
          fixture.detectChanges();
          expect(component.isLoading).toBe(false);
          expect(component.loadError).toBeTruthy();
        }),
      );
    });

    describe('after xuid set', () => {
      let firstBanned: SunriseConsoleDetailsEntry = undefined;
      let firstUnbanned: SunriseConsoleDetailsEntry = undefined;

      beforeEach(
        waitForAsync(() => {
          // select a couple sample entries
          firstBanned = _(consoleDetailsValue)
            .filter(v => v.isBanned)
            .first();
          firstUnbanned = _(consoleDetailsValue)
            .filter(v => !v.isBanned)
            .first();

          // emulate xuid update event
          component.xuid = faker.random.number({ min: 10_000, max: 500_000 });
          component.ngOnChanges();

          // waiting on value
          fixture.detectChanges();
          expect(component.isLoading).toBe(true);

          // value received
          consoleDetails$.next(consoleDetailsValue);
          consoleDetails$.complete();
          fixture.detectChanges();
        }),
      );

      describe('makeBanAction', () => {
        it(
          'should ban',
          waitForAsync(async () => {
            // create the ban action
            const banAction = component.makeBanAction(firstUnbanned.consoleId);
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
          }),
        );
      });

      describe('makeUnbanAction', () => {
        it(
          'should unban',
          waitForAsync(async () => {
            // create the ban action
            const banAction = component.makeUnbanAction(firstBanned.consoleId);
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
          }),
        );
      });
    });
  });
});
