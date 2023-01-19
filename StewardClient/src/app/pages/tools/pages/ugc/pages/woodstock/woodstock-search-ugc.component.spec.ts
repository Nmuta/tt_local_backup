import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { WoodstockPlayerXuidUgcFakeApi } from '@interceptors/fake-api/apis/title/woodstock/player/xuid/ugc';
import { WoodstockSearchUgcComponent } from './woodstock-search-ugc.component';
import { UgcSearchFilters, UgcType } from '@models/ugc-filters';
import { fakeBigNumber, faker } from '@interceptors/fake-api/utility';
import { createMockWoodstockUgcLookupService } from '@services/api-v2/woodstock/ugc/lookup/woodstock-ugc-lookup.service.mock';
import { WoodstockUgcSearchService } from '@services/api-v2/woodstock/ugc/woodstock-ugc-search.service';
import { createMockWoodstockService } from '@services/woodstock';

describe('WoodstockUgcSearchUgcComponent', () => {
  const testUgcSearchParameters = {
    ugcType: UgcType.Livery,
    carId: fakeBigNumber(),
    keywords: faker.random.word(),
    isFeatured: faker.datatype.boolean(),
  } as UgcSearchFilters;
  let fixture: ComponentFixture<WoodstockSearchUgcComponent>;
  let component: WoodstockSearchUgcComponent;

  let mockWoodstockUgcLookupService: WoodstockUgcSearchService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
      ],
      declarations: [WoodstockSearchUgcComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockWoodstockUgcLookupService(), createMockWoodstockService()],
    }).compileComponents();

    fixture = TestBed.createComponent(WoodstockSearchUgcComponent);
    component = fixture.debugElement.componentInstance;
    mockWoodstockUgcLookupService = TestBed.inject(WoodstockUgcSearchService);
    component.formControls.ugcFilters.setValue(testUgcSearchParameters);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: searchUgc', () => {
    describe('and getSystemUgc$ returns ugc', () => {
      const ugc = WoodstockPlayerXuidUgcFakeApi.makeMany();
      beforeEach(() => {
        mockWoodstockUgcLookupService.searchUgc$ = jasmine
          .createSpy('searchUgc$')
          .and.returnValue(of(ugc));
        component.ngOnInit();
      });

      it('should set ugc', () => {
        component.searchUgc();

        expect(mockWoodstockUgcLookupService.searchUgc$).toHaveBeenCalled();
        expect(component.ugcContent).toBe(ugc);
        expect(component.getMonitor?.isActive).toBe(false);
        expect(component.getMonitor?.status?.error).toBeNull();
      });
    });

    describe('And getSystemUgc$  throws error', () => {
      const error = { message: faker.random.words(10) };
      beforeEach(() => {
        mockWoodstockUgcLookupService.searchUgc$ = jasmine
          .createSpy('searchUgc$')
          .and.returnValue(throwError(error));
        component.ngOnInit();
      });

      it('should set error', () => {
        component.searchUgc();

        expect(mockWoodstockUgcLookupService.searchUgc$).toHaveBeenCalled();
        expect(component.ugcContent).toEqual([]);
        expect(component.getMonitor?.isActive).toBe(false);
        expect(component.getMonitor?.status?.error).toEqual(error);
      });
    });
  });
});
