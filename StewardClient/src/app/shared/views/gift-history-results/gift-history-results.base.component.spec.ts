import { NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SunriseGiftHistories } from '@models/sunrise';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';
import { Observable, of, Subject, throwError } from 'rxjs';
import { GiftHistoryResultsBaseComponent } from './gift-history-results.base.component';

describe('SunriseGiftHistoryComponent', () => {
  let component: GiftHistoryResultsBaseComponent<IdentityResultAlpha, SunriseGiftHistories>;
  let fixture: ComponentFixture<GiftHistoryResultsBaseComponent<IdentityResultAlpha, SunriseGiftHistories>>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [GiftHistoryResultsBaseComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
      }).compileComponents();
 
      fixture = TestBed.createComponent(
        GiftHistoryResultsBaseComponent as Type<GiftHistoryResultsBaseComponent<IdentityResultAlpha, SunriseGiftHistories>>,
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
    describe('when usingPlayerIdentities set to true', () => {
      beforeEach(() => {
        component.usingPlayerIdentities = true;
      });
      describe('when selectedPlayer is undefined', () => {
        beforeEach(() => {
          component.selectedPlayer = undefined;
          component.cancelGiftHistoryRequest$ = new Subject<void>();
          (component.cancelGiftHistoryRequest$ as Subject<void>).next = jasmine.createSpy('next');
          (component.cancelGiftHistoryRequest$ as Subject<void>).complete = jasmine.createSpy('complete');
        });
        it('should handle invalid player input.', () => {
          component.ngOnChanges(null);
          expect(component.giftHistoryList).toBeUndefined();
          expect((component.cancelGiftHistoryRequest$ as Subject<void>).next).toHaveBeenCalled();
          expect((component.cancelGiftHistoryRequest$ as Subject<void>).complete).toHaveBeenCalled();
        });
      });
      describe('when selectedPlayer is valid', () => {
        beforeEach(() => {          
          component.selectedPlayer = {query: {xuid: BigInt(123456789)}};
        });
        describe('when service returns valid gift histories', () => {
          const validGiftHistories: SunriseGiftHistories = [];
          beforeEach(() => {
            component.retrieveHistoryByPlayer = jasmine.createSpy('retrieveHistoryByPlayer').and.returnValue(of(validGiftHistories));
          });
          it('should set gift histories to returned list.', () => {
            component.ngOnChanges(null);
            expect(component.giftHistoryList).toEqual(validGiftHistories);
          });
        });
        describe('when service returns error', () => {
          const errorMessage = 'Failed to retrieve history.';
          beforeEach(() => {
            component.retrieveHistoryByPlayer = jasmine.createSpy('retrieveHistoryByPlayer').and.returnValue(throwError(errorMessage));
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
      describe('when selectedGroup is undefined', () => {
        beforeEach(() => {
          component.selectedGroup = undefined;
          component.cancelGiftHistoryRequest$ = new Subject<void>();
          (component.cancelGiftHistoryRequest$ as Subject<void>).next = jasmine.createSpy('next');
          (component.cancelGiftHistoryRequest$ as Subject<void>).complete = jasmine.createSpy('complete');
        });
        it('should handle invalid player input.', () => {
          component.ngOnChanges(null);
          expect(component.giftHistoryList).toBeUndefined();
          expect((component.cancelGiftHistoryRequest$ as Subject<void>).next).toHaveBeenCalled();
          expect((component.cancelGiftHistoryRequest$ as Subject<void>).complete).toHaveBeenCalled();
        });
      });
      describe('when selectedGroup is valid', () => {
        beforeEach(() => {          
          component.selectedGroup = {id: 4, name: 'testName'};
        });
        describe('when service returns valid gift histories', () => {
          const validGiftHistories: SunriseGiftHistories = [];
          beforeEach(() => {
            component.retrieveHistoryByLspGroup = jasmine.createSpy('retrieveHistoryByLspGroup').and.returnValue(of(validGiftHistories));
          });
          it('should set gift histories to returned list.', () => {
            component.ngOnChanges(null);
            expect(component.giftHistoryList).toEqual(validGiftHistories);
          });
        });
        describe('when service returns error', () => {
          const errorMessage = 'Failed to retrieve history.';
          beforeEach(() => {
            component.retrieveHistoryByLspGroup = jasmine.createSpy('retrieveHistoryByLspGroup').and.returnValue(throwError(errorMessage));
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
});
