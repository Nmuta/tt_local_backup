import BigNumber from 'bignumber.js';
import { HttpErrorResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { WoodstockPlayerXuidNotificationsFakeApi } from '@interceptors/fake-api/apis/title/woodstock/player/xuid/notifications';
import { WoodstockPlayerNotifications } from '@models/woodstock';
import { createMockWoodstockService, WoodstockService } from '@services/woodstock';
import faker from 'faker';
import { Subject } from 'rxjs';

import { WoodstockPlayerNotificationsComponent } from './woodstock-player-notifications.component';

describe('WoodstockPlayerNotificationsComponent', () => {
  let injector: TestBed;
  let service: WoodstockService;
  let component: WoodstockPlayerNotificationsComponent;
  let fixture: ComponentFixture<WoodstockPlayerNotificationsComponent>;

  beforeEach(
    waitForAsync(async () => {
      await TestBed.configureTestingModule({
        declarations: [WoodstockPlayerNotificationsComponent],
        providers: [createMockWoodstockService()],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();

      injector = getTestBed();
      service = injector.inject(WoodstockService);
    }),
  );

  beforeEach(
    waitForAsync(() => {
      fixture = TestBed.createComponent(WoodstockPlayerNotificationsComponent);
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
    let consoleDetails$: Subject<WoodstockPlayerNotifications> = undefined;
    let consoleDetailsValue: WoodstockPlayerNotifications = undefined;

    beforeEach(
      waitForAsync(() => {
        // notifications list prep
        consoleDetails$ = new Subject<WoodstockPlayerNotifications>();
        consoleDetailsValue = WoodstockPlayerXuidNotificationsFakeApi.makeMany() as WoodstockPlayerNotifications;
        service.getPlayerNotificationsByXuid$ = jasmine
          .createSpy('getPlayerNotificationsByXuid')
          .and.returnValue(consoleDetails$);

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
          component.xuid = new BigNumber(faker.datatype.number({ min: 10_000, max: 500_000 }));
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
          component.xuid = new BigNumber(faker.datatype.number({ min: 10_000, max: 500_000 }));
          component.ngOnChanges();

          // waiting on value
          fixture.detectChanges();
          expect(component.isLoading).toBe(true);

          // error received
          consoleDetails$.error(new HttpErrorResponse({ error: 'hello' }));
          await fixture.whenStable();
          fixture.detectChanges();
          expect(component.isLoading).toBe(false);
          expect(component.loadError).toBeTruthy();
        }),
      );
    });
  });
});
