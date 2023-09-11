import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { WoodstockUgcFiltersComponent } from './woodstock-ugc-filters.component';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { UgcAccessLevel, UgcFilters, UgcOrderBy, UgcType } from '@models/ugc-filters';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { SimpleCar } from '@models/cars';
import { WoodstockSimpleCarsFakeApi } from '@interceptors/fake-api/apis/title/woodstock/kusto/cars';
import faker from '@faker-js/faker';

describe('WoodstockUgcFiltersComponent', () => {
  let fixture: ComponentFixture<WoodstockUgcFiltersComponent>;
  let component: WoodstockUgcFiltersComponent;

  // const formBuilder: FormBuilder = new FormBuilder();
  let mockStore: Store;
  let fakeSimpleCars: SimpleCar[];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot(),
        ReactiveFormsModule,
        MatAutocompleteModule,
      ],
      declarations: [WoodstockUgcFiltersComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [],
    }).compileComponents();

    const injector = getTestBed();
    mockStore = injector.inject(Store);

    fixture = TestBed.createComponent(WoodstockUgcFiltersComponent);
    component = fixture.debugElement.componentInstance;

    mockStore.select = jasmine.createSpy('select').and.returnValue(of([]));
    mockStore.dispatch = jasmine.createSpy('dispatch').and.returnValue(of({}));

    fakeSimpleCars = WoodstockSimpleCarsFakeApi.make();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: searchFilters', () => {
    let carInput: SimpleCar;
    const testUgcFilters = {
      type: UgcType.Livery,
      carId: fakeBigNumber(),
      makeId: fakeBigNumber(),
      keyword: faker.random.word(),
      accessLevel: UgcAccessLevel.Any,
      orderBy: UgcOrderBy.CreatedDateDesc,
    } as UgcFilters;

    beforeEach(() => {
      component.changes.emit = jasmine.createSpy('changes.emit');
      carInput = fakeSimpleCars[0];
      component.formControls.makeModelInput.setValue('');
      component.formControls.keyword.setValue(testUgcFilters.keyword);
      component.formControls.accessLevel.setValue(testUgcFilters.accessLevel);
      component.formControls.orderBy.setValue(testUgcFilters.orderBy);
    });

    describe('When makeModelInput is null', () => {
      it('should correctly emit UgcFilters', () => {
        component.searchFilters();

        expect(component.changes.emit).toHaveBeenCalledWith({
          carId: undefined,
          makeId: undefined,
          keyword: testUgcFilters.keyword,
          accessLevel: testUgcFilters.accessLevel,
          orderBy: testUgcFilters.orderBy,
        } as UgcFilters);
      });
    });

    describe('When makeModelInput is a Kusto car with an id', () => {
      beforeEach(() => {
        component.formControls.makeModelInput.setValue(carInput);
      });

      it('should correctly emit UgcFilters', () => {
        component.searchFilters();

        expect(component.changes.emit).toHaveBeenCalledWith({
          carId: carInput.id,
          makeId: undefined,
          keyword: testUgcFilters.keyword,
          accessLevel: testUgcFilters.accessLevel,
          orderBy: testUgcFilters.orderBy,
        } as UgcFilters);
      });
    });

    describe('When makeModelInput is a Kusto car with its makeOnly flag set', () => {
      beforeEach(() => {
        carInput.makeOnly = true;
        component.formControls.makeModelInput.setValue(carInput);
      });

      it('should correctly emit UgcFilters', () => {
        component.searchFilters();

        expect(component.changes.emit).toHaveBeenCalledWith({
          carId: undefined,
          makeId: carInput.makeId,
          keyword: testUgcFilters.keyword,
          accessLevel: testUgcFilters.accessLevel,
          orderBy: testUgcFilters.orderBy,
        } as UgcFilters);
      });
    });
  });
});
