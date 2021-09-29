import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BulkBanHistoryInputComponent } from './bulk-ban-history-input.component';
import { fakeXuid } from '@interceptors/fake-api/utility';

describe('BulkBanHistoryInputComponent', () => {
  let component: BulkBanHistoryInputComponent;
  let fixture: ComponentFixture<BulkBanHistoryInputComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot(),
          MatPaginatorModule,
        ],
        declarations: [BulkBanHistoryInputComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(BulkBanHistoryInputComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: emitInputChanges', () => {
    beforeEach(() => {
      component.selection.emit = jasmine.createSpy('changes.emit');

      // Initialize with valid form controls
      component.formControls.woodstockEnvs.setValue(['Retail']);
      component.formControls.sunriseEnvs.setValue(['Retail']);
      component.formControls.apolloEnvs.setValue(['Retail']);
      component.formControls.xuids.setValue(`${fakeXuid()},${fakeXuid()},${fakeXuid()}`);
    });
    describe('When isLookupReady returns false', () => {
      beforeEach(() => {
        component.isLookupReady = jasmine.createSpy('isLookupReady').and.returnValue(false);
      });

      it('should not call changes.emit()', () => {
        component.emitInputChanges();
        expect(component.selection.emit).not.toHaveBeenCalled();
      });
    });

    describe('When isLookupReady returns true', () => {
      beforeEach(() => {
        component.isLookupReady = jasmine.createSpy('isLookupReady').and.returnValue(true);
      });

      it('should call changes.emit()', () => {
        component.emitInputChanges();
        expect(component.selection.emit).toHaveBeenCalled();
      });
    });
  });

  describe('Method: isLookupReady', () => {
    beforeEach(() => {
      // Initialize with valid form controls
      component.formControls.woodstockEnvs.setValue(['Retail']);
      component.formControls.sunriseEnvs.setValue(['Retail']);
      component.formControls.apolloEnvs.setValue(['Retail']);
      component.formControls.xuids.setValue(`${fakeXuid()},${fakeXuid()},${fakeXuid()}`);
    });

    describe('When all form controls are valid', () => {
      it('should return true', () => {
        const response = component.isLookupReady();
        expect(response).toBeTruthy();
      });
    });

    describe('If xuids is not valid', () => {
      beforeEach(() => {
        component.formControls.xuids.setValue('');
      });

      it('should return false', () => {
        const response = component.isLookupReady();
        expect(response).toBeFalsy();
      });
    });

    describe('If no environment is selected', () => {
      beforeEach(() => {
        component.formControls.woodstockEnvs.setValue([]);
        component.formControls.sunriseEnvs.setValue([]);
        component.formControls.apolloEnvs.setValue([]);
      });

      it('should return false', () => {
        const response = component.isLookupReady();
        expect(response).toBeFalsy();
      });
    });
  });
});
