import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SteelheadPlayerXuidUgcFakeApi } from '@interceptors/fake-api/apis/title/steelhead/player/xuid/ugc';
import { SteelheadSearchUgcComponent } from './steelhead-search-ugc.component';
import { UgcSearchFilters, UgcType } from '@models/ugc-filters';
import { fakeBigNumber, faker } from '@interceptors/fake-api/utility';
import { createMockSteelheadUgcLookupService } from '@services/api-v2/steelhead/ugc/lookup/steelhead-ugc-lookup.service.mock';
import { createMockSteelheadItemsService } from '@services/api-v2/steelhead/items/steelhead-items.service.mock';
import { SteelheadUgcLookupService } from '@services/api-v2/steelhead/ugc/lookup/steelhead-ugc-lookup.service';

describe('SteelheadUgcSearchUgcComponent', () => {
  const testUgcSearchParameters = {
    ugcType: UgcType.Livery,
    carId: fakeBigNumber(),
    keywords: faker.random.word(),
    isFeatured: faker.datatype.boolean(),
  } as UgcSearchFilters;
  let fixture: ComponentFixture<SteelheadSearchUgcComponent>;
  let component: SteelheadSearchUgcComponent;

  let mockSteelheadUgcLookupService: SteelheadUgcLookupService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
      ],
      declarations: [SteelheadSearchUgcComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockSteelheadUgcLookupService(), createMockSteelheadItemsService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SteelheadSearchUgcComponent);
    component = fixture.debugElement.componentInstance;
    mockSteelheadUgcLookupService = TestBed.inject(SteelheadUgcLookupService);
    component.formControls.ugcFilters.setValue(testUgcSearchParameters);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: searchUgc', () => {
    describe('and getSystemUgc$ returns ugc', () => {
      const ugc = SteelheadPlayerXuidUgcFakeApi.makeMany();
      beforeEach(() => {
        mockSteelheadUgcLookupService.searchUgc$ = jasmine
          .createSpy('searchUgc$')
          .and.returnValue(of(ugc));
        component.ngOnInit();
      });

      it('should set ugc', () => {
        component.searchUgc();

        expect(mockSteelheadUgcLookupService.searchUgc$).toHaveBeenCalled();
        expect(component.ugcContent).toBe(ugc);
        expect(component.getMonitor?.isActive).toBe(false);
        expect(component.getMonitor?.status?.error).toBeNull();
      });
    });

    describe('And getSystemUgc$  throws error', () => {
      const error = { message: faker.random.words(10) };
      beforeEach(() => {
        mockSteelheadUgcLookupService.searchUgc$ = jasmine
          .createSpy('searchUgc$')
          .and.returnValue(throwError(error));
        component.ngOnInit();
      });

      it('should set error', () => {
        component.searchUgc();

        expect(mockSteelheadUgcLookupService.searchUgc$).toHaveBeenCalled();
        expect(component.ugcContent).toEqual([]);
        expect(component.getMonitor?.isActive).toBe(false);
        expect(component.getMonitor?.status?.error).toEqual(error);
      });
    });
  });
});
