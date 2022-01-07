import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { SunrisePlayerXuidAccountInventoryFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/accountInventory';
import { SunrisePlayerAccountInventory } from '@models/sunrise';
import { createMockSunriseService, SunriseService } from '@services/sunrise';
import { Subject, throwError } from 'rxjs';

import { SunrisePlayerAccountInventoryComponent } from './sunrise-player-account-inventory.component';
import { first } from 'lodash';
import { SunrisePlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/players/identities';
import { fakeXuid } from '@interceptors/fake-api/utility';

describe('SunrisePlayerAccountInventoryComponent', () => {
  let injector: TestBed;
  let service: SunriseService;
  let component: SunrisePlayerAccountInventoryComponent;
  let fixture: ComponentFixture<SunrisePlayerAccountInventoryComponent>;

  beforeEach(
    waitForAsync(async () => {
      await TestBed.configureTestingModule({
        declarations: [SunrisePlayerAccountInventoryComponent],
        providers: [createMockSunriseService()],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();

      injector = getTestBed();
      service = injector.inject(SunriseService);

      fixture = TestBed.createComponent(SunrisePlayerAccountInventoryComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.accountInventory = undefined;
    }),
  );

  it(
    'should create',
    waitForAsync(() => {
      expect(component).toBeTruthy();
    }),
  );

  describe('valid initialization', () => {
    let playerAccountInventory$: Subject<SunrisePlayerAccountInventory> = undefined;
    let playerAccountInventoryValue: SunrisePlayerAccountInventory = undefined;
    const testXuid = fakeXuid();

    beforeEach(
      waitForAsync(() => {
        // account-inventory list prep
        playerAccountInventory$ = new Subject<SunrisePlayerAccountInventory>();
        playerAccountInventoryValue =
          SunrisePlayerXuidAccountInventoryFakeApi.make() as SunrisePlayerAccountInventory;
        service.getPlayerAccountInventoryByXuid$ = jasmine
          .createSpy('getPlayerAccountInventoryByXuid$')
          .and.returnValue(playerAccountInventory$);
      }),
    );

    describe('ngOnChanges', () => {
      describe('When xuid is undefined', () => {
        beforeEach(() => {
          component.identity = undefined;
        });

        it(
          'should skip logic',
          waitForAsync(() => {
            component.ngOnChanges();

            expect(component.getMonitor.isActive).toBe(false);
            expect(component.getMonitor.status.error).toBeFalsy();
          }),
        );
      });

      describe('When xuid is defined', () => {
        beforeEach(() => {
          component.identity = first(SunrisePlayersIdentitiesFakeApi.make([{ xuid: testXuid }]));
        });

        describe('and valid results are returned', () => {
          it(
            'should set account inventory',
            waitForAsync(async () => {
              // emulate xuid update event
              component.ngOnChanges();

              // waiting on value
              fixture.detectChanges();
              expect(component.getMonitor.isActive).toBe(true);

              // value received
              playerAccountInventory$.next(playerAccountInventoryValue);
              playerAccountInventory$.complete();

              await fixture.whenStable();
              fixture.detectChanges();

              expect(component.getMonitor.isActive).toBe(false);
              expect(component.getMonitor.status.error).toBeFalsy();
              expect(component.accountInventory).toEqual(playerAccountInventoryValue);
            }),
          );
        });

        describe('and http error is returned', () => {
          const error = { error: 'fake error' };

          beforeEach(() => {
            service.getPlayerAccountInventoryByXuid$ = jasmine
              .createSpy('getPlayerAccountInventoryByXuid$')
              .and.returnValue(throwError(error));
          });

          it(
            'should update when request errored',
            waitForAsync(async () => {
              component.ngOnChanges();

              expect(component.getMonitor.isActive).toBe(false);
              expect(component.getMonitor.status.error).not.toBeUndefined();
              expect(component.getMonitor.status.error).toEqual(error);
              expect(component.accountInventory).toBeUndefined();
            }),
          );
        });
      });
    });
  });
});
