import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SteelheadPlayerXuidUgcFakeApi } from '@interceptors/fake-api/apis/title/steelhead/player/xuid/ugc';
import { SteelheadSearchUgcComponent } from './steelhead-search-ugc.component';
import { UgcSearchFilters, UgcType } from '@models/ugc-filters';
import { fakeBigNumber, faker } from '@interceptors/fake-api/utility';

describe('SteelheadUgcSearchUgcComponent', () => {
  const testUgcSearchParameters = {
    ugcType: UgcType.Livery,
    carId: fakeBigNumber(),
    keywords: faker.random.word(),
    isFeatured: faker.datatype.boolean(),
  } as UgcSearchFilters;
  let fixture: ComponentFixture<SteelheadSearchUgcComponent>;
  let component: SteelheadSearchUgcComponent;

  let mockStore: Store;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot(),
        ReactiveFormsModule,
        MatAutocompleteModule,
      ],
      declarations: [SteelheadSearchUgcComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [],
    }).compileComponents();

    const injector = getTestBed();
    mockStore = injector.inject(Store);

    fixture = TestBed.createComponent(SteelheadSearchUgcComponent);
    component = fixture.debugElement.componentInstance;

    mockStore.select = jasmine.createSpy('select').and.returnValue(of([]));
    mockStore.dispatch = jasmine.createSpy('dispatch').and.returnValue(of({}));
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: changeUgcSearchParameters', () => {
    describe('And getSystemUgc$ returns ugc', () => {
      const ugc = SteelheadPlayerXuidUgcFakeApi.makeMany();
      beforeEach(() => {
        component.getSystemUgc$ = jasmine.createSpy('getSystemUgc$').and.returnValue(of(ugc));
        component.ngOnInit();
      });

      it('should set ugc', () => {
        component.changeUgcSearchParameters(testUgcSearchParameters);

        expect(component.getSystemUgc$).toHaveBeenCalled();
        expect(component.ugcContent).toBe(ugc);
        expect(component.getMonitor?.isActive).toBe(false);
        expect(component.getMonitor?.status?.error).toBeNull();
      });
    });

    describe('And getSystemUgc$ returns with error', () => {
      const error = { message: faker.random.words(10) };
      beforeEach(() => {
        component.getSystemUgc$ = jasmine
          .createSpy('getSystemUgc$')
          .and.returnValue(throwError(error));
        component.ngOnInit();
      });

      it('should set error', () => {
        component.changeUgcSearchParameters(testUgcSearchParameters);

        expect(component.getSystemUgc$).toHaveBeenCalled();
        expect(component.ugcContent).toEqual([]);
        expect(component.getMonitor?.isActive).toBe(false);
        expect(component.getMonitor?.status?.error).toEqual(error);
      });
    });
  });
});
