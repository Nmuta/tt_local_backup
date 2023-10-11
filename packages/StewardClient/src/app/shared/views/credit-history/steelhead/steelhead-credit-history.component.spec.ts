import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { first } from 'lodash';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { createMockSteelheadPlayerCreditUpdatesService } from '@services/api-v2/steelhead/player/credit-updates/steelhead-credit-updates.mock';
import { SteelheadCreditHistoryComponent } from './steelhead-credit-history.component';
import { SteelheadPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/steelhead/players/identities';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';
import { createStandardTestModuleMetadata } from '@mocks/standard-test-module-metadata';

describe('SteelheadCreditHistoryComponent', () => {
  let component: SteelheadCreditHistoryComponent;
  let fixture: ComponentFixture<SteelheadCreditHistoryComponent>;

  const testXuid = fakeXuid();

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadata({
        declarations: [SteelheadCreditHistoryComponent, HumanizePipe],
        providers: [createMockSteelheadPlayerCreditUpdatesService()],
        schemas: [NO_ERRORS_SCHEMA],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelheadCreditHistoryComponent);
    component = fixture.componentInstance;
    component.getEndpoint = jasmine.createSpy('getEndpoint').and.returnValue('');
    fixture.detectChanges();
  });

  beforeEach(() => {
    component.getCreditUpdates$.next = jasmine
      .createSpy('getCreditUpdates$.next')
      .and.callThrough();
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('Method: ngOnInit', () => {
    beforeEach(() => {
      component.getCreditUpdates$.next = jasmine
        .createSpy('getCreditUpdates$.next')
        .and.callThrough();
    });

    describe('When there is a valid identity in the component', () => {
      beforeEach(() => {
        component.identity = first(SteelheadPlayersIdentitiesFakeApi.make([{ xuid: testXuid }]));
      });

      it('should call getCreditUpdates$.next()', () => {
        component.ngOnInit();

        expect(component.getCreditUpdates$.next).toHaveBeenCalled();
      });
    });

    describe('When there is not a valid identity in the component', () => {
      beforeEach(() => {
        component.identity = undefined;
      });

      it('should not call getCreditUpdates$.next()', () => {
        component.ngOnInit();

        expect(component.getCreditUpdates$.next).not.toHaveBeenCalled();
      });
    });
  });

  describe('Method: ngOnChanges', () => {
    beforeEach(() => {
      component.getCreditUpdates$.next = jasmine.createSpy('getCreditUpdates$.next');
    });

    describe('When there is a valid identity in the component', () => {
      beforeEach(() => {
        component.identity = first(SteelheadPlayersIdentitiesFakeApi.make([{ xuid: testXuid }]));
      });

      it('should call getCreditUpdates$.next()', () => {
        component.ngOnChanges();

        expect(component.getCreditUpdates$.next).toHaveBeenCalled();
      });
    });

    describe('When there is not a valid identity in the component', () => {
      beforeEach(() => {
        component.identity = undefined;
      });

      it('should not call getCreditUpdates$.next()', () => {
        component.ngOnChanges();

        expect(component.getCreditUpdates$.next).not.toHaveBeenCalled();
      });
    });
  });

  describe('Method: loadMoreCreditUpdates', () => {
    beforeEach(() => {
      component.getCreditUpdates$.next = jasmine.createSpy('getCreditUpdates$.next');
    });

    it('should call getCreditUpdates$.next() and shouldLoadAllCreditUpdates should be false', () => {
      component.loadMoreCreditUpdates();

      expect(component.shouldLoadAllCreditUpdates).toBeFalsy();
      expect(component.getCreditUpdates$.next).toHaveBeenCalled();
    });
  });

  describe('Method: loadAllCreditUpdates', () => {
    beforeEach(() => {
      component.getCreditUpdates$.next = jasmine.createSpy('getCreditUpdates$.next');
    });

    it('should call getCreditUpdates$.next() and shouldLoadAllCreditUpdates should be true', () => {
      component.loadAllCreditUpdates();

      expect(component.shouldLoadAllCreditUpdates).toBeTruthy();
      expect(component.getCreditUpdates$.next).toHaveBeenCalled();
    });
  });
});
