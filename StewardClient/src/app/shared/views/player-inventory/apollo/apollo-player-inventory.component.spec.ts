import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ApolloPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/apollo/players/identities';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { ApolloService, createMockApolloService, MockApolloService } from '@services/apollo';
import { first } from 'lodash';
import { Subject } from 'rxjs';

import { ApolloPlayerInventoryComponent } from './apollo-player-inventory.component';

describe('ApolloPlayerInventoryComponent', () => {
  let component: ApolloPlayerInventoryComponent;
  let fixture: ComponentFixture<ApolloPlayerInventoryComponent>;
  let service: ApolloService;
  let waitUntil$: Subject<void>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApolloPlayerInventoryComponent],
      providers: [createMockApolloService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    service = TestBed.inject(ApolloService);
    waitUntil$ = new Subject<void>();
    (service as unknown as MockApolloService).waitUntil$ = waitUntil$;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApolloPlayerInventoryComponent);
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
        component.identity = first(ApolloPlayersIdentitiesFakeApi.make([{ xuid: testXuid }]));
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
