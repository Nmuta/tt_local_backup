import { HttpErrorResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { SunrisePlayerXuidNotificationsFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/notifications';
import { SunrisePlayerNotifications } from '@models/sunrise';
import { createMockSunriseService, SunriseService } from '@services/sunrise';
import faker from 'faker';
import { Subject } from 'rxjs';

import { SunrisePlayerNotificationsComponent } from './sunrise-player-notifications.component';

describe('SunrisePlayerNotificationsComponent', () => {
  let injector: TestBed;
  let service: SunriseService;
  let component: SunrisePlayerNotificationsComponent;
  let fixture: ComponentFixture<SunrisePlayerNotificationsComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunrisePlayerNotificationsComponent],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    injector = getTestBed();
    service = injector.inject(SunriseService);
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(SunrisePlayerNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it(
    'should create',
    waitForAsync(() => {
      expect(component).toBeTruthy();
    }),
  );

  

  describe('valid initialization', () => {
    let consoleDetails$: Subject<SunrisePlayerNotifications> = undefined;
    let consoleDetailsValue: SunrisePlayerNotifications = undefined;

    beforeEach(
      waitForAsync(() => {
        // notifications list prep
        consoleDetails$ = new Subject<SunrisePlayerNotifications>();
        consoleDetailsValue = SunrisePlayerXuidNotificationsFakeApi.makeMany() as SunrisePlayerNotifications;
        service.getPlayerNotificationsByXuid = jasmine
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
          component.xuid = BigInt(faker.random.number({ min: 10_000, max: 500_000 }));
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
          component.xuid = BigInt(faker.random.number({ min: 10_000, max: 500_000 }));
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
