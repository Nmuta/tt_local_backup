import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { WoodstockPlayerXuidAccountInventoryFakeApi } from '@interceptors/fake-api/apis/title/woodstock/player/xuid/accountInventory';
import { WoodstockPlayerAccountInventory } from '@models/woodstock';
import { createMockWoodstockService, WoodstockService } from '@services/woodstock';
import { Subject, throwError } from 'rxjs';

import { WoodstockPlayerAccountInventoryComponent } from './woodstock-player-account-inventory.component';
import { first } from 'lodash';
import { WoodstockPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/woodstock/players/identities';
import { fakeXuid } from '@interceptors/fake-api/utility';

describe('WoodstockPlayerAccountInventoryComponent', () => {
  let injector: TestBed;
  let service: WoodstockService;
  let component: WoodstockPlayerAccountInventoryComponent;
  let fixture: ComponentFixture<WoodstockPlayerAccountInventoryComponent>;

  beforeEach(
    waitForAsync(async () => {
      await TestBed.configureTestingModule({
        declarations: [WoodstockPlayerAccountInventoryComponent],
        providers: [createMockWoodstockService()],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();

      injector = getTestBed();
      service = injector.inject(WoodstockService);

      fixture = TestBed.createComponent(WoodstockPlayerAccountInventoryComponent);
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
    let playerAccountInventory$: Subject<WoodstockPlayerAccountInventory> = undefined;
    let playerAccountInventoryValue: WoodstockPlayerAccountInventory = undefined;
    const testXuid = fakeXuid();

    beforeEach(
      waitForAsync(() => {
        // account-inventory list prep
        playerAccountInventory$ = new Subject<WoodstockPlayerAccountInventory>();
        playerAccountInventoryValue = WoodstockPlayerXuidAccountInventoryFakeApi.make() as WoodstockPlayerAccountInventory;
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
          component.identity = first(WoodstockPlayersIdentitiesFakeApi.make([{ xuid: testXuid }]));
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
