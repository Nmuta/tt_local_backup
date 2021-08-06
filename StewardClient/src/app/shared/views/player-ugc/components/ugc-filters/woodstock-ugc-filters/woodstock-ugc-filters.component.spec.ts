import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { WoodstockUGCFiltersComponent } from './woodstock-ugc-filters.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { UGCAccessLevel, UGCFilters, UGCOrderBy, UGCType } from '@models/ugc-filters';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { KustoCar } from '@models/kusto-car';
import { WoodstockKustoCarsFakeApi } from '@interceptors/fake-api/apis/title/woodstock/kusto/cars';
import faker from 'faker';

describe('WoodstockUGCFiltersComponent', () => {
  let fixture: ComponentFixture<WoodstockUGCFiltersComponent>;
  let component: WoodstockUGCFiltersComponent;

  // const formBuilder: FormBuilder = new FormBuilder();
  let mockStore: Store;
  let fakeKustoCars: KustoCar[];

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot(),
          ReactiveFormsModule,
          MatAutocompleteModule,
        ],
        declarations: [WoodstockUGCFiltersComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
      }).compileComponents();

      const injector = getTestBed();
      mockStore = injector.inject(Store);

      fixture = TestBed.createComponent(WoodstockUGCFiltersComponent);
      component = fixture.debugElement.componentInstance;

      mockStore.select = jasmine.createSpy('select').and.returnValue(of([]));
      mockStore.dispatch = jasmine.createSpy('dispatch').and.returnValue(of({}));

      fakeKustoCars = WoodstockKustoCarsFakeApi.make();
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: searchFilters', () => {
    let carInput: KustoCar;
    const testUgcFilters = {
      type: UGCType.Livery,
      carId: fakeBigNumber(),
      makeId: fakeBigNumber(),
      keyword: faker.random.word(),
      accessLevel: UGCAccessLevel.Any,
      orderBy: UGCOrderBy.CreatedDateDesc,
    } as UGCFilters;

    beforeEach(() => {
      component.changes.emit = jasmine.createSpy('changes.emit');
      carInput = fakeKustoCars[0];
      component.formControls.makeModelInput.setValue('');
      component.formControls.keyword.setValue(testUgcFilters.keyword);
      component.formControls.type.setValue(testUgcFilters.type);
      component.formControls.accessLevel.setValue(testUgcFilters.accessLevel);
      component.formControls.orderBy.setValue(testUgcFilters.orderBy);
    });

    describe('When makeModelInput is null', () => {
      it('should correctly emit UGCFilters', () => {
        component.searchFilters();

        expect(component.changes.emit).toHaveBeenCalledWith({
          carId: undefined,
          makeId: undefined,
          keyword: testUgcFilters.keyword,
          type: testUgcFilters.type,
          accessLevel: testUgcFilters.accessLevel,
          orderBy: testUgcFilters.orderBy,
        } as UGCFilters);
      });
    });

    describe('When makeModelInput is a Kusto car with an id', () => {
      beforeEach(() => {
        component.formControls.makeModelInput.setValue(carInput);
      });

      it('should correctly emit UGCFilters', () => {
        component.searchFilters();

        expect(component.changes.emit).toHaveBeenCalledWith({
          carId: carInput.id,
          makeId: undefined,
          keyword: testUgcFilters.keyword,
          type: testUgcFilters.type,
          accessLevel: testUgcFilters.accessLevel,
          orderBy: testUgcFilters.orderBy,
        } as UGCFilters);
      });
    });

    describe('When makeModelInput is a Kusto car with its makeOnly flag set', () => {
      beforeEach(() => {
        carInput.makeOnly = true;
        component.formControls.makeModelInput.setValue(carInput);
      });

      it('should correctly emit UGCFilters', () => {
        component.searchFilters();

        expect(component.changes.emit).toHaveBeenCalledWith({
          carId: undefined,
          makeId: carInput.makeId,
          keyword: testUgcFilters.keyword,
          type: testUgcFilters.type,
          accessLevel: testUgcFilters.accessLevel,
          orderBy: testUgcFilters.orderBy,
        } as UGCFilters);
      });
    });
  });
});
