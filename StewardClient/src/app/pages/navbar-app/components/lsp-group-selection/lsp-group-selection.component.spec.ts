import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LspGroupSelectionBaseComponent } from './lsp-group-selection.base.component';
import { of } from 'rxjs';
import { throwError } from 'rxjs';
import { LspGroup } from '@models/lsp-group';

describe('LspGroupSelectionBaseComponent', () => {
  let fixture: ComponentFixture<LspGroupSelectionBaseComponent>;
  let component: LspGroupSelectionBaseComponent;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot(),
        ],
        declarations: [LspGroupSelectionBaseComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(
        LspGroupSelectionBaseComponent as Type<LspGroupSelectionBaseComponent>,
      );
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    beforeEach(() => {
      component.dispatchLspGroupStoreAction = jasmine.createSpy('dispatchLspGroupStoreAction');
      component.lspGroupSelector = jasmine.createSpy('lspGroupSelector').and.returnValue(of([]));
    });

    it('should call dispatchLspGroupStoreAction', () => {
      component.ngOnInit();

      expect(component.dispatchLspGroupStoreAction).toHaveBeenCalled();
    });

    describe('When lspGroupSelector observable returns valid data', () => {
      const testData = [{ id: new BigNumber(0), name: 'test-1' }];
      beforeEach(() => {
        component.lspGroupSelector = jasmine
          .createSpy('lspGroupSelector')
          .and.returnValue(of(testData));
      });

      it('should set component varaibles correctly', () => {
        component.ngOnInit();

        expect(component.isLoading).toBeFalsy();
        expect(component.loadError).toBeUndefined();
        expect(component.lspGroups).toEqual(testData);
      });
    });

    describe('When lspGroupSelector observable throws an error', () => {
      const errorMessage = 'Test error';
      beforeEach(() => {
        component.lspGroupSelector = jasmine
          .createSpy('lspGroupSelector')
          .and.returnValue(throwError(errorMessage));
      });

      it('should set component varaibles correctly', () => {
        component.ngOnInit();

        expect(component.isLoading).toBeFalsy();
        expect(component.loadError).not.toBeUndefined();
        expect(component.loadError).toEqual(errorMessage);
        expect(component.lspGroups).toEqual([]);
      });
    });
  });

  describe('Method: clearSelection', () => {
    beforeEach(() => {
      component.lspInputValue = 'test';
      component.emitNewSelection = jasmine.createSpy('emitNewSelection');
    });

    it('should set lspInputValue to empty string', () => {
      component.clearSelection();

      expect(component.lspInputValue).toEqual('');
    });

    it('should call emitNewSelection', () => {
      component.clearSelection();

      expect(component.emitNewSelection).toHaveBeenCalledWith(null);
    });
  });

  describe('Method: displayFn', () => {
    let lspGroup: LspGroup;
    describe('If name in lspGroup is defined', () => {
      const lspGroupName = 'test-1';
      beforeEach(() => {
        lspGroup = { id: new BigNumber(0), name: lspGroupName };
      });

      it('should return test-1', () => {
        const response = component.displayFn(lspGroup);

        expect(response).toEqual(lspGroupName);
      });
    });

    describe('If name in lspGroup is defined', () => {
      beforeEach(() => {
        lspGroup = null;
      });

      it('should return empty string', () => {
        const response = component.displayFn(lspGroup);

        expect(response).toEqual('');
      });
    });
  });

  describe('Method: writeValue', () => {
    const testLspGroup = { id: new BigNumber(0), name: 'test-1' };

    it('should set selectedLspGroup to given value', () => {
      component.writeValue(testLspGroup);

      expect(component.selectedLspGroup).toEqual(testLspGroup);
    });
  });
});
