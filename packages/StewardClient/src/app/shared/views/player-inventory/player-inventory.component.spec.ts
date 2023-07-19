import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  PlayerInventoryComponent,
  PlayerInventoryComponentContract,
} from './player-inventory.component';
import { GameTitle } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { WoodstockMasterInventory } from '@models/woodstock';
import { of } from 'rxjs';
import { WoodstockPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/woodstock/players/identities';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { first } from 'lodash';
import { WoodstockPlayerXuidInventoryFakeApi } from '@interceptors/fake-api/apis/title/woodstock/player/xuid/inventory';

describe('PlayerInventoryBaseComponent', () => {
  let component: PlayerInventoryComponent;
  let fixture: ComponentFixture<PlayerInventoryComponent>;

  const mockService: PlayerInventoryComponentContract<
    WoodstockMasterInventory,
    IdentityResultAlpha
  > = {
    gameTitle: GameTitle.FH5,
    getPlayerInventoryByIdentity$: () => of(WoodstockPlayerXuidInventoryFakeApi.make(null)),
    getPlayerInventoryByIdentityAndProfileId$: () => of(null),
    makewhatToShowList: () => [],
    inventoryFound: () => null,
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [PlayerInventoryComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerInventoryComponent);
    component = fixture.debugElement.componentInstance;
    component.service = mockService;

    component.ngOnInit();
  }));

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('Method: ngOnChanges', () => {
    const testXuid = fakeXuid();

    describe('When service is null', () => {
      beforeEach(() => {
        component.service = null;
      });

      it('should throw error', () => {
        try {
          component.ngOnChanges(null);

          expect(false).toBeTruthy();
        } catch (e) {
          expect(true).toBeTruthy();
          expect(e.message).toEqual('No service provided for PlayerInventoryComponent');
        }
      });
    });

    describe('When service is provided', () => {
      // Provided by default in the test component
      it('should not throw error', () => {
        try {
          component.ngOnChanges(null);

          expect(true).toBeTruthy();
        } catch (e) {
          expect(false).toBeTruthy();
        }
      });
    });

    describe('When valid identity is set', () => {
      beforeEach(waitForAsync(() => {
        component.service.getPlayerInventoryByIdentity$ = jasmine
          .createSpy('service.getPlayerInventoryByIdentity$')
          .and.callThrough();

        component.identity = first(WoodstockPlayersIdentitiesFakeApi.make([{ xuid: testXuid }]));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component.ngOnChanges(<any>{
          identity: new SimpleChange(undefined, component.identity, true),
        });
      }));

      it('should call getPlayerInventoryByIdentity$', () => {
        expect(component.service.getPlayerInventoryByIdentity$).toHaveBeenCalledWith(
          component.identity,
        );
      });
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
