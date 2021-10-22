import { HttpErrorResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { SunrisePlayerXuidNotificationsFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/notifications';
import { createMockSunriseService, SunriseService } from '@services/sunrise';
import { Subject } from 'rxjs';

import { SunrisePlayerNotificationsComponent } from './sunrise-player-notifications.component';
import { first } from 'lodash';
import { SunrisePlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/players/identities';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { PlayerNotifications } from '@models/notifications.model';

describe('SunrisePlayerNotificationsComponent', () => {
  let injector: TestBed;
  let service: SunriseService;
  let component: SunrisePlayerNotificationsComponent;
  let fixture: ComponentFixture<SunrisePlayerNotificationsComponent>;

  beforeEach(
    waitForAsync(async () => {
      await TestBed.configureTestingModule({
        declarations: [SunrisePlayerNotificationsComponent],
        providers: [createMockSunriseService()],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();

      injector = getTestBed();
      service = injector.inject(SunriseService);
    }),
  );

  beforeEach(
    waitForAsync(() => {
      fixture = TestBed.createComponent(SunrisePlayerNotificationsComponent);
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
    let playerNotifications$: Subject<PlayerNotifications> = undefined;
    let playerNotificationsValue: PlayerNotifications = undefined;
    const testXuid = fakeXuid();

    beforeEach(
      waitForAsync(() => {
        // notifications list prep
        playerNotifications$ = new Subject<PlayerNotifications>();
        playerNotificationsValue = SunrisePlayerXuidNotificationsFakeApi.makeMany() as PlayerNotifications;
        service.getPlayerNotificationsByXuid$ = jasmine
          .createSpy('getPlayerNotificationsByXuid$')
          .and.returnValue(playerNotifications$);

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
          component.identity = first(SunrisePlayersIdentitiesFakeApi.make([{ xuid: testXuid }]));
          component.ngOnChanges();

          // waiting on value
          fixture.detectChanges();
          expect(component.isLoading).toBe(true);

          // value received
          playerNotifications$.next(playerNotificationsValue);
          playerNotifications$.complete();
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
          component.identity = first(SunrisePlayersIdentitiesFakeApi.make([{ xuid: testXuid }]));
          component.ngOnChanges();

          // waiting on value
          fixture.detectChanges();
          expect(component.isLoading).toBe(true);

          // error received
          playerNotifications$.error(new HttpErrorResponse({ error: 'hello' }));
          await fixture.whenStable();
          fixture.detectChanges();
          expect(component.isLoading).toBe(false);
          expect(component.loadError).toBeTruthy();
        }),
      );
    });
  });
});
