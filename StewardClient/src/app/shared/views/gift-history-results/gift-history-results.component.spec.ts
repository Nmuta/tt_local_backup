import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import {
  GiftHistoryResultsComponent,
  GiftHistoryResultsServiceContract,
} from './gift-history-results.component';
import { GiftIdentityAntecedent } from '@shared/constants';
import { fakeBigNumber, fakeXuid } from '@interceptors/fake-api/utility';
import { toDateTime } from '@helpers/luxon';
import faker from '@faker-js/faker';
import { MasterInventoryItem } from '@models/master-inventory-item';
import { WoodstockGift, WoodstockGiftHistory, WoodstockMasterInventory } from '@models/woodstock';
import { GameTitle } from '@models/enums';
import { GiftHistoryResultUnion, GiftHistoryView } from '@models/gift-history';

describe('GiftHistoryResultsComponent', () => {
  let component: GiftHistoryResultsComponent;
  let fixture: ComponentFixture<GiftHistoryResultsComponent>;

  const fakeGiftHistory = {
    idType: GiftIdentityAntecedent.Xuid,
    id: fakeXuid(),
    giftSendDateUtc: toDateTime(faker.date.past()),
    giftInventory: {
      inventory: {
        creditRewards: [{ id: fakeBigNumber() } as MasterInventoryItem],
        cars: [{ id: fakeBigNumber() } as MasterInventoryItem],
        carHorns: [{ id: fakeBigNumber() } as MasterInventoryItem],
        vanityItems: [{ id: fakeBigNumber() } as MasterInventoryItem],
        emotes: [{ id: fakeBigNumber() } as MasterInventoryItem],
        quickChatLines: [{ id: fakeBigNumber() } as MasterInventoryItem],
      } as WoodstockMasterInventory,
    } as WoodstockGift,
    title: 'woodstock',
    requesterObjectId: faker.datatype.uuid(),
  } as WoodstockGiftHistory;

  const mockService: GiftHistoryResultsServiceContract = {
    getGiftHistoryByPlayer$: () => {
      return of([]);
    },
    getGiftHistoryByLspGroup$: () => {
      return of([]);
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [GiftHistoryResultsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(GiftHistoryResultsComponent);
    component = fixture.debugElement.componentInstance;
    component.service = mockService;
    component.gameTitle = GameTitle.FH5;
  }));

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('Method: ngOnInit', () => {
    describe('When service is null', () => {
      beforeEach(() => {
        component.service = null;
      });

      it('should throw error', () => {
        try {
          fixture.detectChanges();

          expect(false).toBeTruthy();
        } catch (e) {
          expect(true).toBeTruthy();
          expect(e.message).toEqual('No service is defined for gift history results.');
        }
      });
    });

    describe('When service is provided', () => {
      // Provided by default in the test component
      it('should not throw error', () => {
        try {
          fixture.detectChanges();

          expect(true).toBeTruthy();
        } catch (e) {
          expect(e).toEqual(null);
          expect(false).toBeTruthy();
        }
      });
    });

    describe('When game title is null', () => {
      beforeEach(() => {
        component.gameTitle = null;
      });

      it('should throw error', () => {
        try {
          fixture.detectChanges();

          expect(false).toBeTruthy();
        } catch (e) {
          expect(true).toBeTruthy();
          expect(e.message).toEqual('No game title is defined for gift history results.');
        }
      });
    });

    describe('When game title is provided', () => {
      beforeEach(() => {
        component.gameTitle = GameTitle.FH4;
      });

      // Provided by default in the test component
      it('should not throw error', () => {
        try {
          fixture.detectChanges();

          expect(true).toBeTruthy();
        } catch (e) {
          expect(e).toEqual(null);
          expect(false).toBeTruthy();
        }
      });
    });
  });

  describe('Method: ngOnChanges', () => {
    beforeEach(() => {
      // Need to subscribe to intermediate observable to verify component variable set correctly.
      component.ngOnInit();
      component.generateItemsList = jasmine.createSpy('generateItemsList');
      component.generateDescriptionList = jasmine.createSpy('generateDescriptionList');
    });
    describe('when usingPlayerIdentities set to true', () => {
      beforeEach(() => {
        component.usingPlayerIdentities = true;
      });
      describe('when selectedPlayer is valid', () => {
        beforeEach(() => {
          component.selectedPlayer = { query: { xuid: new BigNumber(123456789) } };
        });
        describe('when service returns valid gift histories', () => {
          const validGiftHistories: (GiftHistoryResultUnion & GiftHistoryView)[] = [];
          beforeEach(() => {
            component.service.getGiftHistoryByPlayer$ = jasmine
              .createSpy('service.getGiftHistoryByPlayer$$')
              .and.returnValue(of(validGiftHistories));
          });
          it('should set gift histories to returned list.', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            component.ngOnChanges(<any>null);
            expect(component.giftHistoryList).toEqual(validGiftHistories);
          });
        });
        describe('when service returns error', () => {
          const errorMessage = 'Failed to retrieve history.';
          beforeEach(() => {
            component.service.getGiftHistoryByPlayer$ = jasmine
              .createSpy('service.getGiftHistoryByPlayer$')
              .and.returnValue(throwError(errorMessage));
          });
          it('should handle error response.', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            component.ngOnChanges(<any>null);
            expect(component.giftHistoryList).toBeUndefined();
            expect(component.getHistoryMonitor.status.error).toEqual(errorMessage);
          });
        });
      });
    });
    describe('when usingPlayerIdentities set to false', () => {
      beforeEach(() => {
        component.usingPlayerIdentities = false;
      });
      describe('when selectedGroup is valid', () => {
        beforeEach(() => {
          component.selectedGroup = { id: new BigNumber(4), name: 'testName' };
        });
        describe('when service returns valid gift histories', () => {
          const validGiftHistories: (GiftHistoryResultUnion & GiftHistoryView)[] = [];
          beforeEach(() => {
            component.service.getGiftHistoryByLspGroup$ = jasmine
              .createSpy('service.getGiftHistoryByLspGroup$')
              .and.returnValue(of(validGiftHistories));
          });
          it('should set gift histories to returned list.', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            component.ngOnChanges(<any>null);
            expect(component.giftHistoryList).toEqual(validGiftHistories);
          });
        });
        describe('when service returns error', () => {
          const errorMessage = 'Failed to retrieve history.';
          beforeEach(() => {
            component.service.getGiftHistoryByLspGroup$ = jasmine
              .createSpy('service.getGiftHistoryByLspGroup$')
              .and.returnValue(throwError(errorMessage));
          });
          it('should handle error response.', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            component.ngOnChanges(<any>null);
            expect(component.giftHistoryList).toBeUndefined();
            expect(component.getHistoryMonitor.status.error).toEqual(errorMessage);
          });
        });
      });
    });
  });

  describe('Method: generateItemsList', () => {
    it('should build and return the correct object', () => {
      const response = component.generateItemsList(fakeGiftHistory);

      const creditRewards = response.find(d => d.title === 'Credit Rewards');
      const cars = response.find(d => d.title === 'Cars');
      const carHorns = response.find(d => d.title === 'Car Horns');
      const vanityItems = response.find(d => d.title === 'Vanity Items');
      const emotes = response.find(d => d.title === 'Emotes');
      const quickChatLines = response.find(d => d.title === 'Quick Chat Lines');

      expect(creditRewards).not.toBeUndefined();
      expect(creditRewards.items.length).toEqual(
        fakeGiftHistory.giftInventory.inventory.creditRewards.length,
      );
      expect(creditRewards.items[0].id).toEqual(
        fakeGiftHistory.giftInventory.inventory.creditRewards[0].id,
      );

      expect(cars).not.toBeUndefined();
      expect(cars.items.length).toEqual(fakeGiftHistory.giftInventory.inventory.cars.length);
      expect(cars.items[0].id).toEqual(fakeGiftHistory.giftInventory.inventory.cars[0].id);

      expect(carHorns).not.toBeUndefined();
      expect(carHorns.items.length).toEqual(
        fakeGiftHistory.giftInventory.inventory.carHorns.length,
      );
      expect(carHorns.items[0].id).toEqual(fakeGiftHistory.giftInventory.inventory.carHorns[0].id);

      expect(vanityItems).not.toBeUndefined();
      expect(vanityItems.items.length).toEqual(
        fakeGiftHistory.giftInventory.inventory.vanityItems.length,
      );
      expect(vanityItems.items[0].id).toEqual(
        fakeGiftHistory.giftInventory.inventory.vanityItems[0].id,
      );

      expect(emotes).not.toBeUndefined();
      expect(emotes.items.length).toEqual(fakeGiftHistory.giftInventory.inventory.emotes.length);
      expect(emotes.items[0].id).toEqual(fakeGiftHistory.giftInventory.inventory.emotes[0].id);

      expect(quickChatLines).not.toBeUndefined();
      expect(quickChatLines.items.length).toEqual(
        fakeGiftHistory.giftInventory.inventory.quickChatLines.length,
      );
      expect(quickChatLines.items[0].id).toEqual(
        fakeGiftHistory.giftInventory.inventory.quickChatLines[0].id,
      );
    });
  });

  describe('Method: generateDescriptionList', () => {
    it('should build and return the correct object', () => {
      const response = component.generateDescriptionList(fakeGiftHistory);

      const creditRewards = response.find(d => d.title === 'Credit Rewards');
      const cars = response.find(d => d.title === 'Cars');
      const carHorns = response.find(d => d.title === 'Car Horns');
      const vanityItems = response.find(d => d.title === 'Vanity Items');
      const emotes = response.find(d => d.title === 'Emotes');
      const quickChatLines = response.find(d => d.title === 'Quick Chat Lines');

      expect(creditRewards).not.toBeUndefined();
      expect(creditRewards.quantity).toEqual(
        fakeGiftHistory.giftInventory.inventory.creditRewards.length,
      );

      expect(cars).not.toBeUndefined();
      expect(cars.quantity).toEqual(fakeGiftHistory.giftInventory.inventory.cars.length);

      expect(carHorns).not.toBeUndefined();
      expect(carHorns.quantity).toEqual(fakeGiftHistory.giftInventory.inventory.carHorns.length);

      expect(vanityItems).not.toBeUndefined();
      expect(vanityItems.quantity).toEqual(
        fakeGiftHistory.giftInventory.inventory.vanityItems.length,
      );

      expect(emotes).not.toBeUndefined();
      expect(emotes.quantity).toEqual(fakeGiftHistory.giftInventory.inventory.emotes.length);

      expect(quickChatLines).not.toBeUndefined();
      expect(quickChatLines.quantity).toEqual(
        fakeGiftHistory.giftInventory.inventory.quickChatLines.length,
      );
    });
  });
});
