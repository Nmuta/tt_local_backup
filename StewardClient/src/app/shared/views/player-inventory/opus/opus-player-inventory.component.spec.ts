import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OpusPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/opus/players/identities';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { createMockOpusService, MockOpusService, OpusService } from '@services/opus';
import { first } from 'lodash';
import { Subject } from 'rxjs';

import { OpusPlayerInventoryComponent } from './opus-player-inventory.component';

describe('OpusPlayerInventoryComponent', () => {
  let component: OpusPlayerInventoryComponent;
  let fixture: ComponentFixture<OpusPlayerInventoryComponent>;
  let service: OpusService;
  let waitUntil$: Subject<void>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpusPlayerInventoryComponent],
      providers: [createMockOpusService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    service = TestBed.inject(OpusService);
    waitUntil$ = new Subject<void>();
    (service as unknown as MockOpusService).waitUntil$ = waitUntil$;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpusPlayerInventoryComponent);
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
        component.identity = first(OpusPlayersIdentitiesFakeApi.make([{ xuid: testXuid }]));
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
