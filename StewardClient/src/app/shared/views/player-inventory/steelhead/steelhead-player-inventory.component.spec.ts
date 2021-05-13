import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SteelheadPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/steelhead/players/identities';
import { fakeXuid } from '@interceptors/fake-api/utility';
import {
  SteelheadService,
  createMockSteelheadService,
  MockSteelheadService,
} from '@services/steelhead';
import { first } from 'lodash';
import { Subject } from 'rxjs';

import { SteelheadPlayerInventoryComponent } from './steelhead-player-inventory.component';

describe('SteelheadPlayerInventoryComponent', () => {
  let component: SteelheadPlayerInventoryComponent;
  let fixture: ComponentFixture<SteelheadPlayerInventoryComponent>;
  let service: SteelheadService;
  let waitUntil$: Subject<void>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SteelheadPlayerInventoryComponent],
      providers: [createMockSteelheadService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    service = TestBed.inject(SteelheadService);
    waitUntil$ = new Subject<void>();
    ((service as unknown) as MockSteelheadService).waitUntil$ = waitUntil$;
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

    beforeEach(
      waitForAsync(() => {
        component.identity = first(SteelheadPlayersIdentitiesFakeApi.make([{ xuid: testXuid }]));
        component.ngOnChanges({
          identity: new SimpleChange(undefined, component.identity, true),
        });
      }),
    );

    it('should call getPlayerInventoryByXuid$', () => {
      expect(service.getPlayerInventoryByXuid$).toHaveBeenCalledWith(testXuid);
    });

    it('should reset', () => {
      expect(component.inventory).toBeFalsy();
      expect(component.error).toBeFalsy();
    });

    describe('when valid inventory is received', () => {
      beforeEach(
        waitForAsync(() => {
          waitUntil$.next();
        }),
      );

      it('should populate inventory', () => {
        expect(component.inventory).toBeTruthy();
        expect(component.itemsToShow).toBeTruthy();
      });

      describe('when null identity is set', () => {
        beforeEach(
          waitForAsync(() => {
            component.identity = null;
            component.ngOnChanges({
              identity: new SimpleChange(undefined, null, false),
            });
          }),
        );

        it('should reset', () => {
          expect(component.inventory).toBeFalsy();
          expect(component.error).toBeFalsy();
        });
      });
    });
  });
});
