import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SteelheadPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/steelhead/players/identities';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { SteelheadInventoryService } from '@services/api-v2/steelhead/inventory/steelhead-inventory.service';
import {
  createMockSteelheadInventoryService,
  MockSteelheadInventoryService,
} from '@services/api-v2/steelhead/inventory/steelhead-inventory.service.mock';
import { SteelheadPlayerInventoryService } from '@services/api-v2/steelhead/player/inventory/steelhead-player-inventory.service';
import {
  createMockSteelheadPlayerInventoryService,
  MockSteelheadPlayerInventoryService,
} from '@services/api-v2/steelhead/player/inventory/steelhead-player-inventory.service.mock';
import { first } from 'lodash';
import { Subject } from 'rxjs';

import { SteelheadPlayerInventoryComponent } from './steelhead-player-inventory.component';

describe('SteelheadPlayerInventoryComponent', () => {
  let component: SteelheadPlayerInventoryComponent;
  let fixture: ComponentFixture<SteelheadPlayerInventoryComponent>;
  let mockSteelheadPlayerInventoryService: SteelheadPlayerInventoryService;
  let mockSteelheadInventoryService: SteelheadInventoryService;
  let waitUntil$: Subject<void>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SteelheadPlayerInventoryComponent],
      providers: [
        createMockSteelheadPlayerInventoryService(),
        createMockSteelheadInventoryService(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    mockSteelheadPlayerInventoryService = TestBed.inject(SteelheadPlayerInventoryService);
    mockSteelheadInventoryService = TestBed.inject(SteelheadInventoryService);
    waitUntil$ = new Subject<void>();
    (
      mockSteelheadPlayerInventoryService as unknown as MockSteelheadPlayerInventoryService
    ).waitUntil$ = waitUntil$;
    (mockSteelheadInventoryService as unknown as MockSteelheadInventoryService).waitUntil$ =
      waitUntil$;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelheadPlayerInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnChanges', () => {
    const testXuid = fakeXuid();

    beforeEach(waitForAsync(() => {
      component.identity = first(SteelheadPlayersIdentitiesFakeApi.make([{ xuid: testXuid }]));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component.ngOnChanges(<any>{
        identity: new SimpleChange(undefined, component.identity, true),
      });
    }));

    it('should call getPlayerInventoryByXuid$', () => {
      expect(mockSteelheadPlayerInventoryService.getInventoryByXuid$).toHaveBeenCalledWith(
        testXuid,
      );
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
