import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SunriseGiftHistory } from '@models/sunrise';
import { of, throwError } from 'rxjs';
import { GiftHistoryResultsBaseComponent } from './gift-history-results.base.component';
import { MasterInventoryItem } from '@models/master-inventory-item';
import { GiftHistoryView } from './gift-history-results.base.component';
import faker from 'faker';

describe('GiftHistoryResultsBaseComponent', () => {
  let component: GiftHistoryResultsBaseComponent<IdentityResultAlpha, SunriseGiftHistory>;
  let fixture: ComponentFixture<GiftHistoryResultsBaseComponent<
    IdentityResultAlpha,
    SunriseGiftHistory
  >>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [GiftHistoryResultsBaseComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(
        GiftHistoryResultsBaseComponent as Type<
          GiftHistoryResultsBaseComponent<IdentityResultAlpha, SunriseGiftHistory>
        >,
      );
      component = fixture.debugElement.componentInstance;
    }),
  );

  it(
    'should create',
    waitForAsync(() => {
      expect(component).toBeTruthy();
    }),
  );

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
          const validGiftHistories: (SunriseGiftHistory & GiftHistoryView)[] = [];
          beforeEach(() => {
            component.retrieveHistoryByPlayer = jasmine
              .createSpy('retrieveHistoryByPlayer')
              .and.returnValue(of(validGiftHistories));
          });
          it('should set gift histories to returned list.', () => {
            component.ngOnChanges(null);
            expect(component.giftHistoryList).toEqual(validGiftHistories);
          });
        });
        describe('when service returns error', () => {
          const errorMessage = 'Failed to retrieve history.';
          beforeEach(() => {
            component.retrieveHistoryByPlayer = jasmine
              .createSpy('retrieveHistoryByPlayer')
              .and.returnValue(throwError(errorMessage));
          });
          it('should handle error response.', () => {
            component.ngOnChanges(null);
            expect(component.giftHistoryList).toBeUndefined();
            expect(component.loadError).toEqual(errorMessage);
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
          const validGiftHistories: (SunriseGiftHistory & GiftHistoryView)[] = [];
          beforeEach(() => {
            component.retrieveHistoryByLspGroup = jasmine
              .createSpy('retrieveHistoryByLspGroup')
              .and.returnValue(of(validGiftHistories));
          });
          it('should set gift histories to returned list.', () => {
            component.ngOnChanges(null);
            expect(component.giftHistoryList).toEqual(validGiftHistories);
          });
        });
        describe('when service returns error', () => {
          const errorMessage = 'Failed to retrieve history.';
          beforeEach(() => {
            component.retrieveHistoryByLspGroup = jasmine
              .createSpy('retrieveHistoryByLspGroup')
              .and.returnValue(throwError(errorMessage));
          });
          it('should handle error response.', () => {
            component.ngOnChanges(null);
            expect(component.giftHistoryList).toBeUndefined();
            expect(component.loadError).toEqual(errorMessage);
          });
        });
      });
    });
  });

  describe('Method: makeItemList', () => {
    const title = 'test-title';
    const giftItems = [
      {
        id: new BigNumber(faker.datatype.number()),
        description: faker.random.words(10),
        quantity: faker.datatype.number(),
        itemType: 'creditRewards',
      },
    ] as MasterInventoryItem[];
    it('should generate a MasterInventoryItemList', () => {
      const itemList = component.makeItemList(title, giftItems);

      expect(itemList.title).toEqual(title);
      expect(itemList.description).toEqual('1 Total');
      expect(itemList.items).toEqual(giftItems);
    });
  });
});
