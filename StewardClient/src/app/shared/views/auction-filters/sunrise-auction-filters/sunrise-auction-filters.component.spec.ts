import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { SunriseAuctionFiltersComponent } from './sunrise-auction-filters.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SimpleCar } from '@models/cars';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import faker from '@faker-js/faker';
import { MakeModelFilterGroup } from '@views/ugc-filters/ugc-filters.base.component';
import { createMockSunriseService, SunriseService } from '@services/sunrise';
import { AuctionFilters, AuctionSort, AuctionStatus } from '@models/auction-filters';

describe('SunriseAuctionFiltersComponent', () => {
  let fixture: ComponentFixture<SunriseAuctionFiltersComponent>;
  let component: SunriseAuctionFiltersComponent;

  // const formBuilder: FormBuilder = new FormBuilder();
  let mockStore: Store;
  let mockSunriseService: SunriseService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot(),
        ReactiveFormsModule,
        MatAutocompleteModule,
      ],
      declarations: [SunriseAuctionFiltersComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockSunriseService()],
    }).compileComponents();

    const injector = getTestBed();
    mockStore = injector.inject(Store);

    fixture = TestBed.createComponent(SunriseAuctionFiltersComponent);
    component = fixture.debugElement.componentInstance;
    mockSunriseService = TestBed.inject(SunriseService);

    mockStore.select = jasmine.createSpy('select').and.returnValue(of([]));
    mockStore.dispatch = jasmine.createSpy('dispatch').and.returnValue(of({}));
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    describe('When getSimpleCars$() returns valid data', () => {
      const car: SimpleCar = {
        id: fakeBigNumber(),
        makeId: fakeBigNumber(),
        make: faker.random.word(),
        model: faker.random.word(),
        makeOnly: false,
      };

      const filterGroup: MakeModelFilterGroup = {
        category: faker.random.word(),
        items: [],
      };

      beforeEach(() => {
        component.getSimpleCars$ = jasmine
          .createSpy('getSimpleCars$')
          .and.returnValue(of([car] as SimpleCar[]));
        component.buildMatAutocompleteState = jasmine
          .createSpy('buildMatAutocompleteState')
          .and.returnValue([filterGroup] as MakeModelFilterGroup[]);
      });

      it('should build dropdown properties', () => {
        component.ngOnInit();

        expect(component.buildMatAutocompleteState).toHaveBeenCalledWith([car]);
        expect(component.makeModelFilterGroups).toEqual([filterGroup]);
      });
    });
  });

  describe('Method: getSimpleCars', () => {
    beforeEach(() => {
      mockSunriseService.getSimpleCars$ = jasmine
        .createSpy('getSimpleCars')
        .and.returnValue(of([]));
    });

    it('should call SunriseService.getSimpleCars$()', () => {
      component.getSimpleCars$();

      expect(mockSunriseService.getSimpleCars$).toHaveBeenCalled();
    });
  });

  describe('Method: searchFilters', () => {
    describe('When carId filter is selected', () => {
      const carId = fakeBigNumber();
      const sort = AuctionSort.ClosingDateAscending;
      const status = AuctionStatus.Any;

      beforeEach(() => {
        component.newAuctionFilterSearch.emit = jasmine.createSpy('newAuctionFilterSearch.emit');
        component.formControls.makeModelInput.setValue({
          id: carId,
          makeId: undefined,
          make: faker.random.word(),
          model: faker.random.word(),
          makeOnly: false,
        } as SimpleCar);
        component.formControls.sort.setValue(sort);
        component.formControls.status.setValue(status);
      });

      it('should emit correct filters', () => {
        component.searchFilters();

        expect(component.newAuctionFilterSearch.emit).toHaveBeenCalledWith({
          carId: carId,
          makeId: undefined,
          status: status,
          sort: sort,
        } as AuctionFilters);
      });
    });

    describe('When makeId filter is selected', () => {
      const makeId = fakeBigNumber();
      const sort = AuctionSort.ClosingDateAscending;
      const status = AuctionStatus.Any;

      beforeEach(() => {
        component.newAuctionFilterSearch.emit = jasmine.createSpy('newAuctionFilterSearch.emit');
        component.formControls.makeModelInput.setValue({
          id: undefined,
          makeId: makeId,
          make: faker.random.word(),
          model: faker.random.word(),
          makeOnly: true,
        } as SimpleCar);
        component.formControls.sort.setValue(sort);
        component.formControls.status.setValue(status);
      });

      it('should emit correct filters', () => {
        component.searchFilters();

        expect(component.newAuctionFilterSearch.emit).toHaveBeenCalledWith({
          carId: undefined,
          makeId: makeId,
          status: status,
          sort: sort,
        } as AuctionFilters);
      });
    });
  });
});
