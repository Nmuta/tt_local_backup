import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GravityPlayerT10IdInventoryFakeApi } from '@interceptors/fake-api/apis/title/gravity/player/t10Id/inventory';
import { GravityPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/gravity/players/identities';
import { fakeT10Id } from '@interceptors/fake-api/utility/fake-t10id';
import { createMockGravityService, GravityService, MockGravityService } from '@services/gravity';
import { first } from 'lodash';
import { of, Subject } from 'rxjs';

import { GravityPlayerInventoryComponent } from './gravity-player-inventory.component';

describe('GravityPlayerInventoryComponent', () => {
  let component: GravityPlayerInventoryComponent;
  let fixture: ComponentFixture<GravityPlayerInventoryComponent>;
  let service: GravityService;
  let waitUntil$: Subject<void>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GravityPlayerInventoryComponent],
      providers: [createMockGravityService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    service = TestBed.inject(GravityService);
    waitUntil$ = new Subject<void>();
    ((service as unknown) as MockGravityService).waitUntil$ = waitUntil$;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GravityPlayerInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnChanges', () => {
    const testT10Id = fakeT10Id();

    beforeEach(
      waitForAsync(() => {
        service.getPlayerInventoryByT10Id = jasmine
          .createSpy('getPlayerInventoryByT10Id')
          .and.returnValue(of(GravityPlayerT10IdInventoryFakeApi.make(testT10Id)));
        component.identity = first(GravityPlayersIdentitiesFakeApi.make([{ t10Id: testT10Id }]));
        component.ngOnChanges({
          identity: new SimpleChange(undefined, component.identity, true),
        });
      }),
    );

    it('should call getPlayerInventoryByT10Id', () => {
      expect(service.getPlayerInventoryByT10Id).toHaveBeenCalledWith(testT10Id);
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
