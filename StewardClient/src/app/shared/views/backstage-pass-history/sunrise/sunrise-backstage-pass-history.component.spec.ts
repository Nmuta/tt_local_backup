import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';
import { SunriseBackstagePassHistoryComponent } from './sunrise-backstage-pass-history.component';
import { first } from 'lodash';
import { SunrisePlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/players/identities';
import { fakeXuid } from '@interceptors/fake-api/utility';

describe('SunriseBackstagePassHistoryComponent', () => {
  let component: SunriseBackstagePassHistoryComponent;
  let fixture: ComponentFixture<SunriseBackstagePassHistoryComponent>;

  const testXuid = fakeXuid();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunriseBackstagePassHistoryComponent],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseBackstagePassHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    component.getBackstagePassHistory$.next = jasmine
      .createSpy('getBackstagePassHistory$.next')
      .and.callThrough();
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('Method: ngOnInit', () => {
    beforeEach(() => {
      component.getBackstagePassHistory$.next = jasmine
        .createSpy('getBackstagePassHistory$.next')
        .and.callThrough();
    });

    describe('When there is a valid identity in the component', () => {
      beforeEach(() => {
        component.identity = first(SunrisePlayersIdentitiesFakeApi.make([{ xuid: testXuid }]));
      });

      it('should call getBackstagePassHistory$.next()', () => {
        component.ngOnInit();

        expect(component.getBackstagePassHistory$.next).toHaveBeenCalled();
      });
    });

    describe('When there is not a valid identity in the component', () => {
      beforeEach(() => {
        component.identity = undefined;
      });

      it('should not call getBackstagePassHistory$.next()', () => {
        component.ngOnInit();

        expect(component.getBackstagePassHistory$.next).not.toHaveBeenCalled();
      });
    });
  });

  describe('Method: ngOnChanges', () => {
    beforeEach(() => {
      component.getBackstagePassHistory$.next = jasmine.createSpy('getBackstagePassHistory$.next');
    });

    describe('When there is a valid identity in the component', () => {
      beforeEach(() => {
        component.identity = first(SunrisePlayersIdentitiesFakeApi.make([{ xuid: testXuid }]));
      });

      it('should call getBackstagePassHistory$.next()', () => {
        component.ngOnChanges();

        expect(component.getBackstagePassHistory$.next).toHaveBeenCalled();
      });
    });

    describe('When there is not a valid identity in the component', () => {
      beforeEach(() => {
        component.identity = undefined;
      });

      it('should not call getBackstagePassHistory$.next()', () => {
        component.ngOnChanges();

        expect(component.getBackstagePassHistory$.next).not.toHaveBeenCalled();
      });
    });
  });
});
