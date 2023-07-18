import { HttpErrorResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { WoodstockPlayerXuidNotificationsFakeApi } from '@interceptors/fake-api/apis/title/woodstock/player/xuid/notifications';
import { createMockWoodstockService, WoodstockService } from '@services/woodstock';
import { Subject } from 'rxjs';

import { WoodstockPlayerNotificationsComponent } from './woodstock-player-notifications.component';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { first } from 'lodash';
import { WoodstockPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/woodstock/players/identities';
import { PlayerNotification } from '@models/notifications.model';
import { PipesModule } from '@shared/pipes/pipes.module';

describe('WoodstockPlayerNotificationsComponent', () => {
  let injector: TestBed;
  let service: WoodstockService;
  let component: WoodstockPlayerNotificationsComponent;
  let fixture: ComponentFixture<WoodstockPlayerNotificationsComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockPlayerNotificationsComponent],
      imports: [PipesModule],
      providers: [createMockWoodstockService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    injector = getTestBed();
    service = injector.inject(WoodstockService);
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(WoodstockPlayerNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('valid initialization', () => {
    let playerNotifications$: Subject<PlayerNotification[]> = undefined;
    let playerNotificationsValue: PlayerNotification[] = undefined;
    const testXuid = fakeXuid();

    beforeEach(waitForAsync(() => {
      // notifications list prep
      playerNotifications$ = new Subject<PlayerNotification[]>();
      playerNotificationsValue =
        WoodstockPlayerXuidNotificationsFakeApi.makeMany() as PlayerNotification[];
      service.getPlayerNotifications$ = jasmine
        .createSpy('getPlayerNotifications')
        .and.returnValue(playerNotifications$);

      // emulate initialization event
      component.ngOnChanges();
    }));

    describe('ngOnChanges', () => {
      it('should skip undefined xuids', waitForAsync(() => {
        expect(component.isLoading).toBe(true);
        expect(component.loadError).toBeFalsy();
      }));

      it('should update when xuid set', waitForAsync(async () => {
        component.identity = first(WoodstockPlayersIdentitiesFakeApi.make([{ xuid: testXuid }]));
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
      }));

      it('should update when request errored', waitForAsync(async () => {
        // emulate xuid update event
        component.identity = first(WoodstockPlayersIdentitiesFakeApi.make([{ xuid: testXuid }]));
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
      }));
    });
  });
});
