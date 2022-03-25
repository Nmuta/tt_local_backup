import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';
import { SunriseCreditHistoryComponent } from './sunrise-credit-history.component';
import { first } from 'lodash';
import { SunrisePlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/players/identities';
import { fakeXuid } from '@interceptors/fake-api/utility';

describe('SunriseCreditHistoryComponent', () => {
  let component: SunriseCreditHistoryComponent;
  let fixture: ComponentFixture<SunriseCreditHistoryComponent>;

  const testXuid = fakeXuid();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunriseCreditHistoryComponent],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseCreditHistoryComponent);
    component = fixture.componentInstance;
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
        component.identity = first(SunrisePlayersIdentitiesFakeApi.make([{ xuid: testXuid }]));
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
        component.identity = first(SunrisePlayersIdentitiesFakeApi.make([{ xuid: testXuid }]));
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

    it('should call getCreditUpdates$.next()', () => {
      component.loadMoreCreditUpdates();

      expect(component.getCreditUpdates$.next).toHaveBeenCalled();
    });
  });
});
