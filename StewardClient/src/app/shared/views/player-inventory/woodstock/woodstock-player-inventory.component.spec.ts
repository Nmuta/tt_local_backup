import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WoodstockPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/woodstock/players/identities';
import { fakeXuid } from '@interceptors/fake-api/utility';
import {
  createMockWoodstockService,
  MockWoodstockService,
  WoodstockService,
} from '@services/woodstock';
import { first } from 'lodash';
import { Subject } from 'rxjs';

import { WoodstockPlayerInventoryComponent } from './woodstock-player-inventory.component';

describe('WoodstockPlayerInventoryComponent', () => {
  let component: WoodstockPlayerInventoryComponent;
  let fixture: ComponentFixture<WoodstockPlayerInventoryComponent>;
  let service: WoodstockService;
  let waitUntil$: Subject<void>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockPlayerInventoryComponent],
      providers: [createMockWoodstockService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    service = TestBed.inject(WoodstockService);
    waitUntil$ = new Subject<void>();
    (service as unknown as MockWoodstockService).waitUntil$ = waitUntil$;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockPlayerInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnChanges', () => {
    const testXuid = fakeXuid();

    beforeEach(waitForAsync(() => {
      component.identity = first(WoodstockPlayersIdentitiesFakeApi.make([{ xuid: testXuid }]));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component.ngOnChanges(<any>{
        identity: new SimpleChange(undefined, component.identity, true),
      });
    }));

    it('should call getPlayerInventoryByXuid', () => {
      expect(service.getPlayerInventoryByXuid$).toHaveBeenCalledWith(testXuid);
    });

    it('should reset', () => {
      expect(component.inventory).toBeFalsy();
      expect(component.error).toBeFalsy();
    });

    describe('when valid inventory is received', () => {
      beforeEach(waitForAsync(() => {
        waitUntil$.next();
      }));

      it('should populate inventory', () => {
        expect(component.inventory).toBeTruthy();
        expect(component.itemsToShow).toBeTruthy();
      });

      describe('when null identity is set', () => {
        beforeEach(waitForAsync(() => {
          component.identity = null;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component.ngOnChanges(<any>{
            identity: new SimpleChange(undefined, null, false),
          });
        }));

        it('should reset', () => {
          expect(component.inventory).toBeFalsy();
          expect(component.error).toBeFalsy();
        });
      });
    });
  });
});
