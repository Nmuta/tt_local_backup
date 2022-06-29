import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { UgcSearchFilters, UgcType } from '@models/ugc-filters';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { DetailedCar } from '@models/detailed-car';
import { WoodstockDetailedCarsFakeApi } from '@interceptors/fake-api/apis/title/woodstock/kusto/cars';
import faker from '@faker-js/faker';
import { UgcSearchFiltersComponent } from './ugc-search-filters.component';

describe('UgcSearchFiltersComponent', () => {
  let fixture: ComponentFixture<UgcSearchFiltersComponent>;
  let component: UgcSearchFiltersComponent;

  let mockStore: Store;
  let fakeDetailedCars: DetailedCar[];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot(),
        ReactiveFormsModule,
        MatAutocompleteModule,
      ],
      declarations: [UgcSearchFiltersComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [],
    }).compileComponents();

    const injector = getTestBed();
    mockStore = injector.inject(Store);

    fixture = TestBed.createComponent(UgcSearchFiltersComponent);
    component = fixture.debugElement.componentInstance;

    mockStore.select = jasmine.createSpy('select').and.returnValue(of([]));
    mockStore.dispatch = jasmine.createSpy('dispatch').and.returnValue(of({}));

    fakeDetailedCars = WoodstockDetailedCarsFakeApi.make();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: searchParameters', () => {
    let carInput: DetailedCar;
    const testUgcSearchParameters = {
      xuid: fakeBigNumber(),
      ugcType: UgcType.Livery,
      carId: fakeBigNumber(),
      keywords: faker.random.word(),
      isFeatured: faker.datatype.boolean(),
    } as UgcSearchFilters;

    beforeEach(() => {
      component.changes.emit = jasmine.createSpy('changes.emit');
      carInput = fakeDetailedCars[0];
      component.formControls.ugcType.setValue(testUgcSearchParameters.ugcType);
      component.formControls.makeModelInput.setValue('');
      component.formControls.keywords.setValue(testUgcSearchParameters.keywords);
      component.formControls.isFeatured.setValue(testUgcSearchParameters.isFeatured);
    });

    describe('When makeModelInput is null', () => {
      it('should correctly emit UgcSearchParameters', () => {
        component.emitFilterParameters();

        expect(component.changes.emit).toHaveBeenCalledWith({
          xuid: undefined,
          ugcType: testUgcSearchParameters.ugcType,
          carId: undefined,
          keywords: testUgcSearchParameters.keywords,
          isFeatured: testUgcSearchParameters.isFeatured,
        } as UgcSearchFilters);
      });
    });

    describe('When makeModelInput is a Kusto car with an id', () => {
      beforeEach(() => {
        component.formControls.makeModelInput.setValue(carInput);
      });

      it('should correctly emit UgcSearchParameters', () => {
        component.emitFilterParameters();

        expect(component.changes.emit).toHaveBeenCalledWith({
          xuid: undefined,
          ugcType: testUgcSearchParameters.ugcType,
          carId: carInput.id,
          keywords: testUgcSearchParameters.keywords,
          isFeatured: testUgcSearchParameters.isFeatured,
        } as UgcSearchFilters);
      });
    });

    describe('When makeModelInput is a Kusto car with its makeOnly flag set', () => {
      beforeEach(() => {
        carInput.makeOnly = true;
        component.formControls.makeModelInput.setValue(carInput);
      });

      it('should correctly emit UgcSearchParameters', () => {
        component.emitFilterParameters();

        expect(component.changes.emit).toHaveBeenCalledWith({
          xuid: undefined,
          ugcType: testUgcSearchParameters.ugcType,
          carId: carInput.id,
          keywords: testUgcSearchParameters.keywords,
          isFeatured: testUgcSearchParameters.isFeatured,
        } as UgcSearchFilters);
      });
    });
  });
});
