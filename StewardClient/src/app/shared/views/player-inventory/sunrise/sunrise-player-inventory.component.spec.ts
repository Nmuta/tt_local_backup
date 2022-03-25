import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SunrisePlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/players/identities';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { createMockSunriseService, MockSunriseService, SunriseService } from '@services/sunrise';
import { first } from 'lodash';
import { Subject } from 'rxjs';

import { SunrisePlayerInventoryComponent } from './sunrise-player-inventory.component';

describe('SunrisePlayerInventoryComponent', () => {
  let component: SunrisePlayerInventoryComponent;
  let fixture: ComponentFixture<SunrisePlayerInventoryComponent>;
  let service: SunriseService;
  let waitUntil$: Subject<void>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunrisePlayerInventoryComponent],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    service = TestBed.inject(SunriseService);
    waitUntil$ = new Subject<void>();
    (service as unknown as MockSunriseService).waitUntil$ = waitUntil$;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunrisePlayerInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnChanges', () => {
    const testXuid = fakeXuid();

    beforeEach(waitForAsync(() => {
      component.identity = first(SunrisePlayersIdentitiesFakeApi.make([{ xuid: testXuid }]));
      component.ngOnChanges({
        identity: new SimpleChange(undefined, component.identity, true),
      });
    }));

    it('should call getPlayerInventoryByXuid$', () => {
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
          component.ngOnChanges({
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
